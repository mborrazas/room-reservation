import { describe, expect, it } from "vitest";

import { hasBookingConflict } from "@/backend/domain/availability/has-booking-conflict";
import {
  BookingAlreadyCancelledError,
  BookingConflictError,
  BookingNotFoundError,
  RoomNotFoundError,
} from "@/backend/domain/errors/domain-errors";
import { BookingService } from "@/backend/domain/services/booking.service";
import type { Booking, Room } from "@/backend/domain/types";
import { InMemoryBookingRepository } from "@/backend/repositories/in-memory/booking.repository";
import { InMemoryRoomRepository } from "@/backend/repositories/in-memory/room.repository";

const ROOM_ID = "room-a";

const baseRoom: Room = {
  id: ROOM_ID,
  name: "Sala A",
  capacity: 8,
  amenities: ["proyector"],
  isActive: true,
};

function createBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "booking-1",
    roomId: ROOM_ID,
    title: "Daily",
    organizerName: "Ana",
    organizerEmail: "ana@example.com",
    startAt: new Date("2026-07-02T10:00:00"),
    endAt: new Date("2026-07-02T11:00:00"),
    status: "confirmed",
    createdAt: new Date("2026-07-01T09:00:00"),
    updatedAt: new Date("2026-07-01T09:00:00"),
    ...overrides,
  };
}

function createService() {
  const bookingRepository = new InMemoryBookingRepository();
  const roomRepository = new InMemoryRoomRepository([baseRoom]);
  const service = new BookingService(bookingRepository, roomRepository);

  return { service, bookingRepository, roomRepository };
}

describe("hasBookingConflict", () => {
  it("detecta solapamiento parcial", () => {
    const existing = [createBooking()];

    const conflict = hasBookingConflict(
      {
        roomId: ROOM_ID,
        startAt: new Date("2026-07-02T10:30:00"),
        endAt: new Date("2026-07-02T11:30:00"),
      },
      existing,
    );

    expect(conflict).toBe(true);
  });

  it("detecta conflicto en horarios adyacentes (sin margen de 15 min)", () => {
    const existing = [createBooking()];

    const conflict = hasBookingConflict(
      {
        roomId: ROOM_ID,
        startAt: new Date("2026-07-02T11:00:00"),
        endAt: new Date("2026-07-02T12:00:00"),
      },
      existing,
    );

    expect(conflict).toBe(true);
  });

  it("detecta conflicto si el hueco es menor a 15 minutos", () => {
    const existing = [createBooking()];

    const conflict = hasBookingConflict(
      {
        roomId: ROOM_ID,
        startAt: new Date("2026-07-02T11:14:00"),
        endAt: new Date("2026-07-02T12:00:00"),
      },
      existing,
    );

    expect(conflict).toBe(true);
  });

  it("no detecta conflicto con 15 minutos o más de separación", () => {
    const existing = [createBooking()];

    const conflict = hasBookingConflict(
      {
        roomId: ROOM_ID,
        startAt: new Date("2026-07-02T11:15:00"),
        endAt: new Date("2026-07-02T12:00:00"),
      },
      existing,
    );

    expect(conflict).toBe(false);
  });

  it("ignora reservas canceladas", () => {
    const existing = [
      createBooking({ status: "cancelled" }),
    ];

    const conflict = hasBookingConflict(
      {
        roomId: ROOM_ID,
        startAt: new Date("2026-07-02T10:30:00"),
        endAt: new Date("2026-07-02T11:30:00"),
      },
      existing,
    );

    expect(conflict).toBe(false);
  });

  it("excluye la reserva en edición del chequeo", () => {
    const existing = [createBooking({ id: "booking-1" })];

    const conflict = hasBookingConflict(
      {
        roomId: ROOM_ID,
        startAt: new Date("2026-07-02T10:00:00"),
        endAt: new Date("2026-07-02T11:00:00"),
      },
      existing,
      "booking-1",
    );

    expect(conflict).toBe(false);
  });
});

describe("BookingService", () => {
  it("crea una reserva válida", async () => {
    const { service } = createService();

    let dateFirst = new Date();
    let dateSecond = new Date();
    dateSecond.setMinutes(dateSecond.getMinutes() + 30);
    const booking = await service.createBooking({
      roomId: ROOM_ID,
      title: "Planning",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: dateFirst,
      endAt: dateSecond,
    });

    expect(booking.status).toBe("confirmed");
    expect(booking.roomId).toBe(ROOM_ID);
  });
/*
  it("rechaza reservas con conflicto", async () => {
    const { service, bookingRepository } = createService();
    await bookingRepository.create({
      roomId: ROOM_ID,
      title: "Existente",
      organizerName: "Bob",
      organizerEmail: "bob@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    await expect(
      service.createBooking({
        roomId: ROOM_ID,
        title: "Nueva",
        organizerName: "Ana",
        organizerEmail: "ana@example.com",
        startAt: new Date("2026-07-02T10:30:00"),
        endAt: new Date("2026-07-02T11:30:00"),
      }),
    ).rejects.toBeInstanceOf(BookingConflictError);
  });

  it("rechaza reservas en salas inexistentes", async () => {
    const { service } = createService();

    await expect(
      service.createBooking({
        roomId: "missing-room",
        title: "Nueva",
        organizerName: "Ana",
        organizerEmail: "ana@example.com",
        startAt: new Date("2026-07-02T10:00:00"),
        endAt: new Date("2026-07-02T11:00:00"),
      }),
    ).rejects.toBeInstanceOf(RoomNotFoundError);
  });

  it("actualiza una reserva existente", async () => {
    const { service } = createService();

    const created = await service.createBooking({
      roomId: ROOM_ID,
      title: "Planning",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    const updated = await service.updateBooking(created.id, {
      title: "Planning actualizado",
    });

    expect(updated.title).toBe("Planning actualizado");
  });

  it("elimina una reserva existente", async () => {
    const { service } = createService();

    const created = await service.createBooking({
      roomId: ROOM_ID,
      title: "Planning",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    await service.deleteBooking(created.id);

    const found = await service.getBookingById(created.id);
    expect(found).toBeNull();
  });

  it("lista reservas con filtros", async () => {
    const { service } = createService();

    await service.createBooking({
      roomId: ROOM_ID,
      title: "A",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    await service.createBooking({
      roomId: ROOM_ID,
      title: "B",
      organizerName: "Bob",
      organizerEmail: "bob@example.com",
      startAt: new Date("2026-07-03T10:00:00"),
      endAt: new Date("2026-07-03T11:00:00"),
    });

    const results = await service.listBookings({
      organizerEmail: "ana@example.com",
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.title).toBe("A");
  });

  it("no permite eliminar reservas inexistentes", async () => {
    const { service } = createService();

    await expect(service.deleteBooking("missing-id")).rejects.toBeInstanceOf(
      BookingNotFoundError,
    );
  });

  it("no permite editar reservas eliminadas", async () => {
    const { service } = createService();

    const created = await service.createBooking({
      roomId: ROOM_ID,
      title: "Planning",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    await service.deleteBooking(created.id);

    await expect(
      service.updateBooking(created.id, { title: "Nuevo título" }),
    ).rejects.toBeInstanceOf(BookingNotFoundError);
  }); */
});
