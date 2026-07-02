import {
  AppHeader,
  BookingsEmptyState,
  BookingsTable,
  getBookings,
  getRooms,
} from "@/frontend";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [bookings, rooms] = await Promise.all([getBookings(), getRooms()]);

  return (
    <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-slate-50 via-background to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.12),_transparent_60%)]"
      />

      <AppHeader bookingCount={bookings.length} rooms={rooms} />

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        {bookings.length === 0 ? (
          <BookingsEmptyState rooms={rooms} />
        ) : (
          <BookingsTable bookings={bookings} rooms={rooms} />
        )}
      </main>
    </div>
  );
}
