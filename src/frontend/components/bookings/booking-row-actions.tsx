import { EditBookingDialog } from "@/frontend/components/bookings/edit-booking-dialog";
import { DeleteBookingDialog } from "@/frontend/components/bookings/delete-booking-dialog";
import type { BookingDto } from "@/shared/types/booking.dto";
import type { RoomDto } from "@/shared/types/room.dto";

interface BookingRowActionsProps {
  booking: BookingDto;
  rooms: RoomDto[];
}

export function BookingRowActions({ booking, rooms }: BookingRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <EditBookingDialog booking={booking} rooms={rooms} />
      <DeleteBookingDialog booking={booking} rooms={rooms} />
    </div>
  );
}
