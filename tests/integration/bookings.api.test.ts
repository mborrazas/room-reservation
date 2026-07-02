import { afterEach, describe, expect, it } from "vitest";

import { GET, POST } from "@/backend/routes/bookings";
import {
  DELETE,
  GET as getBookingById,
  PATCH,
} from "@/backend/routes/bookings-by-id";
import {
  getBookingService,
  resetBookingServiceForTests,
} from "@/backend/services/booking-service";

function buildCreatePayload(overrides: Record<string, unknown> = {}) {
  return {
    roomId: "room-a",
    title: "Daily standup",
    organizerName: "Ana",
    organizerEmail: "ana@example.com",
    startAt: "2026-07-02T10:00:00",
    endAt: "2026-07-02T11:00:00",
    ...overrides,
  };
}

describe("API /api/bookings", () => {
  afterEach(() => {
    resetBookingServiceForTests();
  });

  it("GET lista reservas vacías inicialmente", async () => {
    const response = await GET(new Request("http://localhost/api/bookings"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual([]);
  });

  it("POST crea una reserva", async () => {
    const response = await POST(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildCreatePayload()),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.title).toBe("Daily standup");
    expect(body.data.roomId).toBe("room-a");
  });

  it("GET filtra por organizerEmail", async () => {
    await getBookingService().createBooking({
      roomId: "room-a",
      title: "A",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    await getBookingService().createBooking({
      roomId: "room-a",
      title: "B",
      organizerName: "Bob",
      organizerEmail: "bob@example.com",
      startAt: new Date("2026-07-03T10:00:00"),
      endAt: new Date("2026-07-03T11:00:00"),
    });

    const response = await GET(
      new Request(
        "http://localhost/api/bookings?organizerEmail=ana@example.com",
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].title).toBe("A");
  });

  it("PATCH actualiza una reserva", async () => {
    const created = await getBookingService().createBooking({
      roomId: "room-a",
      title: "Original",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    const response = await PATCH(
      new Request(`http://localhost/api/bookings/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Actualizado" }),
      }),
      created.id,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.title).toBe("Actualizado");
  });

  it("DELETE elimina una reserva", async () => {
    const created = await getBookingService().createBooking({
      roomId: "room-a",
      title: "Para borrar",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    const response = await DELETE(
      new Request(`http://localhost/api/bookings/${created.id}`, {
        method: "DELETE",
      }),
      created.id,
    );

    expect(response.status).toBe(204);

    const getResponse = await getBookingById(
      new Request(`http://localhost/api/bookings/${created.id}`),
      created.id,
    );

    expect(getResponse.status).toBe(404);
  });

  it("POST devuelve 409 ante conflictos", async () => {
    await getBookingService().createBooking({
      roomId: "room-a",
      title: "Existente",
      organizerName: "Ana",
      organizerEmail: "ana@example.com",
      startAt: new Date("2026-07-02T10:00:00"),
      endAt: new Date("2026-07-02T11:00:00"),
    });

    const response = await POST(
      new Request("http://localhost/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildCreatePayload({
            startAt: "2026-07-02T10:30:00",
            endAt: "2026-07-02T11:30:00",
          }),
        ),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error.code).toBe("BOOKING_CONFLICT");
  });
});
