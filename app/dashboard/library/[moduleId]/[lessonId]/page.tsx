import { Suspense } from "react"
import { LessonDetailContent } from "./lesson-detail-content"

/* ===== Loading Skeleton ===== */
function LessonDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto w-full animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-white/5 rounded" />
          <div className="h-3 w-2 bg-white/5 rounded" />
          <div className="h-4 w-24 bg-white/5 rounded" />
          <div className="h-3 w-2 bg-white/5 rounded" />
          <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-28 bg-white/5 rounded-full" />
            <div className="h-4 w-36 bg-white/5 rounded" />
          </div>
          <div className="h-12 w-96 bg-white/5 rounded-xl mb-4" />
          <div className="h-5 w-full max-w-2xl bg-white/5 rounded-lg" />
        </div>
        <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 min-w-[240px]">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-24 bg-white/5 rounded" />
            <div className="h-4 w-10 bg-white/5 rounded" />
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full" />
        </div>
      </div>

      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-[var(--surface)] border border-white/5 rounded-3xl p-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {i === 1 && (
                <div className="w-full md:w-64 aspect-video rounded-2xl bg-white/5 flex-shrink-0" />
              )}
              {i !== 1 && (
                <div className="size-20 rounded-2xl bg-white/5 flex-shrink-0" />
              )}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-5 w-24 bg-white/5 rounded" />
                  <div className="h-4 w-28 bg-white/5 rounded" />
                </div>
                <div className="h-7 w-72 bg-white/5 rounded-lg mb-3" />
                <div className="h-4 w-full bg-white/5 rounded mb-6" />
                <div className="h-10 w-36 bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===== Page Props ===== */
interface LessonDetailPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>
}

/* ===== Server Component Page ===== */
export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { moduleId, lessonId } = await params

  return (
    <Suspense fallback={<LessonDetailSkeleton />}>
      <LessonDetailContent moduleId={moduleId} lessonId={lessonId} />
    </Suspense>
  )
}
