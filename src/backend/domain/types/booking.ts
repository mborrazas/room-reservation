export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  organizerName: string;
  organizerEmail: string;
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBookingInput {
  roomId: string;
  title: string;
  organizerName: string;
  organizerEmail: string;
  startAt: Date;
  endAt: Date;
  notes?: string;
}

export interface UpdateBookingInput {
  roomId?: string;
  title?: string;
  organizerName?: string;
  organizerEmail?: string;
  startAt?: Date;
  endAt?: Date;
  notes?: string;
}

export interface BookingFilters {
  roomId?: string;
  from?: Date;
  to?: Date;
  status?: BookingStatus;
  organizerEmail?: string;
}

export interface TimeRange {
  startAt: Date;
  endAt: Date;
}
