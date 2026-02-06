"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, RefreshCw } from "lucide-react"
import {
  Breadcrumb,
  LessonDetailHeader,
  TaskList,
  LessonNavigation,
  type Task,
  type TaskStatus,
  type LessonTaskType as UITaskType,
} from "@/components/dashboard/lesson-detail"
import {
  coursesService,
  themesService,
  progressService,
  ApiError,
} from "@/lib/api"
import type { CourseWithThemes } from "@/lib/api/courses.service"
import type { ThemeWithLessons } from "@/lib/api/themes.service"
import type {
  Theme,
  BackendLesson,
  ThemeProgressData,
  CourseProgressData,
  LessonAccessResponse,
  DailyStatusResponse,
} from "@/lib/types/course.types"
import {
  LessonType,
  ProgressStatus,
} from "@/lib/types/course.types"

/* ===== Types ===== */
interface LessonPageState {
  course: CourseWithThemes | null
  theme: ThemeWithLessons | null
  allThemes: ThemeWithLessons[]
  courseProgress: CourseProgressData | null
  lessonAccessMap: Record<string, LessonAccessResponse>
  dailyLimitReached: boolean
  isLoading: boolean
  error: string | null
}

/* ===== Mapeos de tipo ===== */
const lessonTypeToUIType: Record<LessonType, UITaskType> = {
  [LessonType.VIDEO]: "video",
  [LessonType.EXERCISE]: "exercise",
  [LessonType.QUIZ]: "quiz",
  [LessonType.READING]: "reading",
  [LessonType.DOWNLOAD]: "exercise",
}

/* ===== Helpers ===== */

/** Determina el estado UI de una tarea (lesson del backend) */
function getLessonTaskStatus(
  lesson: BackendLesson,
  lessonIndex: number,
  lessons: BackendLesson[],
  themeProgress: ThemeProgressData | null,
  lessonAccessMap: Record<string, LessonAccessResponse>
): TaskStatus {
  const access = lessonAccessMap[lesson._id]
  if (access && !access.canAccess) {
    return "locked"
  }

  if (!themeProgress) {
    return lessonIndex === 0 ? "pending" : "locked"
  }

  // Comparar como strings para evitar problemas con ObjectId
  const lessonProg = (themeProgress.lessonsProgress ?? []).find(
    (lp) => String(lp.lessonId) === String(lesson._id)
  )

  if (lessonProg?.status === ProgressStatus.COMPLETED) return "completed"
  if (lessonProg?.status === ProgressStatus.IN_PROGRESS) return "in-progress"

  // Verificar si está bloqueada
  if (lesson.requiresPreviousCompletion && lessonIndex > 0) {
    const prevLesson = lessons[lessonIndex - 1]
    const prevProg = (themeProgress.lessonsProgress ?? []).find(
      (lp) => String(lp.lessonId) === String(prevLesson._id)
    )
    if (prevProg?.status !== ProgressStatus.COMPLETED) return "locked"
  }

  // Si es preview, siempre accesible
  if (lesson.isPreview) return "pending"

  // Si es la primera o no requiere anterior, está pendiente
  if (lessonIndex === 0 || !lesson.requiresPreviousCompletion) return "pending"

  return "pending"
}

/** Transforma lecciones del backend a tareas del UI */
function transformLessonsToTasks(
  lessons: BackendLesson[],
  themeProgress: ThemeProgressData | null,
  moduleSlug: string,
  themeId: string,
  lessonAccessMap: Record<string, LessonAccessResponse>
): Task[] {
  return lessons.map((lesson, index) => {
    const status = getLessonTaskStatus(
      lesson,
      index,
      lessons,
      themeProgress,
      lessonAccessMap
    )

    // Buscar thumbnail en content blocks de tipo VIDEO o IMAGE
    const videoBlock = lesson.contentBlocks?.find(
      (b) => b.type === "VIDEO" && b.mediaUrl
    )
    const imageBlock = lesson.contentBlocks?.find(
      (b) => b.type === "IMAGE" && b.mediaUrl
    )
    const thumbnail = imageBlock?.mediaUrl || undefined

    // Calcular duración del video si es tipo VIDEO
    const videoDuration = videoBlock?.settings
      ? (videoBlock.settings as Record<string, unknown>).duration as string | undefined
      : undefined

    // Formato de duración
    const duration = lesson.durationMinutes
      ? lesson.durationMinutes >= 60
        ? `${Math.floor(lesson.durationMinutes / 60)}h ${lesson.durationMinutes % 60} min`
        : `${lesson.durationMinutes} min`
      : "—"

    return {
      id: lesson._id,
      type: lessonTypeToUIType[lesson.type] || "video",
      title: lesson.title,
      description: lesson.description || "",
      duration,
      status,
      thumbnail,
      videoDuration,
      href: `/dashboard/library/${moduleSlug}/${themeId}/${lesson._id}`,
    }
  })
}

