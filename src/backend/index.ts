export { GET, POST } from "@/backend/routes/bookings";
export { GET as getBookingById, PATCH, DELETE } from "@/backend/routes/bookings-by-id";
export { GET as getRooms } from "@/backend/routes/rooms";
export {
  getActiveRooms,
  getBookingService,
  resetBookingServiceForTests,
} from "@/backend/services/booking-service";
