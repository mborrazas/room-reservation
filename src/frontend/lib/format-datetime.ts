const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(date: Date): string {
  const formatted = dateFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatTime(date: Date): string {
  return timeFormatter.format(date);
}

export function formatTimeRange(startAt: Date, endAt: Date): string {
  return `${timeFormatter.format(startAt)} – ${timeFormatter.format(endAt)}`;
}

export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date);
}

export function formatDuration(startAt: Date, endAt: Date): string {
  const minutes = Math.round((endAt.getTime() - startAt.getTime()) / 60_000);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
