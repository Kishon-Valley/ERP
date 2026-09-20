import { sql, type SqlExecutor } from "@/lib/db";
import { DomainError } from "@/lib/domain/errors";

type CheckoutLine = { productId: string; warehouseId: string; uom: string; quantity: number };
type StockBalanceRow = { on_hand: string | number; reserved: string | number };

export async function reserveStock(
  organizationId: string,
  salesOrderId: string,
  lines: CheckoutLine[],
  executor: SqlExecutor = sql as unknown as SqlExecutor,
) {
  for (const line of lines) {
    if (line.quantity <= 0) throw new DomainError("INVALID_QUANTITY", "Quantity must be greater than zero.");

    const rows = (await executor`
      select on_hand, reserved
      from stock_balances
      where organization_id = ${organizationId}
        and warehouse_id = ${line.warehouseId}
        and product_id = ${line.productId}
      for update
    `) as unknown as StockBalanceRow[];

    const balance = rows[0];
    if (!balance) throw new DomainError("STOCK_NOT_FOUND", "No stock balance exists for the selected product and warehouse.");
    const available = Number(balance.on_hand) - Number(balance.reserved);
    if (available < line.quantity) {
      throw new DomainError("INSUFFICIENT_STOCK", "Insufficient available stock.", { available, requested: line.quantity });
    }

    await executor`
      update stock_balances
      set reserved = reserved + ${line.quantity}
      where organization_id = ${organizationId}
        and warehouse_id = ${line.warehouseId}
        and product_id = ${line.productId}
    `;

    await executor`
      insert into stock_reservations
        (organization_id, warehouse_id, product_id, reference_type, reference_id, quantity)
      values
        (${organizationId}, ${line.warehouseId}, ${line.productId}, 'SALES_ORDER', ${salesOrderId}, ${line.quantity})
      on conflict (organization_id, warehouse_id, product_id, reference_type, reference_id)
      do update set quantity = excluded.quantity, status = 'ACTIVE'
    `;
  }
}
