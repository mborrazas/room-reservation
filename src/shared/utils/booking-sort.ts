export interface SchedulableBooking {
  startAt: string | Date;
  endAt: string | Date;
  title: string;
}

function toTimestamp(value: string | Date): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

export function compareBookingsBySchedule(
  a: SchedulableBooking,
  b: SchedulableBooking,
): number {
  const startDiff = toTimestamp(a.startAt) - toTimestamp(b.startAt);
  if (startDiff !== 0) {
    return startDiff;
  }

  const endDiff = toTimestamp(a.endAt) - toTimestamp(b.endAt);
  if (endDiff !== 0) {
    return endDiff;
  }

  return a.title.localeCompare(b.title, "es");
}

export function sortBookingsBySchedule<T extends SchedulableBooking>(
  bookings: T[],
): T[] {
  return [...bookings].sort(compareBookingsBySchedule);
}

export function getLocalDateKey(isoDate: string | Date): string {
  const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-");
}

export function groupBookingsByDay<T extends SchedulableBooking & { startAt: string | Date }>(
  bookings: T[],
): { dateKey: string; date: Date; bookings: T[] }[] {
  const sorted = sortBookingsBySchedule(bookings);
  const groups = new Map<string, T[]>();

  for (const booking of sorted) {
    const key = getLocalDateKey(booking.startAt);
    const current = groups.get(key) ?? [];
    current.push(booking);
    groups.set(key, current);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, dayBookings]) => ({
      dateKey,
      date: parseLocalDateKey(dateKey),
      bookings: dayBookings,
    }));
}

function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}
