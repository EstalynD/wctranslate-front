export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white p-6 md:p-8">
      {/* Greeting skeleton */}
      <div className="mb-10 max-w-3xl animate-pulse">
        <div className="h-10 w-48 rounded-lg bg-white/10" />
        <div className="mt-3 h-10 w-64 rounded-lg bg-white/10" />
        <div className="mt-4 h-5 w-80 rounded-lg bg-white/10" />
      </div>

      {/* Cards skeleton */}
      <div className="mb-12 grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-65 animate-pulse rounded-3xl bg-[#15132d] p-5"
          >
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <div className="h-24 w-24 rounded-full bg-white/10" />
              <div className="h-5 w-32 rounded bg-white/10" />
              <div className="h-4 w-48 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Modules skeleton */}
      <div className="mt-20">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-48 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-32 rounded bg-white/10 animate-pulse" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-65 animate-pulse rounded-3xl bg-[#15132d]"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
