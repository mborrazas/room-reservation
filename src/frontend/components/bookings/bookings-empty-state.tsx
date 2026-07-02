import { CalendarOff, Sparkles, Users } from "lucide-react";

import { CreateBookingDialog } from "@/frontend/components/bookings/create-booking-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import type { RoomDto } from "@/shared/types/room.dto";

interface BookingsEmptyStateProps {
  rooms: RoomDto[];
}

export function BookingsEmptyState({ rooms }: BookingsEmptyStateProps) {
  return (
    <Card className="overflow-hidden border-dashed border-primary/20 bg-card/80 shadow-lg shadow-primary/5 backdrop-blur-sm">
      <CardHeader className="flex flex-col items-center border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent pb-10 text-center">
        <div className="relative mb-5">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
            <CalendarOff className="size-9" aria-hidden="true" />
          </div>
          <Sparkles
            className="absolute -right-1 -top-1 size-5 text-primary/60"
            aria-hidden="true"
          />
        </div>
        <CardTitle className="text-center text-2xl font-semibold tracking-tight">
          No hay reservas programadas
        </CardTitle>
        <CardDescription className="mx-auto max-w-lg text-center text-base leading-relaxed">
          Empezá reservando una sala para tu próxima reunión. Acá verás todas las
          reservas ordenadas por hora.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 px-6 py-10">
        <div className="flex justify-center">
          <CreateBookingDialog
            rooms={rooms}
            triggerLabel="Crear primera reserva"
            triggerSize="default"
          />
        </div>

        <div className="mx-auto grid max-w-sm gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-center shadow-sm">
            <Users className="mx-auto mb-2 size-5 text-primary" />
            <p className="text-sm font-semibold">Salas activas</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              {rooms.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-center shadow-sm">
            <CalendarOff className="mx-auto mb-2 size-5 text-muted-foreground" />
            <p className="text-sm font-semibold">Reservas hoy</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
              0
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
