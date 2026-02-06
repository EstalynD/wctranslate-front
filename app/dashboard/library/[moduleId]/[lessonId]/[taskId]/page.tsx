"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, BookOpen, CheckCircle, Loader2, AlertCircle, RefreshCw, Download, FileText } from "lucide-react"
import { ContentBlockRenderer, type ContentBlock as UIContentBlock } from "@/components/dashboard/lesson-detail"
import { TaskCompletionModal } from "@/components/dashboard/lesson-detail/task-completion-modal"
import type { ProgressUpdateResponse } from "@/lib/api/progress.service"
import {
  coursesService,
  themesService,
  lessonsService,
  progressService,
  ApiError,
} from "@/lib/api"
import type { ThemeWithLessons } from "@/lib/api/themes.service"
import type {
  BackendLesson,
  ThemeProgressData,
  LessonProgressData,
  CourseProgressData,
  LessonFullStatusResponse,
} from "@/lib/types/course.types"
import { LessonType, ProgressStatus, lessonTypeLabels } from "@/lib/types/course.types"

/* ===== Types ===== */
interface TaskPageState {
  course: { _id: string; slug: string; title: string; displayOrder: number }
  theme: ThemeWithLessons
  lesson: BackendLesson
  allLessons: BackendLesson[]
  courseProgress: CourseProgressData | null
  lessonIndex: number
  lessonStatus: LessonFullStatusResponse | null
  isLoading: boolean
  error: string | null
}

type TaskPageStatePartial = Partial<TaskPageState> & {
  isLoading: boolean
  error: string | null
}

