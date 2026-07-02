import { apiFetch } from "@/frontend/api/http";
import type { RoomDto } from "@/shared/types/room.dto";

export async function getRooms(): Promise<RoomDto[]> {
  return apiFetch<RoomDto[]>("/api/rooms");
}

export function getRoomName(rooms: RoomDto[], roomId: string): string {
  return rooms.find((room) => room.id === roomId)?.name ?? roomId;
}
