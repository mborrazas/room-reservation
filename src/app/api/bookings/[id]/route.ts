import {
  DELETE as deleteBooking,
  GET as getBookingById,
  PATCH as updateBooking,
} from "@/backend/routes/bookings-by-id";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return getBookingById(_request, id);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return updateBooking(request, id);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return deleteBooking(_request, id);
}
