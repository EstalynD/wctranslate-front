"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Clock, Loader2 } from "lucide-react"
import {
  ProgressCard,
  ModuleCard,
  // AchievementsCard, // Comentado temporalmente
} from "@/components/dashboard/cards"
import { progressService } from "@/lib/api"
import type { DashboardHomeResponse, DashboardCourseItem } from "@/lib/types/course.types"

// Mapeo de niveles del backend a español
const levelMap: Record<string, "Básico" | "Intermedio" | "Avanzado"> = {
  BASIC: "Básico",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
}

/* ===== Hero Section Component ===== */
function HeroSection({ firstName, lastName }: { firstName: string; lastName: string }) {
  const displayName = firstName || lastName || "Modelo"
  return (
    <section className="relative">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          ¡Hola, <span className="text-gradient">{displayName}</span>!
          <br />
          ¿Lista para brillar hoy?
        </h2>
        <p className="text-slate-400 text-lg max-w-xl">
          Revisa tu progreso y continúa con tu formación profesional.
        </p>
      </div>
    </section>
  )
}

/* ===== Coming Soon Card ===== */
function ComingSoonCard() {
  return (
    <div className="bg-[var(--surface)] border border-white/5 p-8 rounded-[2.5rem] shadow-xl shadow-black/20 relative overflow-hidden">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Clock className="size-20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <span className="inline-flex px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-amber-500/30">
          Próximamente
        </span>
        <h3 className="text-2xl font-bold leading-tight mb-4">
          Sistema de Tareas Diarias
        </h3>
        <p className="text-sm text-slate-400">
          Pronto podrás ver tus tareas pendientes y recibir recomendaciones personalizadas para tu entrenamiento.
        </p>
      </div>
    </div>
  )
}

/* ===== Dashboard Cards Grid ===== */
function DashboardCards({ stats }: { stats: DashboardHomeResponse["stats"] }) {
  const message = stats.modulesRemaining > 0
    ? `Estás a solo ${stats.modulesRemaining} módulos de completar el nivel profesional.`
    : "¡Felicidades! Has completado todos los módulos disponibles."

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <ProgressCard
        percentage={stats.totalProgress}
        message={message}
      />
      <ComingSoonCard />
      {/* AchievementsCard comentado temporalmente */}
      {/* <AchievementsCard /> */}
    </div>
  )
}

/* ===== Modules Section ===== */
function ModulesSection({ courses }: { courses: DashboardCourseItem[] }) {
  if (courses.length === 0) {
    return (
      <section id="modulos" className="scroll-mt-8">
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
        <div className="bg-[var(--surface)] border border-white/5 rounded-3xl p-8 text-center">
          <p className="text-slate-400 mb-4">No estás inscrita en ningún módulo aún.</p>
          <Link
            href="/dashboard/library"
            className="inline-flex px-6 py-3 gradient-coral-violet rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
          >
            Explorar módulos
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="modulos" className="scroll-mt-8">
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
        {courses.map((course) => (
          <ModuleCard
            key={course.id}
            id={course.id}
            title={course.title}
            level={levelMap[course.level] || "Básico"}
            progress={course.progress}
            image={course.thumbnail || undefined}
            href={`/dashboard/library/${course.slug}`}
          />
        ))}
      </div>
    </section>
  )
}

/* ===== Loading State ===== */
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}

/* ===== Main Page ===== */
export default function DashboardHomePage() {
  const [data, setData] = useState<DashboardHomeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await progressService.getMyDashboard()
        setData(response)
      } catch (err) {
        console.error("Error fetching dashboard:", err)
        setError("Error al cargar el dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return <LoadingState />
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">{error || "No se pudieron cargar los datos"}</p>
      </div>
    )
  }

  return (
    <>
      <HeroSection firstName={data.user.firstName} lastName={data.user.lastName} />
      <DashboardCards stats={data.stats} />
      <ModulesSection courses={data.coursesInProgress} />
    </>
  )
}
