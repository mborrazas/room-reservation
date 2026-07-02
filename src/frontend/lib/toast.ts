import { toast } from "sonner";

export const bookingToast = {
  created(title: string) {
    toast.success("Reserva creada", {
      description: `"${title}" fue agendada correctamente.`,
    });
  },

  updated(title: string) {
    toast.success("Reserva actualizada", {
      description: `Los cambios en "${title}" se guardaron.`,
    });
  },

  deleted(title: string) {
    toast.success("Reserva eliminada", {
      description: `"${title}" fue eliminada del calendario.`,
    });
  },

  validationError() {
    toast.error("Revisá el formulario", {
      description: "Hay campos con errores que necesitan corrección.",
    });
  },

  apiError(message: string) {
    toast.error("No se pudo completar la acción", {
      description: message,
    });
  },

  networkError() {
    toast.error("Error de conexión", {
      description: "Verificá que el servidor esté activo e intentá de nuevo.",
    });
  },
};
