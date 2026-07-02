import { Clock3, Mail, MapPin, User } from "lucide-react";

import { BookingRowActions } from "@/frontend/components/bookings/booking-row-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Separator } from "@/frontend/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import { getRoomName } from "@/frontend/api/rooms";
import { groupBookingsByDay } from "@/shared/utils/booking-sort";
import {
  formatDate,
  formatDuration,
  formatTime,
} from "@/frontend/lib/format-datetime";
import type { BookingDto } from "@/shared/types/booking.dto";
import type { RoomDto } from "@/shared/types/room.dto";

interface BookingsTableProps {
  bookings: BookingDto[];
  rooms: RoomDto[];
}

export function BookingsTable({ bookings, rooms }: BookingsTableProps) {
  const groupedBookings = groupBookingsByDay(bookings);

  return (
    <div className="space-y-6">
      {groupedBookings.map(({ dateKey, date, bookings: dayBookings }) => (
        <Card
          key={dateKey}
          className="overflow-hidden border-border/70 py-0 shadow-md shadow-slate-900/5"
        >
          <CardHeader className="border-b border-border/60 bg-gradient-to-r from-muted/50 to-muted/20 px-6 py-4">
            <CardTitle className="text-base font-semibold">
              {formatDate(date)}
            </CardTitle>
            <CardDescription>
              {dayBookings.length === 1
                ? "1 reserva"
                : `${dayBookings.length} reservas`}{" "}
              · ordenadas por hora de inicio
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 bg-muted/20 hover:bg-muted/20">
                  <TableHead className="w-28 pl-6 font-semibold">Inicio</TableHead>
                  <TableHead className="font-semibold">Duración</TableHead>
                  <TableHead className="font-semibold">Sala</TableHead>
                  <TableHead className="font-semibold">Reunión</TableHead>
                  <TableHead className="font-semibold">Organizador</TableHead>
                  <TableHead className="pr-6 text-right font-semibold">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayBookings.map((booking, index) => {
                  const startAt = new Date(booking.startAt);
                  const endAt = new Date(booking.endAt);

                  return (
                    <TableRow
                      key={booking.id}
                      className={
                        index % 2 === 0
                          ? "bg-background hover:bg-muted/30"
                          : "bg-muted/10 hover:bg-muted/30"
                      }
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Clock3 className="size-4" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="font-semibold tabular-nums text-foreground">
                              {formatTime(startAt)}
                            </p>
                            <p className="text-xs tabular-nums text-muted-foreground">
                              hasta {formatTime(endAt)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          {formatDuration(startAt, endAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin
                            className="size-4 shrink-0 text-primary/70"
                            aria-hidden="true"
                          />
                          <span className="font-medium">
                            {getRoomName(rooms, booking.roomId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.title}</p>
                          {booking.notes ? (
                            <p className="max-w-xs truncate text-xs text-muted-foreground">
                              {booking.notes}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User
                              className="size-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            {booking.organizerName}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="size-3.5" aria-hidden="true" />
                            {booking.organizerEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <BookingRowActions booking={booking} rooms={rooms} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Separator className="bg-border/60" />

            <div className="px-6 py-3 text-xs text-muted-foreground sm:hidden">
              Deslizá horizontalmente para ver todas las columnas.
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
