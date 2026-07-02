import { BOOKING_FORM_RULES } from "@/shared/constants/booking-form";
import type { BookingFormState } from "@/frontend/components/bookings/booking-form-fields";

export type BookingFormFieldErrors = Partial<
  Record<keyof BookingFormState, string>
>;

export interface BookingFormValidationResult {
  isValid: boolean;
  fieldErrors: BookingFormFieldErrors;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBookingForm(
  form: BookingFormState,
  now: Date = new Date(),
): BookingFormValidationResult {
  const fieldErrors: BookingFormFieldErrors = {};

  if (!form.roomId.trim()) {
    fieldErrors.roomId = "Seleccioná una sala";
  }

  const title = form.title.trim();
  if (!title) {
    fieldErrors.title = "El título es obligatorio";
  } else if (title.length < 3) {
    fieldErrors.title = "El título debe tener al menos 3 caracteres";
  } else if (title.length > 100) {
    fieldErrors.title = "El título no puede superar los 100 caracteres";
  }

  const organizerName = form.organizerName.trim();
  if (!organizerName) {
    fieldErrors.organizerName = "El nombre del organizador es obligatorio";
  } else if (organizerName.length < 2) {
    fieldErrors.organizerName = "Ingresá un nombre válido";
  }

  const organizerEmail = form.organizerEmail.trim();
  if (!organizerEmail) {
    fieldErrors.organizerEmail = "El email es obligatorio";
  } else if (!EMAIL_PATTERN.test(organizerEmail)) {
    fieldErrors.organizerEmail = "Ingresá un email válido";
  }

  if (!form.startAt) {
    fieldErrors.startAt = "Indicá la fecha y hora de inicio";
  }

  if (!form.endAt) {
    fieldErrors.endAt = "Indicá la fecha y hora de fin";
  }

  const startAt = form.startAt ? new Date(form.startAt) : null;
  const endAt = form.endAt ? new Date(form.endAt) : null;

  if (startAt && Number.isNaN(startAt.getTime())) {
    fieldErrors.startAt = "La fecha de inicio no es válida";
  }

  if (endAt && Number.isNaN(endAt.getTime())) {
    fieldErrors.endAt = "La fecha de fin no es válida";
  }

  if (
    startAt &&
    endAt &&
    !Number.isNaN(startAt.getTime()) &&
    !Number.isNaN(endAt.getTime())
  ) {
    const toleranceMs = BOOKING_FORM_RULES.pastToleranceMinutes * 60_000;
    if (startAt.getTime() < now.getTime() - toleranceMs) {
      fieldErrors.startAt = "No podés reservar un horario en el pasado";
    }

    if (endAt <= startAt) {
      fieldErrors.endAt = "La hora de fin debe ser posterior al inicio";
    } else {
      const durationMinutes =
        (endAt.getTime() - startAt.getTime()) / 60_000;

      if (durationMinutes < BOOKING_FORM_RULES.minDurationMinutes) {
        fieldErrors.endAt = `La duración mínima es de ${BOOKING_FORM_RULES.minDurationMinutes} minutos`;
      }
    }
  }

  const notes = form.notes.trim();
  if (notes.length > 500) {
    fieldErrors.notes = "Las notas no pueden superar los 500 caracteres";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function validateBookingFormField(
  field: keyof BookingFormState,
  form: BookingFormState,
  now: Date = new Date(),
): string | undefined {
  return validateBookingForm(form, now).fieldErrors[field];
}
