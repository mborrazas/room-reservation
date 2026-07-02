import type { Room } from "@/backend/domain/types";

export interface IRoomRepository {
  findById(id: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
}
