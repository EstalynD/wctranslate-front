import { notFound } from "next/navigation"
import {
  TaskProgressHeader,
  TaskDetailHeader,
  TaskResources,
  TaskSubmission,
  DeadlineCard,
  type Resource,
} from "@/components/dashboard/task-detail"

/* ===== Types ===== */
interface TaskDetail {
  id: string
  type: "video" | "exercise" | "quiz"
  title: string
  moduleNumber: number
  estimatedTime: string
  description: string
  instructions: string[]
  resources: Resource[]
  deadline?: string
}

interface LessonInfo {
  id: string
  title: string
  tasks: TaskDetail[]
}

interface ModuleInfo {
  id: string
  title: string
  lessons: Record<string, LessonInfo>
}

/* ===== Mock Data (TODO: Replace with API) ===== */
const taskDatabase: Record<string, ModuleInfo> = {
  "psicologia-fan": {
    id: "psicologia-fan",
    title: "Psicología de la Audiencia",
    lessons: {
      "lesson-1": {
        id: "lesson-1",
        title: "Introducción al Engagement Emocional",
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Fundamentos del Engagement",
            moduleNumber: 2,
            estimatedTime: "15 min",
            description:
              "En esta primera lección, exploraremos los fundamentos de la conexión emocional con tu audiencia. Aprenderás cómo crear vínculos genuinos que mantengan a tus espectadores comprometidos y dispuestos a interactuar.",
            instructions: [
              "Mira el video completo sin pausas para captar el flujo de la información.",
              "Toma notas de los <strong>3 pilares del engagement</strong> mencionados.",
              "Reflexiona sobre cómo aplicas actualmente estos conceptos en tus transmisiones.",
              "Completa el cuestionario de autoevaluación al final del video.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Guía_Engagement_V1.pdf",
                type: "pdf",
                size: "1.8 MB",
                url: "#",
              },
            ],
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Práctica: Tu Primera Conexión",
            moduleNumber: 2,
            estimatedTime: "10 min",
            description:
              "Practica las técnicas de conexión emocional que aprendiste en el video anterior. Este ejercicio te ayudará a internalizar los conceptos y aplicarlos de forma natural.",
            instructions: [
              "Descarga la <strong>Guía de Ejercicios</strong> adjunta.",
              "Graba un video corto (2-3 min) practicando la técnica del espejo emocional.",
              "Sube tu grabación y describe qué técnica utilizaste.",
              "Espera la retroalimentación del instructor.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Guía_Ejercicios_Conexión.pdf",
                type: "pdf",
                size: "2.1 MB",
                url: "#",
              },
              {
                id: "res-2",
                name: "Ejemplo_Espejo_Emocional.mp4",
                type: "video",
                size: "18.5 MB",
                url: "#",
              },
            ],
            deadline: "28 de Feb, 23:59 PM",
          },
        ],
      },
      "lesson-2": {
        id: "lesson-2",
        title: "Manejo de Trolls y Haters",
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Identificando Perfiles Tóxicos",
            moduleNumber: 2,
            estimatedTime: "15 min",
            description:
              "Aprende a identificar los diferentes tipos de usuarios tóxicos y cómo diferenciar un hater pasajero de un acosador sistemático. Este conocimiento es fundamental para proteger tu bienestar emocional.",
            instructions: [
              "Visualiza el video completo prestando atención a los <strong>5 perfiles tóxicos</strong>.",
              "Anota características distintivas de cada perfil.",
              "Identifica si has encontrado alguno de estos perfiles en tus transmisiones.",
              "Prepárate para el ejercicio práctico de la siguiente tarea.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Infografía_Perfiles_Tóxicos.pdf",
                type: "pdf",
                size: "3.2 MB",
                url: "#",
              },
            ],
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Práctica de Escenario de Chat",
            moduleNumber: 2,
            estimatedTime: "20 min",
            description:
              "En esta sesión práctica, nos enfocaremos en la gestión de situaciones complejas durante una transmisión en vivo. Aprenderás a identificar señales de alerta y a mantener el control de la conversación sin romper el ambiente profesional.",
            instructions: [
              "Descarga la <strong>Guía de Escenarios de Chat</strong> adjunta en la sección de recursos.",
              "Simula una conversación en la que un usuario intenta llevar la interacción a un plano no permitido según los lineamientos de la plataforma.",
              "Realiza una captura de pantalla (o graba un breve clip de video) de tu respuesta siguiendo las técnicas de \"Redirección Suave\".",
              "Sube tu archivo en el panel derecho y añade una breve explicación de por qué elegiste esa respuesta específica.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Guía_Escenarios_V1.pdf",
                type: "pdf",
                size: "2.4 MB",
                url: "#",
              },
              {
                id: "res-2",
                name: "Ejemplo_Respuesta.mp4",
                type: "video",
                size: "15.8 MB",
                url: "#",
              },
            ],
            deadline: "24 de Oct, 23:59 PM",
          },
          {
            id: "task-3",
            type: "quiz",
            title: "Evaluación: Psicología del Troll",
            moduleNumber: 2,
            estimatedTime: "10 min",
            description:
              "Evalúa tus conocimientos sobre los diferentes tipos de trolls y las estrategias para manejarlos. Esta evaluación te ayudará a consolidar lo aprendido.",
            instructions: [
              "Asegúrate de haber completado las tareas anteriores antes de iniciar.",
              "Lee cada pregunta cuidadosamente antes de responder.",
              "Tienes <strong>un solo intento</strong> para completar la evaluación.",
              "Necesitas un 70% para aprobar y desbloquear el siguiente tema.",
            ],
            resources: [],
          },
        ],
      },
      "lesson-3": {
        id: "lesson-3",
        title: "Micro-expresiones y Venta Sugestiva",
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "El Poder de las Micro-expresiones",
            moduleNumber: 2,
            estimatedTime: "20 min",
            description:
              "Descubre cómo las micro-expresiones faciales pueden ayudarte a conectar mejor con tu audiencia y aumentar el engagement de tus transmisiones.",
            instructions: [
              "Mira el video en un ambiente con buena iluminación para observar los detalles.",
              "Practica las micro-expresiones frente a un espejo.",
              "Graba un corto ensayo para autoevaluación.",
              "Prepárate para el ejercicio práctico.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Atlas_Microexpresiones.pdf",
                type: "pdf",
                size: "5.4 MB",
                url: "#",
              },
            ],
          },
        ],
      },
    },
  },
  "mastering-lighting": {
    id: "mastering-lighting",
    title: "Mastering Lighting",
    lessons: {
      "lesson-1": {
        id: "lesson-1",
        title: "Fundamentos de Iluminación",
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Tipos de Luz y Sus Efectos",
            moduleNumber: 1,
            estimatedTime: "20 min",
            description:
              "Aprende sobre los diferentes tipos de iluminación y cómo cada uno afecta tu imagen en cámara. Desde luz natural hasta configuraciones profesionales.",
            instructions: [
              "Observa los diferentes ejemplos de iluminación mostrados.",
              "Toma nota de las configuraciones que más te gusten.",
              "Experimenta con la iluminación de tu espacio actual.",
              "Prepara preguntas para la sesión de Q&A.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Guía_Iluminación_Básica.pdf",
                type: "pdf",
                size: "4.2 MB",
                url: "#",
              },
              {
                id: "res-2",
                name: "Comparativa_Luces.mp4",
                type: "video",
                size: "45.8 MB",
                url: "#",
              },
            ],
          },
        ],
      },
      "lesson-2": {
        id: "lesson-2",
        title: "Setup de Iluminación Profesional",
        tasks: [
          {
            id: "task-1",
            type: "video",
            title: "Configuración de 3 Puntos",
            moduleNumber: 1,
            estimatedTime: "25 min",
            description:
              "Domina la técnica clásica de iluminación de 3 puntos usada por profesionales del cine y streaming.",
            instructions: [
              "Sigue paso a paso la configuración mostrada.",
              "Ajusta la intensidad según tu espacio.",
              "Documenta tu configuración con fotos.",
              "Comparte tu setup en el foro del curso.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Diagrama_3_Puntos.pdf",
                type: "pdf",
                size: "1.5 MB",
                url: "#",
              },
            ],
          },
          {
            id: "task-2",
            type: "exercise",
            title: "Práctica: Tu Primer Setup",
            moduleNumber: 1,
            estimatedTime: "30 min",
            description:
              "Configura tu propio setup de iluminación de 3 puntos siguiendo las instrucciones del tutorial.",
            instructions: [
              "Reúne el equipo necesario según la lista de recursos.",
              "Configura cada punto de luz siguiendo el diagrama.",
              "Toma fotos desde diferentes ángulos.",
              "Sube las fotos con una descripción de tu proceso.",
            ],
            resources: [
              {
                id: "res-1",
                name: "Lista_Equipos_Recomendados.pdf",
                type: "pdf",
                size: "0.8 MB",
                url: "#",
              },
              {
                id: "res-2",
                name: "Setup_Ejemplo.mp4",
                type: "video",
                size: "28.3 MB",
                url: "#",
              },
            ],
            deadline: "15 de Mar, 23:59 PM",
          },
        ],
      },
    },
  },
}

