import { useCallback, useState } from "react";

import type { BookingFormState } from "@/frontend/components/bookings/booking-form-fields";
import {
  type BookingFormFieldErrors,
  validateBookingForm,
  validateBookingFormField,
} from "@/frontend/lib/booking-form.validation";

export function useBookingForm(initialState: BookingFormState) {
  const [form, setForm] = useState<BookingFormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<BookingFormFieldErrors>({});

  function updateField<K extends keyof BookingFormState>(
    field: K,
    value: BookingFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleFieldBlur(field: keyof BookingFormState) {
    const error = validateBookingFormField(field, form);
    setFieldErrors((current) => ({ ...current, [field]: error }));
  }

  function validateAll(): boolean {
    const result = validateBookingForm(form);
    setFieldErrors(result.fieldErrors);
    return result.isValid;
  }

  const resetForm = useCallback((nextState: BookingFormState) => {
    setForm(nextState);
    setFieldErrors({});
  }, []);

  return {
    form,
    fieldErrors,
    updateField,
    handleFieldBlur,
    validateAll,
    resetForm,
  };
}
