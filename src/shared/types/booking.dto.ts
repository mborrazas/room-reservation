export type BookingStatusDto = "confirmed" | "cancelled";

export interface BookingDto {
  id: string;
  roomId: string;
  title: string;
  organizerName: string;
  organizerEmail: string;
  startAt: string;
  endAt: string;
  status: BookingStatusDto;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  roomId: string;
  title: string;
  organizerName: string;
  organizerEmail: string;
  startAt: string;
  endAt: string;
  notes?: string;
}

export interface UpdateBookingPayload {
  roomId?: string;
  title?: string;
  organizerName?: string;
  organizerEmail?: string;
  startAt?: string;
  endAt?: string;
  notes?: string;
}

export interface BookingListFilters {
  roomId?: string;
  organizerEmail?: string;
  status?: BookingStatusDto;
  from?: string;
  to?: string;
}
