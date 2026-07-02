import { handleRouteError, jsonResponse } from "@/backend/http/error-handler";
import { toRoomDto } from "@/backend/http/mappers";
import { getActiveRooms } from "@/backend/services/booking-service";

export async function GET() {
  try {
    const rooms = getActiveRooms().map(toRoomDto);
    return jsonResponse({ data: rooms });
  } catch (error) {
    return handleRouteError(error);
  }
}
