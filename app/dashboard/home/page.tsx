import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import {
  ProgressCard,
  NextTaskCard,
  AchievementsCard,
  ModuleCard,
} from "@/components/dashboard/cards"

export const metadata: Metadata = {
  title: "Dashboard | WC Training",
  description: "Tu panel de control personal. Revisa tu progreso y continúa tu formación.",
}

/* ===== Types ===== */
interface Module {
  id: string
  title: string
  level: "Básico" | "Intermedio" | "Avanzado"
  progress: number
  image?: string
}

/* ===== Mock Data (TODO: Replace with API) ===== */
const modules: Module[] = [
  {
    id: "psicologia-audiencia",
    title: "Psicología de la Audiencia",
    level: "Avanzado",
    progress: 80,
    image: "/psi.png",
  },
  {
    id: "manejo-redes",
    title: "Manejo de Redes Sociales",
    level: "Básico",
    progress: 35,
    image: "/ret.png",
  },
  {
    id: "edicion-video",
    title: "Edición de Video Express",
    level: "Intermedio",
    progress: 15,
    image: "/confg.png",
  },
]

/* ===== Hero Section Component ===== */
function HeroSection({ userName = "Elena" }: { userName?: string }) {
  return (
    <section className="relative">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          ¡Hola, <span className="text-gradient">{userName}</span>!
          <br />
          ¿Lista para brillar hoy?
        </h2>
        <p className="text-slate-400 text-lg max-w-xl">
          Tienes <span className="text-white font-medium">2 nuevas tareas</span> y un logro a punto de desbloquearse. ¡Sigue así!
        </p>
      </div>
    </section>
  )
}

/* ===== Dashboard Cards Grid ===== */
function DashboardCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <ProgressCard
        percentage={72}
        message="Estás a solo 4 módulos de completar el nivel profesional."
      />
      <NextTaskCard
        title="Optimización de Iluminación para Horas Doradas"
        description="Aprende a configurar tus luces para maximizar el engagement nocturno."
        href="/dashboard/tasks"
      />
      <AchievementsCard />
    </div>
  )
}

/* ===== Modules Section ===== */
function ModulesSection({ modules }: { modules: Module[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black">Módulos en curso</h3>
        <Link
          href="/dashboard/library"
          className="text-slate-400 hover:text-white transition-colors text-sm font-semibold flex items-center gap-2 group"
        >
          Explorar biblioteca
          <ExternalLink className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            id={module.id}
            title={module.title}
            level={module.level}
            progress={module.progress}
            image={module.image}
            href={`/dashboard/library/${module.id}`}
          />
        ))}
      </div>
    </section>
  )
}

/* ===== Main Page ===== */
export default function DashboardHomePage() {
  // TODO: Fetch user data from API
  const userName = "Elena"

  return (
    <>
      <HeroSection userName={userName} />
      <DashboardCards />
      <ModulesSection modules={modules} />
    </>
  )
}
