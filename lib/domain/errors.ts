export class DomainError extends Error {
  constructor(public readonly code: string, message: string, public readonly details?: unknown) {
    super(message);
    this.name = "DomainError";
  }
}
export function errorResponse(error: unknown, requestId: string) {
  if (error instanceof DomainError) {
    return Response.json({ error: { code: error.code, message: error.message, details: error.details }, requestId }, { status: 400 });
  }
  console.error({ requestId, error });
  return Response.json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." }, requestId }, { status: 500 });
}
