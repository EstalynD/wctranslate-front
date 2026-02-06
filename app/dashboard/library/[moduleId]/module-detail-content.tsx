"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, RefreshCw } from "lucide-react"
import {
  ModuleDetailHeader,
  BackToModulesButton,
  LessonTimeline,
  ModuleDetailFooter,
  EnrollmentCTA,
  type Lesson,
  type LessonTask,
  type LessonStatus as UILessonStatus,
  type TaskType,
} from "@/components/dashboard/module-detail"
import { coursesService, themesService, progressService, ApiError } from "@/lib/api"
import type { CourseWithThemes } from "@/lib/api/courses.service"
import type { ThemeWithLessons } from "@/lib/api/themes.service"
import type {
  CourseProgressData,
  ThemeProgressData,
  BackendLesson,
  UserProgressData,
} from "@/lib/types/course.types"
import {
  CourseLevel,
  ProgressStatus,
  LessonType,
} from "@/lib/types/course.types"

/* ===== Types ===== */
interface ModuleDetailState {
  course: CourseWithThemes | null
  themesWithLessons: ThemeWithLessons[]
  courseProgress: CourseProgressData | null
  suggestedCourse: { id: string; title: string; image?: string } | null
  isLoading: boolean
  error: string | null
  isEnrolling: boolean
}

/* ===== Constantes de mapeo ===== */
const levelLabelsMap: Record<CourseLevel, "Básico" | "Intermedio" | "Avanzado"> = {
  [CourseLevel.BASIC]: "Básico",
  [CourseLevel.INTERMEDIATE]: "Intermedio",
  [CourseLevel.ADVANCED]: "Avanzado",
}

const lessonTypeToTaskType: Record<LessonType, TaskType> = {
  [LessonType.VIDEO]: "video",
  [LessonType.EXERCISE]: "exercise",
  [LessonType.QUIZ]: "quiz",
  [LessonType.READING]: "video",
  [LessonType.DOWNLOAD]: "download",
}

/* ===== Helpers ===== */

/** Determina el estado UI de un tema basado en el progreso del usuario */
function getThemeUIStatus(
  themeId: string,
  themeIndex: number,
  courseProgress: CourseProgressData | null,
  themesWithLessons: ThemeWithLessons[]
): UILessonStatus {
  const progressList = courseProgress?.themesProgress ?? []

  if (!courseProgress || progressList.length === 0) {
    return themeIndex === 0 ? "in-progress" : "locked"
  }

  const themeProgress = progressList.find(
    (tp) => String(tp.themeId) === String(themeId)
  )

  if (!themeProgress) {
    if (themeIndex === 0) return "in-progress"

    const prevThemeId = themesWithLessons[themeIndex - 1]?._id
    const prevProgress = progressList.find(
      (tp) => String(tp.themeId) === String(prevThemeId)
    )

    return prevProgress?.status === ProgressStatus.COMPLETED
      ? "in-progress"
      : "locked"
  }

  switch (themeProgress.status) {
    case ProgressStatus.COMPLETED:
      return "completed"
    case ProgressStatus.IN_PROGRESS:
      return "in-progress"
    case ProgressStatus.NOT_STARTED: {
      if (themeIndex === 0) return "in-progress"

      const prevThemeId = themesWithLessons[themeIndex - 1]?._id
      const prevProgress = progressList.find(
        (tp) => String(tp.themeId) === String(prevThemeId)
      )

      const themeData = themesWithLessons[themeIndex]
      const requiresPrevious = themeData?.requiresPreviousCompletion ?? true
      const threshold = themeData?.unlockThreshold ?? 100

      if (!requiresPrevious) return "in-progress"
      if (!prevProgress) return "locked"

      return prevProgress.progressPercentage >= threshold
        ? "in-progress"
        : "locked"
    }
    default:
      return "locked"
  }
}

/** Transforma las lecciones del backend en tareas para el UI */
function transformLessonsToTasks(
  lessons: BackendLesson[],
  themeProgress: ThemeProgressData | null
): LessonTask[] {
  return lessons.map((lesson, index) => {
    const lessonProgress = themeProgress?.lessonsProgress.find(
      (lp) => String(lp.lessonId) === String(lesson._id)
    )

    const isCompleted = lessonProgress?.status === ProgressStatus.COMPLETED

    let isLocked = false
    if (lesson.requiresPreviousCompletion && index > 0) {
      const prevLesson = lessons[index - 1]
      const prevProgress = themeProgress?.lessonsProgress.find(
        (lp) => String(lp.lessonId) === String(prevLesson._id)
      )
      isLocked = prevProgress?.status !== ProgressStatus.COMPLETED
    }

    return {
      id: lesson._id,
      title: lesson.title,
      type: lessonTypeToTaskType[lesson.type] || "video",
      completed: isCompleted,
      locked: isLocked,
    }
  })
}

