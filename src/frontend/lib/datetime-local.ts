export function toDatetimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getDefaultBookingTimes(): { startAt: string; endAt: string } {
  const startAt = new Date();
  startAt.setDate(startAt.getDate() + 1);
  startAt.setHours(10, 0, 0, 0);

  const endAt = new Date(startAt);
  endAt.setHours(11, 0, 0, 0);

  return {
    startAt: toDatetimeLocalValue(startAt),
    endAt: toDatetimeLocalValue(endAt),
  };
}

export function isoToDatetimeLocalValue(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return toDatetimeLocalValue(date);
}

export function datetimeLocalToIso(value: string): string {
  return new Date(value).toISOString();
}
