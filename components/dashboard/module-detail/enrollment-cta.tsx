"use client"

import { Loader2, BookOpen, Clock, Users, CheckCircle2, Sparkles, Lock, Play } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface EnrollmentCTAProps {
  courseTitle: string
  totalLessons: number
  totalDuration: number
  enrolledCount: number
  themes: {
    title: string
    lessonsCount: number
  }[]
  isEnrolling: boolean
  onEnroll: () => void
  className?: string
}

/* ===== Helpers ===== */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/* ===== Enrollment CTA Component ===== */
export function EnrollmentCTA({
  courseTitle,
  totalLessons,
  totalDuration,
  enrolledCount,
  themes,
  isEnrolling,
  onEnroll,
  className,
}: EnrollmentCTAProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Card principal de inscripción */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)]">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -top-24 -right-24 size-96 rounded-full bg-gradient-to-br from-coral to-violet blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-gradient-to-br from-violet to-coral blur-3xl" />
        </div>

        <div className="relative p-8 md:p-10">
          {/* Contenido principal */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Lado izquierdo — Info */}
            <div className="flex-1 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral/10 border border-coral/20">
                <Sparkles className="size-3.5 text-coral" />
                <span className="text-xs font-bold text-coral uppercase tracking-wider">
                  Disponible para ti
                </span>
              </div>

              {/* Título */}
              <div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
                  Comienza tu aprendizaje
                </h3>
                <p className="text-slate-400 text-base max-w-lg">
                  Inscríbete en <span className="text-white font-semibold">{courseTitle}</span> para
                  desbloquear todo el contenido, hacer seguimiento de tu progreso y obtener
                  recompensas al completar cada lección.
                </p>
              </div>

              {/* Estadísticas del curso */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center">
                    <BookOpen className="size-4 text-coral" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{totalLessons}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Lecciones</p>
                  </div>
                </div>

                {totalDuration > 0 && (
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <Clock className="size-4 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{formatDuration(totalDuration)}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Duración</p>
                    </div>
                  </div>
                )}

                {enrolledCount > 0 && (
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <Users className="size-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{enrolledCount}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Inscritas</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Beneficios */}
              <ul className="space-y-2.5">
                {[
                  "Seguimiento detallado de tu progreso",
                  "Gana tokens y XP al completar lecciones",
                  "Acceso a ejercicios y quizzes interactivos",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <CheckCircle2 className="size-4 text-emerald-400 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lado derecho — Botón CTA */}
            <div className="flex flex-col items-center gap-4 lg:min-w-[260px]">
              {/* Ilustración decorativa */}
              <div className="relative mb-2">
                <div className="size-28 rounded-full gradient-coral-violet opacity-10 blur-xl absolute inset-0 m-auto" />
                <div className="relative size-28 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center">
                  <Play className="size-10 text-coral fill-coral/20" />
                </div>
              </div>

              {/* Botón principal */}
              <button
                onClick={onEnroll}
                disabled={isEnrolling}
                className="w-full max-w-[260px] btn-gradient text-white font-bold py-4 px-8 rounded-2xl text-base flex items-center justify-center gap-2.5 shadow-lg shadow-violet/20 disabled:opacity-50"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Inscribiendo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    <span>Inscribirme ahora</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Incluido en tu plan actual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview del contenido (temas bloqueados) */}
      {themes.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Contenido del módulo
          </h4>

          <div className="space-y-3">
            {themes.map((theme, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                {/* Número */}
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{theme.title}</p>
                  <p className="text-xs text-slate-500">
                    {theme.lessonsCount} {theme.lessonsCount === 1 ? "lección" : "lecciones"}
                  </p>
                </div>

                {/* Icono bloqueado */}
                <Lock className="size-4 text-slate-600 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