/* ===== Loading Skeleton ===== */
function LessonDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto w-full animate-pulse">
      {/* Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-white/5 rounded" />
          <div className="h-3 w-2 bg-white/5 rounded" />
          <div className="h-4 w-24 bg-white/5 rounded" />
          <div className="h-3 w-2 bg-white/5 rounded" />
          <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
      </div>

      {/* Header */}
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

      {/* Task cards */}
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

/* ===== Error State ===== */
function LessonDetailError({
  error,
  onRetry,
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-10 text-red-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">Error al cargar el tema</h3>
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
interface LessonDetailPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>
}

/* ===== Page Component ===== */
export default function LessonDetailPage({ params }: LessonDetailPageProps) {
  const router = useRouter()

  const [state, setState] = useState<LessonPageState>({
    course: null,
    theme: null,
    allThemes: [],
    courseProgress: null,
    lessonAccessMap: {},
    dailyLimitReached: false,
    isLoading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const { moduleId, lessonId } = await params

      // 1. Obtener el curso por slug
      let course: CourseWithThemes
      try {
        const baseCourse = await coursesService.getBySlug(moduleId)
        course = await coursesService.getWithThemes(baseCourse._id)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          router.replace("/dashboard/library")
          return
        }
        throw err
      }

      // 2. Obtener todos los temas con lecciones (para navegación)
      const themes = course.themes as Theme[]
      const allThemesUnsorted = await Promise.all(
        themes.map((t) => themesService.getWithLessons(t._id))
      )

      // Ordenar temas por su campo order
      const allThemes = allThemesUnsorted.sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      )

      // 3. Encontrar el tema actual (lessonId es realmente el themeId)
      const currentTheme = allThemes.find((t) => t._id === lessonId)
      if (!currentTheme) {
        router.replace(`/dashboard/library/${moduleId}`)
        return
      }

      // 4. Obtener progreso del curso
      let courseProgress: CourseProgressData | null = null
      try {
        const progressResponse = await progressService.getMyCourseProgress(course._id)

        // Verificar formato de respuesta (puede ser { enrolled, progress } o CourseProgress directamente)
        const raw = progressResponse as unknown as Record<string, unknown> | null

        if (!raw || (typeof raw === "object" && Object.keys(raw).length === 0)) {
          courseProgress = null
        } else if ("enrolled" in raw) {
          // Formato nuevo: { enrolled: boolean, progress: CourseProgress | null }
          courseProgress = raw.enrolled
            ? (raw.progress as CourseProgressData | null)
            : null
        } else if ("courseId" in raw) {
          // Formato legacy: CourseProgress directamente
          courseProgress = raw as unknown as CourseProgressData
        } else {
          courseProgress = null
        }
      } catch (err) {
        if (!(err instanceof ApiError && err.status === 404)) {
          console.warn("Error obteniendo progreso:", err)
        }
      }

      // 5. Obtener acceso por leccion (para bloqueo real)
      let lessonAccessMap: Record<string, LessonAccessResponse> = {}
      const lessonsForAccess = Array.isArray(currentTheme.lessons)
        ? (currentTheme.lessons as BackendLesson[])
        : []

      try {
        const accessEntries = await Promise.all(
          lessonsForAccess.map(async (lesson) => {
            const access = await progressService.getLessonAccess(lesson._id)
            return [lesson._id, access] as const
          })
        )

        lessonAccessMap = accessEntries.reduce<Record<string, LessonAccessResponse>>(
          (acc, [lessonId, access]) => {
            acc[lessonId] = access
            return acc
          },
          {}
        )
      } catch (err) {
        console.warn("Error obteniendo acceso a lecciones:", err)
      }

      // 6. Obtener estado diario (límite de tareas)
      let dailyLimitReached = false
      try {
        const dailyStatus = await progressService.getMyDailyStatus()
        dailyLimitReached = !dailyStatus.canCompleteMore
      } catch (err) {
        console.warn("Error obteniendo estado diario:", err)
      }

      // Debug: verificar datos de progreso
      console.log("[Debug] courseProgress:", courseProgress)
      console.log("[Debug] themeId buscado:", currentTheme._id)
      console.log("[Debug] themesProgress:", courseProgress?.themesProgress?.map(tp => ({
        themeId: tp.themeId,
        status: tp.status,
        progressPercentage: tp.progressPercentage
      })))

      setState({
        course,
        theme: currentTheme,
        allThemes,
        courseProgress,
        lessonAccessMap,
        dailyLimitReached,
        isLoading: false,
        error: null,
      })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 401
            ? "Tu sesión ha expirado. Inicia sesión de nuevo."
            : "No pudimos cargar el tema. Verifica tu conexión."
          : "Ocurrió un error inesperado."

      setState((prev) => ({ ...prev, isLoading: false, error: message }))
    }
  }, [params, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Título dinámico
  useEffect(() => {
    if (state.theme) {
      document.title = `${state.theme.title} | WC Training`
    }
    return () => { document.title = "WC Training" }
  }, [state.theme])

  // --- Carga / Error ---
  if (state.isLoading) return <LessonDetailSkeleton />
  if (state.error) return <LessonDetailError error={state.error} onRetry={fetchData} />
  if (!state.course || !state.theme) return null

  // --- Preparar datos ---
  const { course, theme, allThemes, courseProgress, lessonAccessMap } = state

  // Obtener progreso del tema actual
  // Comparar como strings para evitar problemas con ObjectId
  const themeProgress = (courseProgress?.themesProgress ?? []).find(
    (tp) => String(tp.themeId) === String(theme._id)
  ) ?? null

  // Índice del tema actual dentro del curso
  const themeIndex = allThemes.findIndex((t) => t._id === theme._id)
  const totalThemes = allThemes.length

  // Contar temas completados
  const completedThemes = (courseProgress?.themesProgress ?? []).filter(
    (tp) => tp.status === ProgressStatus.COMPLETED
  ).length

  // Debug: log de progreso para verificar datos
  // console.log('themeProgress:', themeProgress, 'theme._id:', theme._id)

  // Progreso del tema
  const themePercent = themeProgress?.progressPercentage ?? 0

  // Lecciones del tema (backend) → tareas del UI (ordenadas por order)
  const lessons = Array.isArray(theme.lessons)
    ? [...(theme.lessons as BackendLesson[])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : []

  const tasks = transformLessonsToTasks(
    lessons,
    themeProgress,
    course.slug,
    theme._id,
    lessonAccessMap
  )

  // Obtener el texto destacado del tema
  const highlightedText = theme.highlightedText || theme.title.split(" ").slice(-2).join(" ")

  // Número del módulo (displayOrder)
  const moduleTitle = course.displayOrder > 0
    ? `Módulo ${course.displayOrder}`
    : course.title

  // Breadcrumb
  const breadcrumbItems = [
    { label: "Módulos", href: "/dashboard/library" },
    { label: course.title, href: `/dashboard/library/${course.slug}` },
    { label: highlightedText },
  ]

  // Navegación anterior / siguiente
  const prevTheme = themeIndex > 0 ? allThemes[themeIndex - 1] : undefined
  const nextTheme = themeIndex < totalThemes - 1 ? allThemes[themeIndex + 1] : undefined

  const previousLesson = prevTheme
    ? {
        id: prevTheme._id,
        title: prevTheme.highlightedText || prevTheme.title,
      }
    : undefined

  const nextLesson = nextTheme
    ? {
        id: nextTheme._id,
        title: nextTheme.highlightedText || nextTheme.title,
      }
    : undefined

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <LessonDetailHeader
        moduleTitle={moduleTitle}
        lessonNumber={themeIndex + 1}
        totalLessons={totalThemes}
        completedLessons={completedThemes}
        title={theme.title}
        highlightedText={highlightedText}
        description={theme.description}
        progress={themePercent}
      />

      {/* Lista de tareas */}
       <TaskList
        tasks={tasks}
        moduleId={course.slug}
        lessonId={theme._id}
        dailyLimitReached={state.dailyLimitReached}
      />

      {/* Navegación */}
      <LessonNavigation
        moduleId={course.slug}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
      />
    </div>
  )
}
