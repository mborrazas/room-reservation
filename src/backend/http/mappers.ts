import type { Booking, BookingStatus } from "@/backend/domain/types";
import type { Room } from "@/backend/domain/types";
import type { BookingDto, BookingStatusDto } from "@/shared/types/booking.dto";
import type { RoomDto } from "@/shared/types/room.dto";

export function toBookingDto(booking: Booking): BookingDto {
  return {
    id: booking.id,
    roomId: booking.roomId,
    title: booking.title,
    organizerName: booking.organizerName,
    organizerEmail: booking.organizerEmail,
    startAt: booking.startAt.toISOString(),
    endAt: booking.endAt.toISOString(),
    status: booking.status as BookingStatusDto,
    notes: booking.notes,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}

export function toRoomDto(room: Room): RoomDto {
  return {
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    floor: room.floor,
    amenities: room.amenities,
    isActive: room.isActive,
  };
}

export function parseDate(value: unknown, fieldName: string): Date {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} debe ser una fecha ISO válida`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} debe ser una fecha ISO válida`);
  }

  return date;
}

export function parseOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error("Se esperaba un string");
  }

  return value;
}

export function parseRequiredString(
  value: unknown,
  fieldName: string,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} es obligatorio`);
  }

  return value.trim();
}

export function parseBookingStatus(value: unknown): BookingStatus | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (value !== "confirmed" && value !== "cancelled") {
    throw new Error("status debe ser 'confirmed' o 'cancelled'");
  }

  return value;
}
