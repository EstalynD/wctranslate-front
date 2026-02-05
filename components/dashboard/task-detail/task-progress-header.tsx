"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/* ===== Types ===== */
interface TaskProgressHeaderProps {
  backHref: string
  currentTask: number
  totalTasks: number
  progress: number
}

/* ===== Component ===== */
export function TaskProgressHeader({
  backHref,
  currentTask,
  totalTasks,
  progress,
}: TaskProgressHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      {/* Back Link */}
      <Link
        href={backHref}
        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        <span className="text-sm font-medium">Volver al Tema</span>
      </Link>

      {/* Progress Indicator */}
      <div className="flex flex-col items-start md:items-center">
        <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
          Tu Progreso
        </span>
        <div className="flex items-center gap-3">
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full gradient-coral-violet rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-bold">
            Tarea {currentTask} de {totalTasks}
          </span>
        </div>
      </div>
    </div>
  )
}
