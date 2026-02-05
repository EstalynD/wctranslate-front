import { notFound } from "next/navigation"
import {
  Breadcrumb,
  LessonDetailHeader,
  TaskList,
  LessonNavigation,
  type Task,
} from "@/components/dashboard/lesson-detail"

/* ===== Types ===== */
interface LessonDetail {
  id: string
  title: string
  highlightedText: string
  description: string
  progress: number
  tasks: Task[]
}

interface ModuleData {
  id: string
  title: string
  shortTitle: string
  totalLessons: number
  completedLessons: number
  lessons: LessonDetail[]
}

/* ===== Mock Data (TODO: Replace with API) ===== */
const modulesData: Record<string, ModuleData> = {
  "psicologia-fan": {
    id: "psicologia-fan",
    title: "Módulo 2",
    shortTitle: "Psicología",
    totalLessons: 4,
    completedLessons: 2,
    lessons: [
      {
        id: "lesson-1",
        title: "Introducción al Engagement Emocional",
        highlightedText: "Engagement Emocional",
        description: "Aprende los fundamentos de la conexión emocional con tu audiencia y cómo mantener su atención.",
        progress: 100,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Fundamentos del Engagement",
            description: "Descubre los principios básicos para conectar emocionalmente con tu audiencia desde el primer momento.",
            duration: "15 min",
            status: "completed",
            videoDuration: "12:30",
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Práctica: Tu Primera Conexión",
            description: "Realiza un ejercicio guiado para practicar técnicas de conexión emocional.",
            duration: "10 min",
            status: "completed",
          },
        ],
      },
      {
        id: "lesson-2",
        title: "Manejo de Trolls y Haters",
        highlightedText: "Trolls y Haters",
        description: "Aprende estrategias avanzadas para mantener el control de tu sala y proteger tu bienestar emocional frente a usuarios conflictivos.",
        progress: 33,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Identificando Perfiles Tóxicos",
            description: "Analizaremos los 5 tipos más comunes de trolls y cómo diferenciar un hater pasajero de un acosador sistemático.",
            duration: "15 min",
            status: "completed",
            thumbnail: "/toxic.png",
            videoDuration: "12:45",
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Escenario de Chat: \"El Arte del Ban Elegante\"",
            description: "Simula una respuesta a tres situaciones críticas en el chat para practicar la desescalada y el cierre de conversación sin perder propinas.",
            duration: "20 min",
            status: "pending",
          },
          {
            id: "task-3",
            type: "quiz",
            title: "Evaluación: Psicología del Troll",
            description: "Responde 10 preguntas para validar tus conocimientos. Desbloquea este quiz completando las tareas anteriores.",
            duration: "10 min",
            status: "locked",
          },
        ],
      },
      {
        id: "lesson-3",
        title: "Micro-expresiones y Venta Sugestiva",
        highlightedText: "Venta Sugestiva",
        description: "Domina el arte de las micro-expresiones faciales y aprende técnicas de venta sugestiva para incrementar tus ingresos.",
        progress: 0,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "El Poder de las Micro-expresiones",
            description: "Aprende a leer y utilizar las micro-expresiones para conectar mejor con tu audiencia.",
            duration: "20 min",
            status: "locked",
            videoDuration: "18:20",
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Práctica: Espejo Emocional",
            description: "Ejercicio práctico frente al espejo para dominar tus expresiones faciales.",
            duration: "15 min",
            status: "locked",
          },
        ],
      },
      {
        id: "lesson-4",
        title: "Retención de Usuarios VIP",
        highlightedText: "Usuarios VIP",
        description: "Estrategias exclusivas para identificar, cultivar y retener a tus usuarios más valiosos.",
        progress: 0,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Identificando a tus VIPs",
            description: "Aprende a reconocer los patrones de comportamiento de usuarios de alto valor.",
            duration: "15 min",
            status: "locked",
            videoDuration: "14:00",
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Plan de Retención Personalizado",
            description: "Crea tu propio plan de retención para usuarios VIP.",
            duration: "25 min",
            status: "locked",
          },
          {
            id: "task-3",
            type: "quiz",
            title: "Quiz Final: Retención Avanzada",
            description: "Evalúa tus conocimientos sobre estrategias de retención.",
            duration: "10 min",
            status: "locked",
          },
        ],
      },
    ],
  },
  "mastering-lighting": {
    id: "mastering-lighting",
    title: "Módulo 1",
    shortTitle: "Iluminación",
    totalLessons: 4,
    completedLessons: 2,
    lessons: [
      {
        id: "lesson-1",
        title: "Fundamentos de Iluminación",
        highlightedText: "Iluminación",
        description: "Aprende los conceptos básicos de iluminación profesional para tus transmisiones.",
        progress: 100,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Tipos de Luz y Sus Efectos",
            description: "Descubre los diferentes tipos de iluminación y cómo afectan tu imagen en cámara.",
            duration: "20 min",
            status: "completed",
            videoDuration: "18:30",
          },
        ],
      },
      {
        id: "lesson-2",
        title: "Setup de Iluminación Profesional",
        highlightedText: "Profesional",
        description: "Configura tu setup de iluminación como un profesional con equipos accesibles.",
        progress: 100,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Configuración de 3 Puntos",
            description: "Tutorial completo sobre la técnica clásica de iluminación de 3 puntos.",
            duration: "25 min",
            status: "completed",
            videoDuration: "22:15",
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Práctica: Tu Primer Setup",
            description: "Configura tu propio setup siguiendo las instrucciones del tutorial.",
            duration: "30 min",
            status: "completed",
          },
        ],
      },
      {
        id: "lesson-3",
        title: "Iluminación para Diferentes Horarios",
        highlightedText: "Diferentes Horarios",
        description: "Adapta tu iluminación según la hora del día para maximizar el engagement.",
        progress: 50,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Horas Doradas y Nocturnas",
            description: "Aprende a aprovechar la luz natural y combinarla con artificial.",
            duration: "18 min",
            status: "completed",
            videoDuration: "16:45",
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Práctica: Configuraciones de Emergencia",
            description: "Aprende soluciones rápidas para problemas comunes de iluminación.",
            duration: "15 min",
            status: "pending",
          },
        ],
      },
      {
        id: "lesson-4",
        title: "Efectos Creativos con Luz",
        highlightedText: "Creativos",
        description: "Lleva tu iluminación al siguiente nivel con efectos creativos y atmosféricos.",
        progress: 0,
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Efectos de Color y Ambiente",
            description: "Crea ambientes únicos usando luces de colores y efectos especiales.",
            duration: "20 min",
            status: "locked",
            videoDuration: "18:00",
          },
          {
            id: "task-2",
            type: "quiz",
            title: "Quiz Final: Maestro de la Luz",
            description: "Demuestra tus conocimientos sobre iluminación profesional.",
            duration: "10 min",
            status: "locked",
          },
        ],
      },
    ],
  },
}

