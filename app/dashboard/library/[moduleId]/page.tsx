import { notFound } from "next/navigation"
import {
  ModuleDetailHeader,
  BackToModulesButton,
  LessonTimeline,
  ModuleDetailFooter,
  type Lesson,
} from "@/components/dashboard/module-detail"

/* ===== Types ===== */
interface ModuleDetail {
  id: string
  moduleNumber: number
  title: string
  highlightedWord: string
  description: string
  level: "Básico" | "Intermedio" | "Avanzado"
  progress: number
  lessons: Lesson[]
  suggestedModule?: {
    id: string
    title: string
    image?: string
  }
}

/* ===== Mock Data (TODO: Replace with API) ===== */
const modulesData: Record<string, ModuleDetail> = {
  "psicologia-fan": {
    id: "psicologia-fan",
    moduleNumber: 3,
    title: "Psicología de la Audiencia",
    highlightedWord: "Audiencia",
    description:
      "Aprende a leer el lenguaje corporal, gestionar las emociones de los usuarios y construir una comunidad leal y rentable.",
    level: "Avanzado",
    progress: 65,
    lessons: [
      {
        id: "lesson-1",
        title: "Introducción al Engagement Emocional",
        duration: "15 min",
        status: "completed",
        tasks: [
          { id: "task-1-1", title: "Ver video introductorio", type: "video", completed: true },
          { id: "task-1-2", title: "Descargar guía de \"Primeros Pasos\"", type: "download", completed: true },
        ],
      },
      {
        id: "lesson-2",
        title: "Manejo de Trolls y Haters",
        duration: "45 min",
        status: "in-progress",
        description:
          "Aprende técnicas de desescalada y cómo convertir situaciones negativas en momentos de propinas.",
        tasks: [
          { id: "task-2-1", title: "Clase: Identificando Perfiles Tóxicos", type: "video", completed: false },
          { id: "task-2-2", title: "Ejercicio Práctico: El Arte del Ban Elegante", type: "exercise", completed: false },
          { id: "task-2-3", title: "Quiz: Psicología del Troll", type: "quiz", completed: false, locked: true },
        ],
      },
      {
        id: "lesson-3",
        title: "Micro-expresiones y Venta Sugestiva",
        duration: "60 min",
        status: "locked",
      },
      {
        id: "lesson-4",
        title: "Retención de Usuarios VIP",
        duration: "30 min",
        status: "locked",
      },
    ],
    suggestedModule: {
      id: "escalamiento-marca",
      title: "Escalamiento de Marca Personal",
      image: "/social.png",
    },
  },
  "mastering-lighting": {
    id: "mastering-lighting",
    moduleNumber: 1,
    title: "Mastering Lighting",
    highlightedWord: "Lighting",
    description:
      "Aprende técnicas profesionales de iluminación para resaltar tus mejores rasgos y crear atmósferas envolventes.",
    level: "Avanzado",
    progress: 75,
    lessons: [
      {
        id: "lesson-1",
        title: "Fundamentos de Iluminación",
        duration: "20 min",
        status: "completed",
        tasks: [
          { id: "task-1-1", title: "Video: Tipos de luz", type: "video", completed: true },
          { id: "task-1-2", title: "Guía de equipos recomendados", type: "download", completed: true },
        ],
      },
      {
        id: "lesson-2",
        title: "Setup de Iluminación Profesional",
        duration: "35 min",
        status: "completed",
        tasks: [
          { id: "task-2-1", title: "Tutorial: Configuración de 3 puntos", type: "video", completed: true },
        ],
      },
      {
        id: "lesson-3",
        title: "Iluminación para Diferentes Horarios",
        duration: "40 min",
        status: "in-progress",
        description: "Domina el arte de adaptar tu iluminación según la hora del día para maximizar el engagement.",
        tasks: [
          { id: "task-3-1", title: "Clase: Horas Doradas y Nocturnas", type: "video", completed: false },
          { id: "task-3-2", title: "Práctica: Configuraciones de emergencia", type: "exercise", completed: false },
        ],
      },
      {
        id: "lesson-4",
        title: "Efectos Creativos con Luz",
        duration: "25 min",
        status: "locked",
      },
    ],
    suggestedModule: {
      id: "edicion-express",
      title: "Edición Express",
    },
  },
  "social-media-strategy": {
    id: "social-media-strategy",
    moduleNumber: 2,
    title: "Social Media Strategy",
    highlightedWord: "Strategy",
    description:
      "Cómo construir una marca personal sólida en Twitter e Instagram para atraer tráfico de calidad a tus shows.",
    level: "Básico",
    progress: 32,
    lessons: [
      {
        id: "lesson-1",
        title: "Tu Identidad Digital",
        duration: "25 min",
        status: "completed",
        tasks: [
          { id: "task-1-1", title: "Define tu nicho y audiencia", type: "exercise", completed: true },
        ],
      },
      {
        id: "lesson-2",
        title: "Estrategia de Contenido",
        duration: "50 min",
        status: "in-progress",
        description: "Aprende a crear contenido que conecte con tu audiencia y genere engagement orgánico.",
        tasks: [
          { id: "task-2-1", title: "Calendario de publicaciones", type: "exercise", completed: false },
          { id: "task-2-2", title: "Tipos de contenido viral", type: "video", completed: false },
        ],
      },
      {
        id: "lesson-3",
        title: "Crecimiento Orgánico",
        duration: "35 min",
        status: "locked",
      },
      {
        id: "lesson-4",
        title: "Colaboraciones y Networking",
        duration: "30 min",
        status: "locked",
      },
    ],
    suggestedModule: {
      id: "psicologia-fan",
      title: "Psicología del Fan",
    },
  },
}

/* ===== Page Props ===== */
interface ModuleDetailPageProps {
  params: Promise<{ moduleId: string }>
}

/* ===== Page Component ===== */
export default async function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  const { moduleId } = await params
  const moduleData = modulesData[moduleId]

  if (!moduleData) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Back Button - Mobile visible in header via layout */}
      <div className="mb-8">
        <BackToModulesButton />
      </div>

      {/* Module Header */}
      <ModuleDetailHeader
        moduleNumber={moduleData.moduleNumber}
        level={moduleData.level}
        title={moduleData.title}
        highlightedWord={moduleData.highlightedWord}
        description={moduleData.description}
        progress={moduleData.progress}
      />

      {/* Lessons Timeline */}
      <LessonTimeline lessons={moduleData.lessons} moduleId={moduleData.id} />

      {/* Footer with Suggested Module */}
      <ModuleDetailFooter suggestedModule={moduleData.suggestedModule} />
    </div>
  )
}

/* ===== Generate Static Params ===== */
export function generateStaticParams() {
  return Object.keys(modulesData).map((moduleId) => ({
    moduleId,
  }))
}

/* ===== Metadata ===== */
export async function generateMetadata({ params }: ModuleDetailPageProps) {
  const { moduleId } = await params
  const moduleData = modulesData[moduleId]

  if (!moduleData) {
    return { title: "Módulo no encontrado" }
  }

  return {
    title: `${moduleData.title} | WC Training`,
    description: moduleData.description,
  }
}
