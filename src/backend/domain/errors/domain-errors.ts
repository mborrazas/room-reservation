export type DomainErrorCode =
  | "BOOKING_CONFLICT"
  | "ROOM_NOT_FOUND"
  | "ROOM_INACTIVE"
  | "INVALID_TIME_RANGE"
  | "PAST_BOOKING"
  | "BOOKING_NOT_FOUND"
  | "ALREADY_CANCELLED"
  | "INVALID_EMAIL";

export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: DomainErrorCode,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class BookingConflictError extends DomainError {
  constructor(message = "La sala ya está reservada en ese horario") {
    super(message, "BOOKING_CONFLICT");
    this.name = "BookingConflictError";
  }
}

export class RoomNotFoundError extends DomainError {
  constructor(message = "La sala no existe") {
    super(message, "ROOM_NOT_FOUND");
    this.name = "RoomNotFoundError";
  }
}

export class RoomInactiveError extends DomainError {
  constructor(message = "La sala no está disponible") {
    super(message, "ROOM_INACTIVE");
    this.name = "RoomInactiveError";
  }
}

export class InvalidTimeRangeError extends DomainError {
  constructor(message = "El rango horario no es válido") {
    super(message, "INVALID_TIME_RANGE");
    this.name = "InvalidTimeRangeError";
  }
}

export class PastBookingError extends DomainError {
  constructor(message = "No se pueden reservar horarios en el pasado") {
    super(message, "PAST_BOOKING");
    this.name = "PastBookingError";
  }
}

export class BookingNotFoundError extends DomainError {
  constructor(message = "La reserva no existe") {
    super(message, "BOOKING_NOT_FOUND");
    this.name = "BookingNotFoundError";
  }
}

export class BookingAlreadyCancelledError extends DomainError {
  constructor(message = "La reserva ya fue cancelada") {
    super(message, "ALREADY_CANCELLED");
    this.name = "BookingAlreadyCancelledError";
  }
}

export class InvalidEmailError extends DomainError {
  constructor(message = "El email del organizador no es válido") {
    super(message, "INVALID_EMAIL");
    this.name = "InvalidEmailError";
  }
}
