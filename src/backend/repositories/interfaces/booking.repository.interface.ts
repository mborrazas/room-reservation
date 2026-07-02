import type {
  Booking,
  BookingFilters,
  CreateBookingInput,
  UpdateBookingInput,
} from "@/backend/domain/types";

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findAll(filters?: BookingFilters): Promise<Booking[]>;
  findConfirmedByRoom(roomId: string): Promise<Booking[]>;
  create(data: CreateBookingInput): Promise<Booking>;
  update(id: string, data: UpdateBookingInput): Promise<Booking>;
  delete(id: string): Promise<void>;
}
