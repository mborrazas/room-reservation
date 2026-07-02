import type { UpdateBookingInput } from "@/backend/domain/types";
import { handleRouteError, jsonResponse } from "@/backend/http/error-handler";
import {
  parseDate,
  parseOptionalString,
  toBookingDto,
} from "@/backend/http/mappers";
import { getBookingService } from "@/backend/services/booking-service";

export async function GET(_request: Request, id: string) {
  try {
    const booking = await getBookingService().getBookingById(id);

    if (!booking) {
      return jsonResponse(
        {
          error: {
            code: "BOOKING_NOT_FOUND",
            message: "La reserva no existe",
          },
        },
        404,
      );
    }

    return jsonResponse({ data: toBookingDto(booking) });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, id: string) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      throw new Error("El cuerpo de la solicitud es inválido");
    }

    const data = body as Record<string, unknown>;
    const input: UpdateBookingInput = {};

    if ("roomId" in data) input.roomId = parseOptionalString(data.roomId);
    if ("title" in data) input.title = parseOptionalString(data.title);
    if ("organizerName" in data) {
      input.organizerName = parseOptionalString(data.organizerName);
    }
    if ("organizerEmail" in data) {
      input.organizerEmail = parseOptionalString(data.organizerEmail);
    }
    if ("startAt" in data) input.startAt = parseDate(data.startAt, "startAt");
    if ("endAt" in data) input.endAt = parseDate(data.endAt, "endAt");
    if ("notes" in data) input.notes = parseOptionalString(data.notes);

    if (Object.keys(input).length === 0) {
      throw new Error("Debe enviar al menos un campo para actualizar");
    }

    const booking = await getBookingService().updateBooking(id, input);

    return jsonResponse({ data: toBookingDto(booking) });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, id: string) {
  try {
    await getBookingService().deleteBooking(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
