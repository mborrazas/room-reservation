import { apiFetch } from "@/frontend/api/http";
import type {
  BookingDto,
  BookingListFilters,
  CreateBookingPayload,
  UpdateBookingPayload,
} from "@/shared/types/booking.dto";

function buildListUrl(filters?: BookingListFilters) {
  const params = new URLSearchParams();

  if (filters?.roomId) params.set("roomId", filters.roomId);
  if (filters?.organizerEmail) {
    params.set("organizerEmail", filters.organizerEmail);
  }
  if (filters?.status) params.set("status", filters.status);
  if (filters?.from) params.set("from", filters.from);
  if (filters?.to) params.set("to", filters.to);

  const query = params.toString();
  return query ? `/api/bookings?${query}` : "/api/bookings";
}

export async function getBookings(
  filters?: BookingListFilters,
): Promise<BookingDto[]> {
  return apiFetch<BookingDto[]>(buildListUrl(filters));
}

export async function getBooking(id: string): Promise<BookingDto> {
  return apiFetch<BookingDto>(`/api/bookings/${id}`);
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<BookingDto> {
  return apiFetch<BookingDto>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBooking(
  id: string,
  payload: UpdateBookingPayload,
): Promise<BookingDto> {
  return apiFetch<BookingDto>(`/api/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteBooking(id: string): Promise<void> {
  await apiFetch<void>(`/api/bookings/${id}`, {
    method: "DELETE",
  });
}
