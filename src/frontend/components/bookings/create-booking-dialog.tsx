"use client";

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { createBooking } from "@/frontend/api/bookings";
import { useBookingForm } from "@/frontend/hooks/use-booking-form";
import {
  datetimeLocalToIso,
  getDefaultBookingTimes,
} from "@/frontend/lib/datetime-local";
import { bookingToast } from "@/frontend/lib/toast";
import { ApiClientError } from "@/shared/types/api";
import type { RoomDto } from "@/shared/types/room.dto";

interface CreateBookingDialogProps {
  rooms: RoomDto[];
  triggerLabel?: string;
  triggerSize?: "default" | "sm" | "lg";
}

function createInitialFormState(rooms: RoomDto[]): BookingFormState {
  const defaults = getDefaultBookingTimes();

  return {
    roomId: rooms[0]?.id ?? "",
    title: "",
    organizerName: "",
    organizerEmail: "",
    startAt: defaults.startAt,
    endAt: defaults.endAt,
    notes: "",
  };
}

export function CreateBookingDialog({
  rooms,
  triggerLabel = "Nueva reserva",
  triggerSize = "sm",
}: CreateBookingDialogProps) {
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
  } = useBookingForm(createInitialFormState(rooms));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateAll()) {
      bookingToast.validationError();
      return;
    }

    setIsSubmitting(true);

    try {
      const booking = await createBooking({
        roomId: form.roomId,
        title: form.title.trim(),
        organizerName: form.organizerName.trim(),
        organizerEmail: form.organizerEmail.trim(),
        startAt: datetimeLocalToIso(form.startAt),
        endAt: datetimeLocalToIso(form.endAt),
        notes: form.notes.trim() || undefined,
      });

      bookingToast.created(booking.title);
      setOpen(false);
      resetForm(createInitialFormState(rooms));
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

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm(createInitialFormState(rooms));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size={triggerSize} />}>
        <Plus aria-hidden="true" />
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Crear reserva</DialogTitle>
          <DialogDescription>
            Completá los datos para reservar una sala de reuniones.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative space-y-5 px-6 py-5">
          {isSubmitting ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-xl bg-background/60 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Creando reserva...
              </div>
            </div>
          ) : null}

          <BookingFormFields
            form={form}
            rooms={rooms}
            fieldErrors={fieldErrors}
            disabled={isSubmitting}
            onFieldChange={updateField}
            onFieldBlur={handleFieldBlur}
          />

          <DialogFooter className="px-0 pb-0 sm:pb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !form.roomId}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Creando...
                </>
              ) : (
                "Crear reserva"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
