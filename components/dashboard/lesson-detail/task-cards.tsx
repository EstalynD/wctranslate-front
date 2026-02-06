"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, CheckCircle, Upload, FileText, Lock, Brain, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
export type TaskStatus = "completed" | "pending" | "in-progress" | "locked"
export type TaskType = "video" | "exercise" | "quiz" | "reading"

export interface Task {
  id: string
  type: TaskType
  title: string
  description: string
  duration: string
  status: TaskStatus
  thumbnail?: string
  videoDuration?: string
  href?: string
}

interface TaskCardProps {
  task: Task
  moduleId: string
  lessonId: string
  dailyLimitReached?: boolean
}

/* ===== Type Labels & Colors ===== */
const typeConfig: Record<TaskType, { label: string; color: string; bgColor: string; Icon: React.ElementType }> = {
  video: { label: "Video Clase", color: "text-primary", bgColor: "bg-primary/10", Icon: Play },
  exercise: { label: "Ejercicio Práctico", color: "text-indigo-400", bgColor: "bg-indigo-400/10", Icon: Brain },
  quiz: { label: "Quiz de Evaluación", color: "text-violet-400", bgColor: "bg-violet-400/10", Icon: HelpCircle },
  reading: { label: "Lectura", color: "text-emerald-400", bgColor: "bg-emerald-400/10", Icon: FileText },
}

const statusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  completed: { label: "Completado", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  pending: { label: "Pendiente de entrega", color: "text-amber-400", bgColor: "bg-amber-400/10" },
  "in-progress": { label: "En progreso", color: "text-primary", bgColor: "bg-primary/10" },
  locked: { label: "Bloqueado", color: "text-slate-500", bgColor: "bg-white/5" },
}

