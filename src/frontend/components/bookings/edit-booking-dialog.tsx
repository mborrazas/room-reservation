"use client";

import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BookingFormFields,
  type BookingFormState,
} from "@/frontend/components/bookings/booking-form-fields";
import { Button } from "@/frontend/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import { updateBooking } from "@/frontend/api/bookings";
import { useBookingForm } from "@/frontend/hooks/use-booking-form";
import {
  datetimeLocalToIso,
  isoToDatetimeLocalValue,
} from "@/frontend/lib/datetime-local";
import { bookingToast } from "@/frontend/lib/toast";
import { ApiClientError } from "@/shared/types/api";
import type { BookingDto } from "@/shared/types/booking.dto";
import type { RoomDto } from "@/shared/types/room.dto";

interface EditBookingDialogProps {
  booking: BookingDto;
  rooms: RoomDto[];
}

function bookingToFormState(booking: BookingDto): BookingFormState {
  return {
    roomId: booking.roomId,
    title: booking.title,
    organizerName: booking.organizerName,
    organizerEmail: booking.organizerEmail,
    startAt: isoToDatetimeLocalValue(booking.startAt),
    endAt: isoToDatetimeLocalValue(booking.endAt),
    notes: booking.notes ?? "",
  };
}

export function EditBookingDialog({ booking, rooms }: EditBookingDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    form,
    fieldErrors,
    updateField,
    handleFieldBlur,
    validateAll,
    resetForm,
  } = useBookingForm(bookingToFormState(booking));

  useEffect(() => {
    if (open) {
      resetForm(bookingToFormState(booking));
    }
  }, [open, booking, resetForm]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateAll()) {
      bookingToast.validationError();
      return;
    }

    setIsSubmitting(true);

    try {
      await updateBooking(booking.id, {
        roomId: form.roomId,
        title: form.title.trim(),
        organizerName: form.organizerName.trim(),
        organizerEmail: form.organizerEmail.trim(),
        startAt: datetimeLocalToIso(form.startAt),
        endAt: datetimeLocalToIso(form.endAt),
        notes: form.notes.trim() || undefined,
      });

      bookingToast.updated(form.title.trim());
      setOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        bookingToast.apiError(error.message);
      } else {
        bookingToast.networkError();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (booking.status === "cancelled") {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Editar reserva ${booking.title}`}
        onClick={() => setOpen(true)}
      >
        <Pencil aria-hidden="true" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>Editar reserva</DialogTitle>
            <DialogDescription>
              Modificá los datos de la reserva. Se validará la disponibilidad de
              la sala.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="relative space-y-5 px-6 py-5">
            {isSubmitting ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-xl bg-background/60 backdrop-blur-[1px]">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Guardando cambios...
                </div>
              </div>
            ) : null}

            <BookingFormFields
              form={form}
              rooms={rooms}
              idPrefix={`edit-${booking.id}-`}
              fieldErrors={fieldErrors}
              disabled={isSubmitting}
              onFieldChange={updateField}
              onFieldBlur={handleFieldBlur}
            />

            <DialogFooter className="px-0 pb-0 sm:pb-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.roomId}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
