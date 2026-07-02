import { DomainError } from "@/backend/domain/errors/domain-errors";

interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

const DOMAIN_ERROR_STATUS: Record<string, number> = {
  BOOKING_CONFLICT: 409,
  BOOKING_NOT_FOUND: 404,
  ROOM_NOT_FOUND: 404,
  ROOM_INACTIVE: 422,
  INVALID_TIME_RANGE: 422,
  PAST_BOOKING: 422,
  INVALID_EMAIL: 422,
  ALREADY_CANCELLED: 409,
};

export function jsonResponse<T>(data: T, status = 200): Response {
  return Response.json(data, { status });
}

export function handleRouteError(error: unknown): Response {
  if (error instanceof DomainError) {
    const status = DOMAIN_ERROR_STATUS[error.code] ?? 422;

    return jsonResponse<ErrorResponse>(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      status,
    );
  }

  if (error instanceof SyntaxError) {
    return jsonResponse<ErrorResponse>(
      {
        error: {
          code: "INVALID_JSON",
          message: "El cuerpo de la solicitud no es JSON válido",
        },
      },
      400,
    );
  }

  if (error instanceof Error) {
    return jsonResponse<ErrorResponse>(
      {
        error: {
          code: "BAD_REQUEST",
          message: error.message,
        },
      },
      400,
    );
  }

  return jsonResponse<ErrorResponse>(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Error interno del servidor",
      },
    },
    500,
  );
}
