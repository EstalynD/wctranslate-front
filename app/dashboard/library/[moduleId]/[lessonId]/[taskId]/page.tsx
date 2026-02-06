import { Suspense } from "react"
import { TaskDetailContent } from "./task-detail-content"

/* ===== Loading Skeleton ===== */
function TaskDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white animate-pulse">
      <div className="px-4 md:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-4 bg-white/5 rounded" />
          <div className="h-4 w-48 bg-white/5 rounded" />
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="h-6 w-32 bg-white/5 rounded-full" />
          <div className="h-4 w-20 bg-white/5 rounded" />
        </div>
        <div className="h-10 w-96 bg-white/5 rounded-xl mb-3" />
        <div className="h-5 w-full bg-white/5 rounded-lg mb-2" />
        <div className="h-5 w-3/4 bg-white/5 rounded-lg" />
      </div>
      <div className="bg-[#15132d] rounded-t-3xl md:rounded-3xl md:mx-4 lg:mx-6 p-4 sm:p-6 md:p-8 border border-white/5 border-b-0 md:border-b">
        <div className="h-[600px] bg-white/5 rounded-xl" />
      </div>
    </div>
  )
}

/* ===== Page Props ===== */
interface TaskDetailPageProps {
  params: Promise<{ moduleId: string; lessonId: string; taskId: string }>
}

/* ===== Server Component Page ===== */
export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { moduleId, lessonId, taskId } = await params

  return (
    <Suspense fallback={<TaskDetailSkeleton />}>
      <TaskDetailContent
        moduleId={moduleId}
        lessonId={lessonId}
        taskId={taskId}
      />
    </Suspense>
  )
}