/* ===== Helper Functions ===== */
function findTaskData(moduleId: string, lessonId: string, taskId: string) {
  const moduleData = taskDatabase[moduleId]
  if (!moduleData) return null

  const lessonData = moduleData.lessons[lessonId]
  if (!lessonData) return null

  const taskIndex = lessonData.tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) return null

  const task = lessonData.tasks[taskIndex]
  const totalTasks = lessonData.tasks.length
  const currentTaskNumber = taskIndex + 1
  const progress = Math.round((currentTaskNumber / totalTasks) * 100)

  return {
    module: moduleData,
    lesson: lessonData,
    task,
    currentTaskNumber,
    totalTasks,
    progress,
  }
}

/* ===== Page Props ===== */
interface TaskDetailPageProps {
  params: Promise<{ moduleId: string; lessonId: string; taskId: string }>
}

/* ===== Page Component ===== */
export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { moduleId, lessonId, taskId } = await params
  const data = findTaskData(moduleId, lessonId, taskId)

  if (!data) {
    notFound()
  }

  const { lesson, task, currentTaskNumber, totalTasks, progress } = data

  // Build back href
  const backHref = `/dashboard/library/${moduleId}/${lessonId}`

  // Determine if task needs submission
  const needsSubmission = task.type === "exercise"

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Progress Header */}
      <TaskProgressHeader
        backHref={backHref}
        currentTask={currentTaskNumber}
        totalTasks={totalTasks}
        progress={progress}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Instructional Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Task Header */}
          <TaskDetailHeader
            moduleNumber={task.moduleNumber}
            estimatedTime={task.estimatedTime}
            title={task.title}
            description={task.description}
            instructions={task.instructions}
          />

          {/* Resources */}
          {task.resources.length > 0 && (
            <TaskResources resources={task.resources} />
          )}
        </div>

        {/* Right Column: Submission Area */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Submission Panel (only for exercises) */}
            {needsSubmission && (
              <TaskSubmission
                maxFileSize="50MB"
                acceptedFormats={["JPG", "PNG", "MP4", "PDF"]}
              />
            )}

            {/* Quiz CTA (for quiz type) */}
            {task.type === "quiz" && (
              <div className="p-6 rounded-xl bg-[var(--surface)] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full gradient-coral-violet" />
                <h2 className="text-xl font-bold mb-4">Evaluación</h2>
                <p className="text-sm text-slate-400 mb-6">
                  Esta evaluación consta de 10 preguntas. Necesitas un 70% para aprobar.
                </p>
                <button className="w-full py-4 rounded-xl gradient-coral-violet text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all">
                  Iniciar Evaluación
                </button>
              </div>
            )}

            {/* Video CTA (for video type) */}
            {task.type === "video" && (
              <div className="p-6 rounded-xl bg-[var(--surface)] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full gradient-coral-violet" />
                <h2 className="text-xl font-bold mb-4">Video de la Lección</h2>
                <div className="aspect-video bg-black/50 rounded-lg mb-4 flex items-center justify-center">
                  <div className="size-16 rounded-full gradient-coral-violet flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <svg
                      className="size-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                  Marcar como Completado
                </button>
              </div>
            )}

            {/* Deadline Card */}
            {task.deadline && <DeadlineCard deadline={task.deadline} />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Metadata ===== */
export async function generateMetadata({ params }: TaskDetailPageProps) {
  const { moduleId, lessonId, taskId } = await params
  const data = findTaskData(moduleId, lessonId, taskId)

  if (!data) {
    return { title: "Tarea no encontrada" }
  }

  return {
    title: `${data.task.title} | WC Training`,
    description: data.task.description,
  }
}
