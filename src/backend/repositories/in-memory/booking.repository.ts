import type {
  Booking,
  BookingFilters,
  CreateBookingInput,
  UpdateBookingInput,
} from "@/backend/domain/types";
import { sortBookingsBySchedule } from "@/shared/utils/booking-sort";
import type { IBookingRepository } from "@/backend/repositories/interfaces/booking.repository.interface";

export class InMemoryBookingRepository implements IBookingRepository {
  private bookings = new Map<string, Booking>();

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.get(id) ?? null;
  }

  async findAll(filters?: BookingFilters): Promise<Booking[]> {
    let results = Array.from(this.bookings.values());

    if (filters?.roomId) {
      results = results.filter((booking) => booking.roomId === filters.roomId);
    }

    if (filters?.status) {
      results = results.filter((booking) => booking.status === filters.status);
    }

    if (filters?.organizerEmail) {
      results = results.filter(
        (booking) => booking.organizerEmail === filters.organizerEmail,
      );
    }

    if (filters?.from) {
      results = results.filter((booking) => booking.endAt >= filters.from!);
    }

    if (filters?.to) {
      results = results.filter((booking) => booking.startAt <= filters.to!);
    }

    return sortBookingsBySchedule(results);
  }

  async findConfirmedByRoom(roomId: string): Promise<Booking[]> {
    return this.findAll({ roomId, status: "confirmed" });
  }

  async create(data: CreateBookingInput): Promise<Booking> {
    const now = new Date();
    const booking: Booking = {
      id: crypto.randomUUID(),
      roomId: data.roomId,
      title: data.title,
      organizerName: data.organizerName,
      organizerEmail: data.organizerEmail,
      startAt: data.startAt,
      endAt: data.endAt,
      status: "confirmed",
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.bookings.set(booking.id, booking);
    return booking;
  }

  async update(id: string, data: UpdateBookingInput): Promise<Booking> {
    const existing = this.bookings.get(id);
    if (!existing) {
      throw new Error(`Booking ${id} not found`);
    }

    const updated: Booking = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.bookings.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.bookings.delete(id);
  }

  clear(): void {
    this.bookings.clear();
  }
}
