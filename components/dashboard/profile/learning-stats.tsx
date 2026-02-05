"use client"

import { Timer, BookOpen, ClipboardCheck, BarChart3 } from "lucide-react"

/* ===== Types ===== */
interface LearningStatsProps {
  hoursTrainied: number
  modulesCompleted: number
  tasksSubmitted: number
}

/* ===== Stat Item Component ===== */
function StatItem({
  icon: Icon,
  value,
  label,
  colorClass,
}: {
  icon: React.ElementType
  value: string | number
  label: string
  colorClass: string
}) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
      <div
        className={`size-12 rounded-xl ${colorClass} flex items-center justify-center`}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
      </div>
    </div>
  )
}

/* ===== Learning Stats Component ===== */
export function LearningStats({
  hoursTrainied,
  modulesCompleted,
  tasksSubmitted,
}: LearningStatsProps) {
  return (
    <div className="bg-card-dark border border-white/5 p-8 rounded-[2rem] shadow-xl shadow-black/20 relative overflow-hidden">
      {/* Background Icon */}
      <div
        className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <BarChart3 className="size-24" />
      </div>

      <h3 className="text-xl font-bold mb-6">Estadísticas de Aprendizaje</h3>

      <div className="space-y-6 relative z-10">
        <StatItem
          icon={Timer}
          value={`${hoursTrainied}h`}
          label="Tiempo Entrenado"
          colorClass="bg-blue-500/20 text-blue-400"
        />

        <StatItem
          icon={BookOpen}
          value={modulesCompleted}
          label="Módulos Completados"
          colorClass="bg-primary/20 text-primary"
        />

        <StatItem
          icon={ClipboardCheck}
          value={tasksSubmitted}
          label="Tareas Enviadas"
          colorClass="bg-accent/20 text-accent"
        />
      </div>
    </div>
  )
}