/** Transforma los datos del backend al formato del componente LessonTimeline */
function transformToUILessons(
  themesWithLessons: ThemeWithLessons[],
  courseProgress: CourseProgressData | null
): Lesson[] {
  return themesWithLessons.map((theme, index) => {
    const status = getThemeUIStatus(
      theme._id,
      index,
      courseProgress,
      themesWithLessons
    )

    const themeProgress = (courseProgress?.themesProgress ?? []).find(
      (tp) => String(tp.themeId) === String(theme._id)
    ) ?? null

    const lessons = Array.isArray(theme.lessons)
      ? [...(theme.lessons as BackendLesson[])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : []

    const totalMinutes = theme.totalDurationMinutes || lessons.reduce(
      (acc, l) => acc + (l.durationMinutes || 0), 0
    )
    const duration = totalMinutes >= 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min`
      : `${totalMinutes} min`

    return {
      id: theme._id,
      title: theme.title,
      duration,
      status,
      description: theme.description || undefined,
      tasks: status !== "locked"
        ? transformLessonsToTasks(lessons, themeProgress)
        : undefined,
    }
  })
}

/** Extrae la palabra destacada del título del curso */
function extractHighlightedWord(
  title: string,
  themesHighlights: (string | null)[]
): string | undefined {
  const firstHighlight = themesHighlights.find((h) => h !== null)
  if (firstHighlight) return firstHighlight

  const words = title.trim().split(/\s+/)
  return words.length > 1 ? words[words.length - 1] : undefined
}

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

/* ===== Error State ===== */
function ModuleDetailError({
  error,
  onRetry,
}: {
  error: string
  onRetry: () => void
}) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <BackToModulesButton />
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="size-10 text-red-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">Error al cargar el módulo</h3>
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

/* ===== Props ===== */
interface ModuleDetailContentProps {
  moduleId: string
}

/* ===== Main Component ===== */
export function ModuleDetailContent({ moduleId }: ModuleDetailContentProps) {
  const router = useRouter()
  // Ref para evitar doble-fetch en StrictMode
  const fetchedRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [state, setState] = useState<ModuleDetailState>({
    course: null,
    themesWithLessons: [],
    courseProgress: null,
    suggestedCourse: null,
    isLoading: true,
    error: null,
    isEnrolling: false,
  })

  const fetchModuleDetail = useCallback(async (signal?: AbortSignal) => {
    // Si ya tenemos datos, no re-fetch
    if (fetchedRef.current && state.course) return

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // 1. Obtener curso por slug → luego con temas
      let course: CourseWithThemes
      try {
        const baseCourse = await coursesService.getBySlug(moduleId)
        if (signal?.aborted) return
        course = await coursesService.getWithThemes(baseCourse._id)
        if (signal?.aborted) return
      } catch (err) {
        if (signal?.aborted) return
        if (err instanceof ApiError && err.status === 404) {
          router.replace("/dashboard/library")
          return
        }
        throw err
      }

      // 2. Obtener en PARALELO: temas con lecciones + progreso + sugerencia
      const themes = course.themes as import("@/lib/types/course.types").Theme[]

      const [themesWithLessonsUnsorted, progressResponse, allCoursesResponse] = await Promise.all([
        Promise.all(themes.map((theme) => themesService.getWithLessons(theme._id))),
        progressService.getMyCourseProgress(course._id).catch(() => null),
        coursesService.getPublished({ limit: 5 }).catch(() => ({ courses: [] })),
      ])

      if (signal?.aborted) return

      // Ordenar temas por su campo order
      const themesWithLessons = themesWithLessonsUnsorted.sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      )

      // Parsear progreso
      let courseProgress: CourseProgressData | null = null
      const raw = progressResponse as unknown as Record<string, unknown> | null
      if (raw && typeof raw === "object" && Object.keys(raw).length > 0) {
        if ("enrolled" in raw) {
          courseProgress = raw.enrolled ? (raw.progress as CourseProgressData | null) : null
        } else if ("courseId" in raw) {
          courseProgress = raw as unknown as CourseProgressData
        }
      }

      // Determinar curso sugerido
      let suggestedCourse: { id: string; title: string; image?: string } | null = null
      const allCourses = allCoursesResponse.courses
      if (allCourses.length > 0) {
        const currentIndex = allCourses.findIndex((c) => c._id === course._id)
        const nextCourse = allCourses[currentIndex + 1] || allCourses[0]
        if (nextCourse && nextCourse._id !== course._id) {
          suggestedCourse = {
            id: nextCourse.slug,
            title: nextCourse.title,
            image: nextCourse.thumbnail || undefined,
          }
        }
      }

      fetchedRef.current = true
      setState({
        course,
        themesWithLessons,
        courseProgress,
        suggestedCourse,
        isLoading: false,
        error: null,
        isEnrolling: false,
      })
    } catch (err) {
      if (signal?.aborted) return

      const message =
        err instanceof ApiError
          ? err.status === 401
            ? "Tu sesión ha expirado. Inicia sesión de nuevo."
            : err.status === 403
              ? "No tienes acceso a este módulo con tu plan actual."
              : "No pudimos cargar el módulo. Verifica tu conexión."
          : "Ocurrió un error inesperado. Intenta de nuevo."

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
    }
  }, [moduleId, router, state.course])

  // Effect con cleanup para evitar llamadas duplicadas
  useEffect(() => {
    // Cancelar cualquier request anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo controller
    const controller = new AbortController()
    abortControllerRef.current = controller

    fetchModuleDetail(controller.signal)

    return () => {
      controller.abort()
    }
  }, []) // Solo ejecutar al montar - moduleId viene de props estáticos

  // Actualizar título del documento
  useEffect(() => {
    if (state.course) {
      document.title = `${state.course.title} | WC Training`
    }
    return () => {
      document.title = "WC Training"
    }
  }, [state.course])

  // Inscripción
  const handleEnroll = useCallback(async () => {
    if (!state.course || state.isEnrolling) return

    const courseId = state.course._id

    setState((prev) => ({ ...prev, isEnrolling: true }))
    try {
      const enrollResponse = await progressService.enrollInCourse(courseId)

      const userProgress = enrollResponse as unknown as UserProgressData
      const enrolled = userProgress?.courses?.find(
        (c) => c.courseId === courseId || String(c.courseId) === courseId
      )

      if (enrolled) {
        setState((prev) => ({
          ...prev,
          courseProgress: enrolled,
          isEnrolling: false,
        }))
      } else {
        const minimalProgress: CourseProgressData = {
          courseId,
          status: ProgressStatus.NOT_STARTED,
          progressPercentage: 0,
          themesProgress: [],
          enrolledAt: new Date().toISOString(),
          startedAt: null,
          completedAt: null,
          lastAccessedAt: new Date().toISOString(),
        }
        setState((prev) => ({
          ...prev,
          courseProgress: minimalProgress,
          isEnrolling: false,
        }))
      }
    } catch (err) {
      console.error("[Enroll] Error:", err)
      setState((prev) => ({ ...prev, isEnrolling: false }))
    }
  }, [state.course, state.isEnrolling])

  // Retry handler que resetea el flag
  const handleRetry = useCallback(() => {
    fetchedRef.current = false
    fetchModuleDetail()
  }, [fetchModuleDetail])

  // Estados de carga y error
  if (state.isLoading) {
    return <ModuleDetailSkeleton />
  }

  if (state.error) {
    return <ModuleDetailError error={state.error} onRetry={handleRetry} />
  }

  if (!state.course) {
    return null
  }

  // Transformar datos para los componentes
  const { course, themesWithLessons, courseProgress, suggestedCourse } = state

  const uiLessons = transformToUILessons(themesWithLessons, courseProgress)
  const progress = courseProgress?.progressPercentage ?? 0
  const level = levelLabelsMap[course.level] ?? "Básico"

  const highlightedWord = extractHighlightedWord(
    course.title,
    themesWithLessons.map((t) => t.highlightedText)
  )

  const moduleNumber = course.displayOrder > 0 ? course.displayOrder : undefined
  const needsEnrollment = !courseProgress

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <BackToModulesButton />
      </div>

      <ModuleDetailHeader
        moduleNumber={moduleNumber}
        level={level}
        title={course.title}
        highlightedWord={highlightedWord}
        description={course.description}
        progress={progress}
        showProgress={!needsEnrollment}
      />

      {needsEnrollment ? (
        <EnrollmentCTA
          courseTitle={course.title}
          totalLessons={course.totalLessons}
          totalDuration={course.totalDurationMinutes}
          enrolledCount={course.enrolledCount}
          themes={themesWithLessons.map((t) => ({
            title: t.title,
            lessonsCount: Array.isArray(t.lessons) ? t.lessons.length : 0,
          }))}
          isEnrolling={state.isEnrolling}
          onEnroll={handleEnroll}
        />
      ) : (
        <>
          <LessonTimeline lessons={uiLessons} moduleId={course.slug} />
          <ModuleDetailFooter suggestedModule={suggestedCourse ?? undefined} />
        </>
      )}
    </div>
  )
}
