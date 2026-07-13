import type { Booking, TimeRange } from "@/backend/domain/types";

export interface ConflictCandidate extends TimeRange {
  roomId: string;
}

/**
 * Determina si un candidato de reserva se solapa con reservas confirmadas existentes.
 * Función pura e independiente: no accede a persistencia ni estado externo.
 */
export function hasBookingConflict(
  candidate: ConflictCandidate,
  existingBookings: Booking[],
  excludeBookingId?: string,
): boolean {
  return existingBookings.some((booking) => {
    if (booking.status !== "confirmed") {
      return false;
    }

    if (excludeBookingId && booking.id === excludeBookingId) {
      return false;
    }

    if (booking.roomId !== candidate.roomId) {
      return false;
    }

    const gapMs = 15 * 60 * 1000;

    return (
      booking.startAt.getTime() < candidate.endAt.getTime() + gapMs &&
      booking.endAt.getTime() + gapMs > candidate.startAt.getTime()
    );
  });
}
