import type { Room } from "@/backend/domain/types";
import type { IRoomRepository } from "@/backend/repositories/interfaces/room.repository.interface";

export class InMemoryRoomRepository implements IRoomRepository {
  private rooms = new Map<string, Room>();

  constructor(initialRooms: Room[] = []) {
    for (const room of initialRooms) {
      this.rooms.set(room.id, room);
    }
  }

  async findById(id: string): Promise<Room | null> {
    return this.rooms.get(id) ?? null;
  }

  async findAll(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  seed(rooms: Room[]): void {
    for (const room of rooms) {
      this.rooms.set(room.id, room);
    }
  }
}
