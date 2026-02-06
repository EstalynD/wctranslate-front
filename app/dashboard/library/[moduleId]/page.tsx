import { Suspense } from "react"
import { ModuleDetailContent } from "./module-detail-content"

/* ===== Loading Skeleton ===== */
function ModuleDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto w-full animate-pulse">
      <div className="mb-8">
        <div className="h-5 w-40 bg-white/5 rounded-lg" />
      </div>

      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="h-6 w-36 bg-white/5 rounded-full mb-4" />
            <div className="h-12 w-96 bg-white/5 rounded-xl mb-4" />
            <div className="h-5 w-full max-w-2xl bg-white/5 rounded-lg" />
            <div className="h-5 w-80 bg-white/5 rounded-lg mt-2" />
          </div>
          <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 min-w-[200px]">
            <div className="flex justify-between mb-2">
              <div className="h-4 w-16 bg-white/5 rounded" />
              <div className="h-4 w-10 bg-white/5 rounded" />
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-6">
            <div className="size-10 rounded-full bg-white/5 flex-shrink-0" />
            <div className="flex-1 pb-12">
              <div
                className={`bg-[var(--surface)] border border-white/5 rounded-3xl ${
                  i === 2 ? "p-8" : "p-6"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-56 bg-white/5 rounded-lg" />
                    <div className="h-4 w-16 bg-white/5 rounded" />
                  </div>
                  {i <= 2 && <div className="h-6 w-20 bg-white/5 rounded-lg" />}
                </div>
                {i === 2 && (
                  <>
                    <div className="h-4 w-full bg-white/5 rounded mb-6" />
                    <div className="space-y-3">
                      {[1, 2, 3].map((j) => (
                        <div
                          key={j}
                          className="h-14 w-full bg-white/5 rounded-2xl"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===== Page Props ===== */
interface ModuleDetailPageProps {
  params: Promise<{ moduleId: string }>
}

/* ===== Server Component Page ===== */
export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  // Resolver params en el servidor - evita re-renders en el cliente
  const { moduleId } = await params

  return (
    <Suspense fallback={<ModuleDetailSkeleton />}>
      <ModuleDetailContent moduleId={moduleId} />
    </Suspense>
  )
}
