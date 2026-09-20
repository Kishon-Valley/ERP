import { postSale } from "@/lib/application/sales";
import { errorResponse } from "@/lib/domain/errors";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();
  try {
    const body = await request.json();
    const organizationId = request.headers.get("x-organization-id");
    if (!organizationId) return Response.json({ error: { code: "MISSING_ORGANIZATION", message: "Organization context is required." }, requestId }, { status: 400 });

    const result = await postSale({
      organizationId,
      branchId: body.branchId,
      customerId: body.customerId,
      projectId: body.projectId,
      warehouseId: body.warehouseId,
      idempotencyKey: request.headers.get("idempotency-key") ?? body.idempotencyKey ?? randomUUID(),
      lines: body.lines,
    });
    return Response.json({ data: result, requestId });
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
