import { BOOKING_RULES } from "@/backend/domain/constants";
import type { TimeRange } from "@/backend/domain/types";
import {
  InvalidEmailError,
  InvalidTimeRangeError,
  PastBookingError,
} from "@/backend/domain/errors/domain-errors";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function assertValidEmail(email: string): void {
  if (!EMAIL_PATTERN.test(email)) {
    throw new InvalidEmailError();
  }
}

export function assertValidTimeRange({ startAt, endAt }: TimeRange): void {
  if (!(startAt instanceof Date) || !(endAt instanceof Date)) {
    throw new InvalidTimeRangeError("Las fechas deben ser instancias de Date");
  }

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new InvalidTimeRangeError("Las fechas no son válidas");
  }

  if (endAt <= startAt) {
    throw new InvalidTimeRangeError(
      "La hora de fin debe ser posterior a la de inicio",
    );
  }

  const durationMinutes = (endAt.getTime() - startAt.getTime()) / 60_000;

  if (durationMinutes < BOOKING_RULES.minDurationMinutes) {
    throw new InvalidTimeRangeError(
      `La duración mínima es de ${BOOKING_RULES.minDurationMinutes} minutos`,
    );
  }
}

export function assertNotInPast(startAt: Date, now: Date = new Date()): void {
  const toleranceMs = BOOKING_RULES.pastToleranceMinutes * 60_000;
  if (startAt.getTime() < now.getTime() - toleranceMs) {
    throw new PastBookingError();
  }
}
