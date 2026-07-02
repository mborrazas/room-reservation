import { Skeleton } from "@/frontend/components/ui/skeleton";

export function BookingsPageSkeleton() {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-background to-background">
      <header className="border-b border-border/60 glass-panel">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-11 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-52" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-44 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-md">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="ml-auto h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
