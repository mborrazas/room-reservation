"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/frontend/components/ui/alert-dialog";
import { Button } from "@/frontend/components/ui/button";
import { deleteBooking } from "@/frontend/api/bookings";
import { getRoomName } from "@/frontend/api/rooms";
import { formatTimeRange } from "@/frontend/lib/format-datetime";
import { bookingToast } from "@/frontend/lib/toast";
import { ApiClientError } from "@/shared/types/api";
import type { BookingDto } from "@/shared/types/booking.dto";
import type { RoomDto } from "@/shared/types/room.dto";

interface DeleteBookingDialogProps {
  booking: BookingDto;
  rooms: RoomDto[];
}

export function DeleteBookingDialog({
  booking,
  rooms,
}: DeleteBookingDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (booking.status === "cancelled") {
    return null;
  }

  const startAt = new Date(booking.startAt);
  const endAt = new Date(booking.endAt);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await deleteBooking(booking.id);
      bookingToast.deleted(booking.title);
      setOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        bookingToast.apiError(error.message);
      } else {
        bookingToast.networkError();
      }
    } finally {
      setIsDeleting(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) {
      return;
    }
    setOpen(nextOpen);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
          />
        }
      >
        <Trash2 aria-hidden="true" />
        <span className="sr-only">Eliminar reserva {booking.title}</span>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>¿Eliminar esta reserva?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar permanentemente{" "}
            <span className="font-medium text-foreground">{booking.title}</span>{" "}
            en {getRoomName(rooms, booking.roomId)},{" "}
            {formatTimeRange(startAt, endAt)}. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
