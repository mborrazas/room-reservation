import { describe, expect, it } from "vitest";

import type { BookingDto } from "@/shared/types/booking.dto";
import {
  compareBookingsBySchedule,
  groupBookingsByDay,
  sortBookingsBySchedule,
} from "@/shared/utils/booking-sort";

function createBooking(
  id: string,
  startAt: string,
  endAt: string,
  title = "Reunión",
): BookingDto {
  return {
    id,
    roomId: "room-a",
    title,
    organizerName: "Ana",
    organizerEmail: "ana@example.com",
    startAt: new Date(startAt).toISOString(),
    endAt: new Date(endAt).toISOString(),
    status: "confirmed",
    createdAt: "2026-07-01T12:00:00.000Z",
    updatedAt: "2026-07-01T12:00:00.000Z",
  };
}

describe("booking sort", () => {
  it("ordena reservas del mismo día por hora de inicio", () => {
    const bookings = sortBookingsBySchedule([
      createBooking("3", "2026-07-02T13:00:00", "2026-07-02T14:00:00"),
      createBooking("1", "2026-07-02T09:00:00", "2026-07-02T10:00:00"),
      createBooking("4", "2026-07-02T11:30:00", "2026-07-02T12:00:00"),
      createBooking("2", "2026-07-02T10:00:00", "2026-07-02T11:00:00"),
    ]);

    expect(bookings.map((booking) => booking.id)).toEqual(["1", "2", "4", "3"]);
  });

  it("ordena días cronológicamente y mantiene el orden dentro de cada día", () => {
    const grouped = groupBookingsByDay([
      createBooking("b", "2026-07-03T10:00:00", "2026-07-03T11:00:00"),
      createBooking("a", "2026-07-02T13:00:00", "2026-07-02T14:00:00"),
      createBooking("c", "2026-07-02T09:00:00", "2026-07-02T10:00:00"),
    ]);

    expect(grouped.map((group) => group.dateKey)).toEqual([
      "2026-07-02",
      "2026-07-03",
    ]);
    expect(grouped[0]?.bookings.map((booking) => booking.id)).toEqual([
      "c",
      "a",
    ]);
  });

  it("usa la hora de fin como desempate", () => {
    const earlierEnd = createBooking(
      "a",
      "2026-07-02T10:00:00",
      "2026-07-02T11:00:00",
    );
    const laterEnd = createBooking(
      "b",
      "2026-07-02T10:00:00",
      "2026-07-02T12:00:00",
    );

    expect(compareBookingsBySchedule(earlierEnd, laterEnd)).toBeLessThan(0);
  });
});
