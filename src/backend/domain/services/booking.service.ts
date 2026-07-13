import { hasBookingConflict } from "@/backend/domain/availability/has-booking-conflict";
import {
  BookingAlreadyCancelledError,
  BookingConflictError,
  BookingNotFoundError,
  RoomInactiveError,
  RoomNotFoundError,
} from "@/backend/domain/errors/domain-errors";
import type {
  Booking,
  BookingFilters,
  CreateBookingInput,
  UpdateBookingInput,
} from "@/backend/domain/types";
import {
  assertNotInPast,
  assertValidEmail,
  assertValidTimeRange,
} from "@/backend/domain/validation/booking-rules";
import type { IBookingRepository } from "@/backend/repositories/interfaces/booking.repository.interface";
import type { IRoomRepository } from "@/backend/repositories/interfaces/room.repository.interface";

export class BookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly roomRepository: IRoomRepository,
  ) {}

  async createBooking(input: CreateBookingInput): Promise<Booking> {
    this.assertRequiredFields(input);
    assertValidEmail(input.organizerEmail);

    const timeRange = { startAt: input.startAt, endAt: input.endAt };
    assertValidTimeRange(timeRange);
    assertNotInPast(input.startAt);

    await this.assertRoomAvailable(input.roomId);
    await this.assertNoConflict({
      roomId: input.roomId,
      startAt: input.startAt,
      endAt: input.endAt,
    });

    
    return this.bookingRepository.create(input);
  }

  async updateBooking(
    id: string,
    input: UpdateBookingInput,
  ): Promise<Booking> {
    const existing = await this.bookingRepository.findById(id);
    if (!existing) {
      throw new BookingNotFoundError();
    }

    if (existing.status === "cancelled") {
      throw new BookingAlreadyCancelledError();
    }

    const merged = {
      roomId: input.roomId ?? existing.roomId,
      title: input.title ?? existing.title,
      organizerName: input.organizerName ?? existing.organizerName,
      organizerEmail: input.organizerEmail ?? existing.organizerEmail,
      startAt: input.startAt ?? existing.startAt,
      endAt: input.endAt ?? existing.endAt,
      notes: input.notes ?? existing.notes,
    };

    if (input.organizerEmail) {
      assertValidEmail(merged.organizerEmail);
    }

    const timeRange = { startAt: merged.startAt, endAt: merged.endAt };
    assertValidTimeRange(timeRange);
    assertNotInPast(merged.startAt);

    await this.assertRoomAvailable(merged.roomId);
    await this.assertNoConflict(
      {
        roomId: merged.roomId,
        startAt: merged.startAt,
        endAt: merged.endAt,
      },
      id,
    );

    return this.bookingRepository.update(id, input);
  }

  async deleteBooking(id: string): Promise<void> {
    const existing = await this.bookingRepository.findById(id);
    if (!existing) {
      throw new BookingNotFoundError();
    }

    if (existing.status === "cancelled") {
      throw new BookingAlreadyCancelledError();
    }

    await this.bookingRepository.delete(id);
  }

  async listBookings(filters?: BookingFilters): Promise<Booking[]> {
    return this.bookingRepository.findAll(filters);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  private assertRequiredFields(input: CreateBookingInput): void {
    if (!input.roomId.trim()) {
      throw new Error("roomId es obligatorio");
    }
    if (!input.title.trim()) {
      throw new Error("title es obligatorio");
    }
    if (!input.organizerName.trim()) {
      throw new Error("organizerName es obligatorio");
    }
    if (!input.organizerEmail.trim()) {
      throw new Error("organizerEmail es obligatorio");
    }
  }

  private async assertRoomAvailable(roomId: string): Promise<void> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new RoomNotFoundError();
    }
    if (!room.isActive) {
      throw new RoomInactiveError();
    }
  }

  private async assertNoConflict(
    candidate: { roomId: string; startAt: Date; endAt: Date },
    excludeBookingId?: string,
  ): Promise<void> {
    const confirmedBookings =
      await this.bookingRepository.findConfirmedByRoom(candidate.roomId);

    if (hasBookingConflict(candidate, confirmedBookings, excludeBookingId)) {
      throw new BookingConflictError();
    }
  }
}