/* ===== Helpers ===== */
function formatDuration(minutes: number | undefined): string {
  if (!minutes) return "—"
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m} min` : `${h}h`
  }
  return `${minutes} min`
}

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

/* ===== Error State ===== */
function TaskDetailError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white flex items-center justify-center">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-10 text-red-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">Error al cargar la tarea</h3>
        <p className="text-slate-400 max-w-md mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-bold transition-all"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </button>
      </div>
    </div>
  )
}

/* ===== Page Props ===== */
interface TaskDetailPageProps {
  params: Promise<{ moduleId: string; lessonId: string; taskId: string }>
}

/* ===== Page Component ===== */
export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter()

  const [state, setState] = useState<TaskPageStatePartial>({
    isLoading: true,
    error: null,
  })

  const [isCompleting, setIsCompleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [completionResponse, setCompletionResponse] = useState<ProgressUpdateResponse | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  const fetchData = useCallback(async () => {
    setState({ isLoading: true, error: null })
    setActionError(null)

    try {
      const { moduleId, lessonId, taskId } = await params

      // 1. Obtener curso por slug
      let baseCourse
      try {
        baseCourse = await coursesService.getBySlug(moduleId)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          router.replace("/dashboard/library")
          return
        }
        throw err
      }

      // 2. Obtener el tema con sus lecciones
      let themeData: ThemeWithLessons
      try {
        themeData = await themesService.getWithLessons(lessonId)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          router.replace(`/dashboard/library/${moduleId}`)
          return
        }
        throw err
      }

      // 3. Obtener la lección individual
      let lesson: BackendLesson
      try {
        lesson = await lessonsService.getById(taskId)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          router.replace(`/dashboard/library/${moduleId}/${lessonId}`)
          return
        }
        throw err
      }

      // 4. Lista de todas las lecciones del tema (ordenadas por order)
      const allLessons = Array.isArray(themeData.lessons)
        ? [...(themeData.lessons as BackendLesson[])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : []

      const lessonIndex = allLessons.findIndex((l) => l._id === taskId)

      // 5. Progreso del curso
      let courseProgress: CourseProgressData | null = null
      try {
        courseProgress = await progressService.getMyCourseProgress(baseCourse._id)
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 404)) {
          console.warn("Error obteniendo progreso:", err)
        }
      }

      // 6. Estado completo de acceso
      let lessonStatus: LessonFullStatusResponse | null = null
      try {
        lessonStatus = await progressService.getLessonFullStatus(taskId)
      } catch (err) {
        console.warn("Error obteniendo estado de leccion:", err)
      }

      setState({
        course: {
          _id: baseCourse._id,
          slug: baseCourse.slug,
          title: baseCourse.title,
          displayOrder: baseCourse.displayOrder,
        },
        theme: themeData,
        lesson,
        allLessons,
        courseProgress,
        lessonIndex: lessonIndex >= 0 ? lessonIndex : 0,
        lessonStatus,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 401
            ? "Tu sesión ha expirado. Inicia sesión de nuevo."
            : "No pudimos cargar la tarea. Verifica tu conexión."
          : "Ocurrió un error inesperado."

      setState({ isLoading: false, error: message })
    }
  }, [params, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Título dinámico
  useEffect(() => {
    if (state.lesson) {
      document.title = `${state.lesson.title} | WC Training`
    }
    return () => {
      document.title = "WC Training"
    }
  }, [state.lesson])

  // Handler para marcar como completada
  const handleMarkComplete = useCallback(async () => {
    if (!state.lesson || isCompleting) return
    setActionError(null)

    const access = state.lessonStatus?.access
    const contentStatus = state.lessonStatus?.contentStatus
    const dailyStatus = state.lessonStatus?.dailyStatus

    const accessBlocked = access ? !access.canAccess : false
    const contentBlocked = contentStatus ? !contentStatus.canView : false
    const dailyLimitReached = dailyStatus ? !dailyStatus.canCompleteMore : false

    if (accessBlocked || contentBlocked || dailyLimitReached) {
      const reason =
        access?.reason ||
        contentStatus?.preQuiz?.message ||
        contentStatus?.postQuiz?.message ||
        (dailyLimitReached ? "Alcanzaste tu limite diario de tareas." : "")

      setActionError(reason || "No puedes completar esta leccion por ahora.")
      return
    }

    setIsCompleting(true)
    try {
      const response = await progressService.markLessonComplete(state.lesson._id)

      if (!response.success) {
        setActionError(response.message || "No se pudo completar la leccion.")
        return
      }

      // Guardar respuesta y mostrar modal de éxito
      setCompletionResponse(response)
      setShowCompletionModal(true)

      await fetchData()
    } catch (err) {
      console.error("Error al marcar como completada:", err)
      setActionError("No se pudo completar la leccion. Intenta de nuevo.")
    } finally {
      setIsCompleting(false)
    }
  }, [state.lesson, isCompleting, fetchData])

  // --- Loading / Error ---
  if (state.isLoading) return <TaskDetailSkeleton />
  if (state.error) return <TaskDetailError error={state.error} onRetry={fetchData} />
  if (!state.course || !state.theme || !state.lesson || !state.allLessons) return null

  // --- Preparar datos ---
  const {
    course,
    theme,
    lesson,
    allLessons,
    courseProgress,
    lessonIndex = 0,
    lessonStatus,
  } = state

  const access = lessonStatus?.access
  const contentStatus = lessonStatus?.contentStatus
  const dailyStatus = lessonStatus?.dailyStatus

  const accessBlocked = access ? !access.canAccess : false
  const contentBlocked = contentStatus ? !contentStatus.canView : false
  const dailyLimitReached = dailyStatus ? !dailyStatus.canCompleteMore : false

  const accessMessage =
    access?.reason ||
    contentStatus?.preQuiz?.message ||
    contentStatus?.postQuiz?.message

  // Progreso
  const themeProgress: ThemeProgressData | null =
    (courseProgress?.themesProgress ?? []).find((tp) => tp.themeId === theme._id) ?? null

  const lessonProgress: LessonProgressData | null =
    (themeProgress?.lessonsProgress ?? []).find((lp) => lp.lessonId === lesson._id) ?? null

  const isCompleted = lessonProgress?.status === ProgressStatus.COMPLETED

  // Navegación entre tareas
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null
  const basePath = `/dashboard/library/${course.slug}/${theme._id}`

  // Determinar siguiente lección: usar unlockedContent del response o la siguiente en la lista
  const nextLessonIdForModal =
    completionResponse?.unlockedContent?.nextLesson || nextLesson?._id

  // Tipo de tarea label
  const typeLabel = lessonTypeLabels?.[lesson.type] ?? lesson.type

  // Content blocks para renderizar
  const contentBlocks = lesson.contentBlocks ?? []

  // Recursos
  const resources = lesson.resources ?? []

  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white">
      {/* Header */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link
            href={basePath}
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Volver a Lección
          </Link>
          <span>/</span>
          <span className="hidden sm:inline truncate max-w-[200px]">{course.title}</span>
          <span className="hidden sm:inline">/</span>
          <span className="truncate max-w-[150px] sm:max-w-none">{theme.title}</span>
        </div>

        {/* Header de la tarea */}
        <header className="mb-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="size-3" />
              {typeLabel}
            </span>
            <span className="text-slate-400 text-xs sm:text-sm flex items-center gap-1.5">
              <Clock className="size-3 sm:size-4" />
              {formatDuration(lesson.durationMinutes)}
            </span>
            {isCompleted && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="size-3" />
                Completada
              </span>
            )}
            <span className="text-slate-500 text-xs">
              Tarea {lessonIndex + 1} de {allLessons.length}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3">
            {lesson.title}
          </h1>

          {/* Descripción */}
          {lesson.description && (
            <p className="text-slate-400 text-sm sm:text-base md:text-lg">
              {lesson.description}
            </p>
          )}
        </header>
      </div>

      {/* Alertas de acceso */}
      {(accessBlocked || contentBlocked || dailyLimitReached || actionError) && (
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 mb-4">
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <AlertCircle className="size-4 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Acceso restringido</p>
              <p>
                {actionError ||
                  accessMessage ||
                  (dailyLimitReached
                    ? "Alcanzaste tu limite diario de tareas. Intenta manana."
                    : "Completa los requisitos pendientes para continuar.")}
              </p>
              {dailyStatus && (
                <p className="text-xs text-amber-100/80">
                  {dailyStatus.tasksCompletedToday}/{dailyStatus.maxDailyTasks} tareas hoy
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Blocks - Full width */}
      <main className="bg-[#15132d] rounded-t-2xl sm:rounded-t-3xl md:rounded-3xl md:mx-4 lg:mx-6 p-1 sm:p-4 md:p-8 border border-white/5 border-b-0 md:border-b">
        {accessBlocked || contentBlocked ? (
          <div className="text-center py-16">
            <p className="text-slate-400">
              {accessMessage || "No puedes ver esta leccion todavia."}
            </p>
          </div>
        ) : contentBlocks.length > 0 ? (
          <ContentBlockRenderer
            blocks={contentBlocks as unknown as UIContentBlock[]}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">Esta tarea no tiene contenido aún</p>
          </div>
        )}

        {/* Recursos descargables */}
        {resources.length > 0 && (
          <div className="mt-8 pt-8 border-t border-white/5">
            <h3 className="text-lg font-bold mb-4">Recursos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resources.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
                >
                  <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <FileText className="size-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{r.name}</p>
                    {r.size && <p className="text-xs text-slate-400">{r.size}</p>}
                  </div>
                  <Download className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de éxito al completar */}
      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        response={completionResponse}
        basePath={basePath}
        nextLessonId={nextLessonIdForModal}
        themeCompleted={completionResponse?.themeCompleted}
        courseCompleted={completionResponse?.courseCompleted}
      />

      {/* Footer - Navegación y Completar */}
      <footer className="sticky bottom-0 bg-[#0b0a1a]/95 backdrop-blur-lg border-t border-white/5 px-2 sm:px-4 py-3 md:px-6 md:py-4">
        <div className="flex justify-between items-center gap-2">
          {/* Anterior */}
          {prevLesson ? (
            <Link
              href={`${basePath}/${prevLesson._id}`}
              className="px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
            >
              <span className="hidden sm:inline">&larr; Anterior</span>
              <span className="sm:hidden">&larr;</span>
            </Link>
          ) : (
            <Link
              href={basePath}
              className="px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
            >
              <span className="hidden sm:inline">&larr; Volver</span>
              <span className="sm:hidden">&larr;</span>
            </Link>
          )}

          {/* Botón Completar */}
          <button
            onClick={handleMarkComplete}
            disabled={
              isCompleted ||
              isCompleting ||
              accessBlocked ||
              contentBlocked ||
              dailyLimitReached
            }
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
              isCompleted
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default shadow-none"
                : isCompleting || accessBlocked || contentBlocked || dailyLimitReached
                  ? "bg-white/5 border border-white/10 text-white/50 cursor-wait shadow-none"
                  : "bg-gradient-to-r from-orange-400 to-pink-500 shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-[0.98]"
            }`}
          >
            {isCompleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando...
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle className="size-4" />
                Completada
              </>
            ) : (
              <>
                <CheckCircle className="size-4" />
                Completar
              </>
            )}
          </button>

          {/* Siguiente */}
          {nextLesson ? (
            <Link
              href={`${basePath}/${nextLesson._id}`}
              className="px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
            >
              <span className="hidden sm:inline">Siguiente &rarr;</span>
              <span className="sm:hidden">&rarr;</span>
            </Link>
          ) : (
            <Link
              href={basePath}
              className="px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
            >
              <span className="hidden sm:inline">Finalizar &rarr;</span>
              <span className="sm:hidden">&rarr;</span>
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}
