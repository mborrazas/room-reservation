import { CalendarDays } from "lucide-react";

import { CreateBookingDialog } from "@/frontend/components/bookings/create-booking-dialog";
import type { RoomDto } from "@/shared/types/room.dto";

interface AppHeaderProps {
  bookingCount: number;
  rooms: RoomDto[];
}

export function AppHeader({ bookingCount, rooms }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 glass-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25">
            <CalendarDays className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              Office Reserve
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Reservas de salas
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-border/80 bg-muted/60 px-3.5 py-1.5 text-sm text-muted-foreground shadow-sm">
            {bookingCount === 1
              ? "1 reserva programada"
              : `${bookingCount} reservas programadas`}
          </div>
          <CreateBookingDialog rooms={rooms} />
        </div>
      </div>
    </header>
  );
}
