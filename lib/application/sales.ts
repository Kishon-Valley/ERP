import { sql, withTransaction } from "@/lib/db";
import { DomainError } from "@/lib/domain/errors";
import { reserveStock } from "@/lib/application/inventory";

type Row = Record<string, any>;

export type CheckoutInput = {
  organizationId: string;
  branchId: string;
  customerId: string;
  projectId?: string;
  warehouseId: string;
  idempotencyKey: string;
  lines: Array<{ productId: string; uom: string; quantity: number }>;
};

export async function postSale(input: CheckoutInput) {
  if (!input.lines.length) throw new DomainError("EMPTY_CART", "A sale requires at least one line.");

  return withTransaction(async (tx) => {
    const existing = (await tx`
      select id, total, status from sales_orders
      where organization_id = ${input.organizationId} and idempotency_key = ${input.idempotencyKey}
      for update
    `) as unknown as Row[];
    if (existing[0]) return existing[0];

    const customer = (await tx`
      select credit_limit, credit_hold,
        coalesce((select sum(balance_due) from invoices i where i.organization_id = c.organization_id and i.customer_id = c.id and i.status = 'POSTED'),0) as exposure
      from customers c
      where c.organization_id = ${input.organizationId} and c.id = ${input.customerId}
      for update
    `) as unknown as Row[];
    if (!customer[0]) throw new DomainError("CUSTOMER_NOT_FOUND", "Customer was not found.");
    if (customer[0].credit_hold) throw new DomainError("CREDIT_HOLD", "Customer is on credit hold.");

    const products = (await tx`
      select id, unit_price, tax_rate from products
      where organization_id = ${input.organizationId}
        and id = any(${input.lines.map(x => x.productId)})
        and is_active = true
    `) as unknown as Row[];

    let subtotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    const resolved: Array<{productId:string;uom:string;quantity:number;unitPrice:number;discountRate:number;taxRate:number;lineTotal:number}> = [];

    for (const line of input.lines) {
      const product = products.find(p => p.id === line.productId);
      if (!product) throw new DomainError("PRODUCT_NOT_FOUND", `Product ${line.productId} was not found.`);

      const rule = (await tx`
        select unit_price, discount_rate from price_rules
        where organization_id = ${input.organizationId}
          and product_id = ${line.productId}
          and (customer_id = ${input.customerId} or customer_id is null)
          and (project_id = ${input.projectId ?? null} or project_id is null)
          and (branch_id = ${input.branchId} or branch_id is null)
          and min_quantity <= ${line.quantity}
          and valid_from <= now() and (valid_to is null or valid_to >= now())
        order by
          (project_id is not null) desc,
          (customer_id is not null) desc,
          (branch_id is not null) desc,
          priority desc
        limit 1
      `) as unknown as Row[];

      const unitPrice = Number(rule[0]?.unit_price ?? product.unit_price);
      const discountRate = Number(rule[0]?.discount_rate ?? 0);
      const net = unitPrice * line.quantity * (1 - discountRate);
      const tax = net * Number(product.tax_rate);
      subtotal += unitPrice * line.quantity;
      discountTotal += unitPrice * line.quantity - net;
      taxTotal += tax;
      resolved.push({
        productId: line.productId,
        uom: line.uom,
        quantity: line.quantity,
        unitPrice,
        discountRate,
        taxRate: Number(product.tax_rate),
        lineTotal: net + tax,
      });
    }

    const total = subtotal - discountTotal + taxTotal;
    const exposure = Number(customer[0].exposure);
    if (exposure + total > Number(customer[0].credit_limit)) {
      throw new DomainError("CREDIT_LIMIT_EXCEEDED", "Sale would exceed the customer's available credit.", {
        creditLimit: Number(customer[0].credit_limit),
        currentExposure: exposure,
        requested: total,
      });
    }

    const order = (await tx`
      insert into sales_orders
        (organization_id, branch_id, customer_id, project_id, status, subtotal, discount_total, tax_total, total, idempotency_key)
      values
        (${input.organizationId}, ${input.branchId}, ${input.customerId}, ${input.projectId ?? null}, 'POSTED',
         ${subtotal}, ${discountTotal}, ${taxTotal}, ${total}, ${input.idempotencyKey})
      returning id, total, status
    `) as unknown as Row[];

    if (!order[0]) throw new DomainError("SALE_CREATE_FAILED", "The sale could not be created.");

    for (const line of resolved) {
      await tx`
        insert into sales_order_lines
          (organization_id, sales_order_id, product_id, uom, quantity, unit_price, discount_rate, tax_rate, line_total)
        values
          (${input.organizationId}, ${order[0].id}, ${line.productId}, ${line.uom}, ${line.quantity},
           ${line.unitPrice}, ${line.discountRate}, ${line.taxRate}, ${line.lineTotal})
      `;
    }

    await reserveStock(
      input.organizationId,
      order[0].id,
      input.lines.map(line => ({ ...line, warehouseId: input.warehouseId })),
      tx,
    );

    await tx`
      insert into audit_events (organization_id, action, entity_type, entity_id, metadata)
      values (${input.organizationId}, 'SALE_POSTED', 'SALES_ORDER', ${order[0].id}, ${JSON.stringify({ total })})
    `;

    return order[0];
  });
}