/* ===== Video Task Card ===== */
function VideoTaskCard({ task, moduleId, lessonId, dailyLimitReached }: TaskCardProps) {
  const config = typeConfig[task.type]
  const isCompleted = task.status === "completed"
  const showDailyLimitWarning = !isCompleted && dailyLimitReached

  return (
    <div className="group relative bg-[var(--surface)] border border-white/5 rounded-3xl p-8 transition-all hover:border-primary/30 task-card-hover">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Video Thumbnail */}
        <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 group/video">
          {task.thumbnail ? (
            <Image
              src={task.thumbnail}
              alt={task.title}
              fill
              className="w-full h-full object-cover opacity-60 group-hover/video:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            {isCompleted ? (
              <div className="size-16 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <CheckCircle className="size-8 text-white" />
              </div>
            ) : (
              <div className="size-16 rounded-full gradient-coral-violet flex items-center justify-center shadow-lg shadow-primary/40 group-hover/video:scale-110 transition-transform">
                <Play className="size-8 text-white fill-current" />
              </div>
            )}
          </div>
          {task.videoDuration && (
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold">
              {task.videoDuration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded", config.color, config.bgColor)}>
              {config.label}
            </span>
            <span className="text-slate-500 text-sm">• {task.duration} estimación</span>
            {isCompleted && (
              <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded", statusConfig.completed.color, statusConfig.completed.bgColor)}>
                {statusConfig.completed.label}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-3">{task.title}</h3>
          <p className="text-slate-400 mb-6">{task.description}</p>

          {/* Alerta de límite diario */}
          {showDailyLimitWarning && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
              Alcanzaste tu límite diario de tareas. Intenta mañana.
            </div>
          )}

          <Link
            href={`/dashboard/library/${moduleId}/${lessonId}/${task.id}`}
            className={cn(
              "px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all inline-flex items-center gap-2",
              isCompleted
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-none"
                : "gradient-coral-violet shadow-primary/20 hover:shadow-primary/40 text-white"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="size-4" />
                Ver de Nuevo
              </>
            ) : (
              <>
                Iniciar Clase
                <Play className="size-4" />
              </>
            )}
          </Link>
        </div>

        {/* Status Indicator */}
        {isCompleted && (
          <div className="flex-shrink-0 hidden lg:block">
            <span className="size-12 flex items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="size-6 text-emerald-400" />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ===== Reading Task Card ===== */
function ReadingTaskCard({ task, moduleId, lessonId, dailyLimitReached }: TaskCardProps) {
  const config = typeConfig[task.type]
  const isCompleted = task.status === "completed"
  const showDailyLimitWarning = !isCompleted && dailyLimitReached

  return (
    <div className="group relative bg-[var(--surface)] border border-white/5 rounded-3xl p-8 transition-all hover:border-primary/30 task-card-hover">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Icon */}
        <div className="size-20 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
          {isCompleted ? (
            <CheckCircle className="size-10 text-emerald-400" />
          ) : (
            <config.Icon className="size-10 text-emerald-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded", config.color, config.bgColor)}>
              {config.label}
            </span>
            <span className="text-slate-500 text-sm">• {task.duration} estimación</span>
            {isCompleted && (
              <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ml-auto md:ml-0", statusConfig.completed.color, statusConfig.completed.bgColor)}>
                {statusConfig.completed.label}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-3">{task.title}</h3>
          <p className="text-slate-400 mb-4">{task.description}</p>

          {/* Alerta de límite diario */}
          {showDailyLimitWarning && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
              Alcanzaste tu límite diario de tareas. Intenta mañana.
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              href={`/dashboard/library/${moduleId}/${lessonId}/${task.id}`}
              className={cn(
                "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                isCompleted
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "border border-primary text-primary hover:bg-primary hover:text-white"
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="size-4" />
                  Ver Contenido
                </>
              ) : (
                "Ver Contenido"
              )}
            </Link>
          </div>
        </div>

        {/* Status Indicator */}
        {isCompleted && (
          <div className="flex-shrink-0 hidden lg:block">
            <span className="size-12 flex items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="size-6 text-emerald-400" />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ===== Exercise Task Card ===== */
function ExerciseTaskCard({ task, moduleId, lessonId, dailyLimitReached }: TaskCardProps) {
  const config = typeConfig[task.type]
  const isCompleted = task.status === "completed"
  const showDailyLimitWarning = !isCompleted && dailyLimitReached

  return (
    <div className="group relative bg-[var(--surface)] border border-white/5 rounded-3xl p-8 transition-all hover:border-primary/30 task-card-hover">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Icon */}
        <div className="size-20 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
          {isCompleted ? (
            <CheckCircle className="size-10 text-emerald-400" />
          ) : (
            <config.Icon className="size-10 text-indigo-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded", config.color, config.bgColor)}>
              {config.label}
            </span>
            <span className="text-slate-500 text-sm">• {task.duration} estimación</span>
            {isCompleted && (
              <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ml-auto md:ml-0", statusConfig.completed.color, statusConfig.completed.bgColor)}>
                {statusConfig.completed.label}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-3">{task.title}</h3>
          <p className="text-slate-400 mb-4">{task.description}</p>

          {/* Alerta de límite diario */}
          {showDailyLimitWarning && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
              Alcanzaste tu límite diario de tareas. Intenta mañana.
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              href={`/dashboard/library/${moduleId}/${lessonId}/${task.id}`}
              className={cn(
                "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                isCompleted
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "border border-primary text-primary hover:bg-primary hover:text-white"
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="size-4" />
                  Ver Contenido
                </>
              ) : (
                "Ver Instrucciones"
              )}
            </Link>
            {/* Botón Subir Entrega - Comentado temporalmente
            {!isCompleted && (
              <Link
                href={`/dashboard/library/${moduleId}/${lessonId}/${task.id}`}
                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-bold text-sm transition-all flex items-center gap-2"
              >
                <Upload className="size-4" />
                Subir Entrega
              </Link>
            )}
            */}
          </div>
        </div>

        {/* Status Indicator */}
        {isCompleted && (
          <div className="flex-shrink-0 hidden lg:block">
            <span className="size-12 flex items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="size-6 text-emerald-400" />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ===== Locked Task Card ===== */
function LockedTaskCard({ task }: TaskCardProps) {
  const config = typeConfig[task.type]

  return (
    <div className="group relative bg-[var(--surface)]/40 border border-white/5 rounded-3xl p-8 opacity-60">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Icon */}
        <div className="size-20 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
          <Lock className="size-10 text-slate-500" />
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 rounded bg-white/5">
              {config.label}
            </span>
            <span className="text-slate-600 text-sm">• {task.duration} estimación</span>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-400">{task.title}</h3>
          <p className="text-slate-500">{task.description}</p>
        </div>

        {/* Lock Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
          <Lock className="size-4" />
          BLOQUEADO
        </div>
      </div>
    </div>
  )
}

/* ===== Task Card Router ===== */
export function TaskCard(props: TaskCardProps) {
  const { task } = props

  if (task.status === "locked") {
    return <LockedTaskCard {...props} />
  }

  if (task.type === "video") {
    return <VideoTaskCard {...props} />
  }

  if (task.type === "reading") {
    return <ReadingTaskCard {...props} />
  }

  return <ExerciseTaskCard {...props} />
}

/* ===== Task List Component ===== */
interface TaskListProps {
  tasks: Task[]
  moduleId: string
  lessonId: string
  dailyLimitReached?: boolean
  className?: string
}

export function TaskList({ tasks, moduleId, lessonId, dailyLimitReached, className }: TaskListProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          moduleId={moduleId}
          lessonId={lessonId}
          dailyLimitReached={dailyLimitReached}
        />
      ))}
    </div>
  )
}
