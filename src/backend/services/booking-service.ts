import { BookingService } from "@/backend/domain/services/booking.service";
import type { Room } from "@/backend/domain/types";
import { InMemoryBookingRepository } from "@/backend/repositories/in-memory/booking.repository";
import { InMemoryRoomRepository } from "@/backend/repositories/in-memory/room.repository";

const SEED_ROOMS: Room[] = [
  {
    id: "room-a",
    name: "Sala A",
    capacity: 8,
    floor: 1,
    amenities: ["proyector", "pizarra"],
    isActive: true,
  },
  {
    id: "room-b",
    name: "Sala B",
    capacity: 4,
    floor: 2,
    amenities: ["videollamada"],
    isActive: true,
  },
];

declare global {
  var __bookingService: BookingService | undefined;
}

function createBookingService(): BookingService {
  const bookingRepository = new InMemoryBookingRepository();
  const roomRepository = new InMemoryRoomRepository(SEED_ROOMS);
  return new BookingService(bookingRepository, roomRepository);
}

export function getBookingService(): BookingService {
  if (!globalThis.__bookingService) {
    globalThis.__bookingService = createBookingService();
  }

  return globalThis.__bookingService;
}

export function getActiveRooms(): Room[] {
  return SEED_ROOMS.filter((room) => room.isActive);
}

export function resetBookingServiceForTests(): void {
  globalThis.__bookingService = undefined;
}
