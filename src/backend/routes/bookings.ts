import type {
  BookingFilters,
  CreateBookingInput,
  UpdateBookingInput,
} from "@/backend/domain/types";
import { handleRouteError, jsonResponse } from "@/backend/http/error-handler";
import {
  parseBookingStatus,
  parseDate,
  parseOptionalString,
  parseRequiredString,
  toBookingDto,
} from "@/backend/http/mappers";
import { getBookingService } from "@/backend/services/booking-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: BookingFilters = {};

    const roomId = searchParams.get("roomId");
    if (roomId) filters.roomId = roomId;

    const organizerEmail = searchParams.get("organizerEmail");
    if (organizerEmail) filters.organizerEmail = organizerEmail;

    const status = searchParams.get("status");
    if (status) filters.status = parseBookingStatus(status);

    const from = searchParams.get("from");
    if (from) filters.from = parseDate(from, "from");

    const to = searchParams.get("to");
    if (to) filters.to = parseDate(to, "to");

    const bookings = await getBookingService().listBookings(filters);

    return jsonResponse({
      data: bookings.map(toBookingDto),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      throw new Error("El cuerpo de la solicitud es inválido");
    }

    const data = body as Record<string, unknown>;
    const input: CreateBookingInput = {
      roomId: parseRequiredString(data.roomId, "roomId"),
      title: parseRequiredString(data.title, "title"),
      organizerName: parseRequiredString(data.organizerName, "organizerName"),
      organizerEmail: parseRequiredString(data.organizerEmail, "organizerEmail"),
      startAt: parseDate(data.startAt, "startAt"),
      endAt: parseDate(data.endAt, "endAt"),
      notes: parseOptionalString(data.notes),
    };

    const booking = await getBookingService().createBooking(input);

    return jsonResponse({ data: toBookingDto(booking) }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
