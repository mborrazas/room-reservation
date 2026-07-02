import { describe, expect, it } from "vitest";

import type { BookingFormState } from "@/frontend/components/bookings/booking-form-fields";
import { validateBookingForm } from "@/frontend/lib/booking-form.validation";

const baseForm: BookingFormState = {
  roomId: "room-a",
  title: "Daily standup",
  organizerName: "Ana García",
  organizerEmail: "ana@example.com",
  startAt: "2026-07-02T10:00:00",
  endAt: "2026-07-02T11:00:00",
  notes: "",
};

const now = new Date("2026-07-01T12:00:00");

describe("validateBookingForm", () => {
  it("acepta un formulario válido", () => {
    const result = validateBookingForm(baseForm, now);
    expect(result.isValid).toBe(true);
    expect(result.fieldErrors).toEqual({});
  });

  it("rechaza título demasiado corto", () => {
    const result = validateBookingForm(
      { ...baseForm, title: "AB" },
      now,
    );

    expect(result.isValid).toBe(false);
    expect(result.fieldErrors.title).toBeDefined();
  });

  it("rechaza email inválido", () => {
    const result = validateBookingForm(
      { ...baseForm, organizerEmail: "correo-invalido" },
      now,
    );

    expect(result.isValid).toBe(false);
    expect(result.fieldErrors.organizerEmail).toBeDefined();
  });

  it("rechaza duración menor a 15 minutos", () => {
    const result = validateBookingForm(
      {
        ...baseForm,
        endAt: "2026-07-02T10:10:00",
      },
      now,
    );

    expect(result.isValid).toBe(false);
    expect(result.fieldErrors.endAt).toContain("15 minutos");
  });

  it("rechaza reservas en el pasado", () => {
    const result = validateBookingForm(
      {
        ...baseForm,
        startAt: "2026-06-30T10:00:00",
        endAt: "2026-06-30T11:00:00",
      },
      now,
    );

    expect(result.isValid).toBe(false);
    expect(result.fieldErrors.startAt).toBeDefined();
  });
});