/* ===== Helper Functions ===== */
function findLessonData(moduleId: string, lessonId: string) {
  const moduleData = modulesData[moduleId]
  if (!moduleData) return null

  const lessonIndex = moduleData.lessons.findIndex((l) => l.id === lessonId)
  if (lessonIndex === -1) return null

  const lesson = moduleData.lessons[lessonIndex]
  const previousLesson = lessonIndex > 0 ? moduleData.lessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < moduleData.lessons.length - 1 ? moduleData.lessons[lessonIndex + 1] : null

  return {
    module: moduleData,
    lesson,
    lessonNumber: lessonIndex + 1,
    previousLesson: previousLesson ? { id: previousLesson.id, title: previousLesson.title.replace(previousLesson.highlightedText, "").trim() || previousLesson.highlightedText } : undefined,
    nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.highlightedText } : undefined,
  }
}

/* ===== Page Props ===== */
interface LessonDetailPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>
}

/* ===== Page Component ===== */
export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { moduleId, lessonId } = await params
  const data = findLessonData(moduleId, lessonId)

  if (!data) {
    notFound()
  }

  const { module: moduleData, lesson, lessonNumber, previousLesson, nextLesson } = data

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Módulos", href: "/dashboard/library" },
    { label: moduleData.shortTitle, href: `/dashboard/library/${moduleId}` },
    { label: lesson.highlightedText },
  ]

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <LessonDetailHeader
        moduleTitle={moduleData.title}
        lessonNumber={lessonNumber}
        totalLessons={moduleData.totalLessons}
        completedLessons={moduleData.completedLessons}
        title={lesson.title}
        highlightedText={lesson.highlightedText}
        description={lesson.description}
        progress={lesson.progress}
      />

      {/* Tasks List */}
      <TaskList
        tasks={lesson.tasks}
        moduleId={moduleId}
        lessonId={lessonId}
      />

      {/* Navigation */}
      <LessonNavigation
        moduleId={moduleId}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
      />
    </div>
  )
}

/* ===== Metadata ===== */
export async function generateMetadata({ params }: LessonDetailPageProps) {
  const { moduleId, lessonId } = await params
  const data = findLessonData(moduleId, lessonId)

  if (!data) {
    return { title: "Tema no encontrado" }
  }

  return {
    title: `${data.lesson.title} | WC Training`,
    description: data.lesson.description,
  }
}
