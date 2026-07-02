import { cn } from "@/frontend/lib/utils";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { Textarea } from "@/frontend/components/ui/textarea";
import type { BookingFormFieldErrors } from "@/frontend/lib/booking-form.validation";
import type { RoomDto } from "@/shared/types/room.dto";

export interface BookingFormState {
  roomId: string;
  title: string;
  organizerName: string;
  organizerEmail: string;
  startAt: string;
  endAt: string;
  notes: string;
}

interface BookingFormFieldsProps {
  form: BookingFormState;
  rooms: RoomDto[];
  idPrefix?: string;
  fieldErrors?: BookingFormFieldErrors;
  disabled?: boolean;
  onFieldChange: <K extends keyof BookingFormState>(
    field: K,
    value: BookingFormState[K],
  ) => void;
  onFieldBlur?: (field: keyof BookingFormState) => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="text-xs text-destructive">
      {message}
    </p>
  );
}

export function BookingFormFields({
  form,
  rooms,
  idPrefix = "",
  fieldErrors = {},
  disabled = false,
  onFieldChange,
  onFieldBlur,
}: BookingFormFieldsProps) {
  const fieldId = (name: string) => `${idPrefix}${name}`;
  const roomItems = rooms.map((room) => ({
    value: room.id,
    label: `${room.name} · ${room.capacity} personas`,
  }));
  const selectedRoom = rooms.find((room) => room.id === form.roomId);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={fieldId("roomId")}>Sala</Label>
        <Select
          value={form.roomId || null}
          onValueChange={(value) => onFieldChange("roomId", value ?? "")}
          disabled={disabled}
          items={roomItems}
        >
          <SelectTrigger
            id={fieldId("roomId")}
            className={cn("w-full", fieldErrors.roomId && "border-destructive")}
            aria-invalid={Boolean(fieldErrors.roomId)}
          >
            <SelectValue placeholder="Seleccioná una sala">
              {selectedRoom
                ? `${selectedRoom.name} · ${selectedRoom.capacity} personas`
                : null}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name} · {room.capacity} personas
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={fieldErrors.roomId} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={fieldId("title")}>Título de la reunión</Label>
        <Input
          id={fieldId("title")}
          value={form.title}
          onChange={(event) => onFieldChange("title", event.target.value)}
          onBlur={() => onFieldBlur?.("title")}
          placeholder="Daily standup, planning, entrevista..."
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.title)}
          required
        />
        <FieldError message={fieldErrors.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={fieldId("organizerName")}>Organizador</Label>
        <Input
          id={fieldId("organizerName")}
          value={form.organizerName}
          onChange={(event) =>
            onFieldChange("organizerName", event.target.value)
          }
          onBlur={() => onFieldBlur?.("organizerName")}
          placeholder="Nombre y apellido"
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.organizerName)}
          required
        />
        <FieldError message={fieldErrors.organizerName} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={fieldId("organizerEmail")}>Email</Label>
        <Input
          id={fieldId("organizerEmail")}
          type="email"
          value={form.organizerEmail}
          onChange={(event) =>
            onFieldChange("organizerEmail", event.target.value)
          }
          onBlur={() => onFieldBlur?.("organizerEmail")}
          placeholder="nombre@empresa.com"
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.organizerEmail)}
          required
        />
        <FieldError message={fieldErrors.organizerEmail} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={fieldId("startAt")}>Inicio</Label>
        <Input
          id={fieldId("startAt")}
          type="datetime-local"
          value={form.startAt}
          onChange={(event) => onFieldChange("startAt", event.target.value)}
          onBlur={() => onFieldBlur?.("startAt")}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.startAt)}
          required
        />
        <FieldError message={fieldErrors.startAt} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={fieldId("endAt")}>Fin</Label>
        <Input
          id={fieldId("endAt")}
          type="datetime-local"
          value={form.endAt}
          onChange={(event) => onFieldChange("endAt", event.target.value)}
          onBlur={() => onFieldBlur?.("endAt")}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.endAt)}
          required
        />
        <FieldError message={fieldErrors.endAt} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor={fieldId("notes")}>Notas (opcional)</Label>
        <Textarea
          id={fieldId("notes")}
          value={form.notes}
          onChange={(event) => onFieldChange("notes", event.target.value)}
          onBlur={() => onFieldBlur?.("notes")}
          placeholder="Detalles adicionales para la reunión"
          rows={3}
          disabled={disabled}
          aria-invalid={Boolean(fieldErrors.notes)}
        />
        <FieldError message={fieldErrors.notes} />
      </div>
    </div>
  );
}
