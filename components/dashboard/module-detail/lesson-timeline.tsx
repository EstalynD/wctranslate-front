"use client"

import Link from "next/link"
import { Check, Lock, Clock, Play, FileEdit, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
export type LessonStatus = "completed" | "in-progress" | "locked"
export type TaskType = "video" | "exercise" | "quiz" | "download"

export interface LessonTask {
  id: string
  title: string
  type: TaskType
  completed: boolean
  locked?: boolean
}

export interface Lesson {
  id: string
  title: string
  duration: string
  status: LessonStatus
  description?: string
  tasks?: LessonTask[]
}

interface LessonTimelineProps {
  lessons: Lesson[]
  moduleId: string
  className?: string
}

interface LessonCardProps {
  lesson: Lesson
  moduleId: string
  isLast?: boolean
}

/* ===== Task Icon Mapping ===== */
const taskIcons: Record<TaskType, React.ElementType> = {
  video: Play,
  exercise: FileEdit,
  quiz: FileEdit,
  download: FileEdit,
}

/* ===== Timeline Indicator Component ===== */
function TimelineIndicator({ status }: { status: LessonStatus }) {
  if (status === "completed") {
    return (
      <div className="size-10 rounded-full gradient-coral-violet flex items-center justify-center shadow-lg shadow-primary/20">
        <Check className="size-4 text-white" />
      </div>
    )
  }

  if (status === "in-progress") {
    return (
      <div className="size-10 rounded-full bg-white/5 border border-primary flex items-center justify-center shadow-lg shadow-primary/10">
        <div className="size-3 rounded-full bg-primary animate-pulse" />
      </div>
    )
  }

  return (
    <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
      <Lock className="size-4 text-slate-500" />
    </div>
  )
}

/* ===== Status Badge Component ===== */
function StatusBadge({ status }: { status: LessonStatus }) {
  const styles = {
    completed: "bg-white/5 text-slate-400",
    "in-progress": "bg-primary/20 text-primary",
    locked: "hidden",
  }

  const labels = {
    completed: "Completado",
    "in-progress": "En Curso",
    locked: "",
  }

  if (status === "locked") return null

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  )
}

/* ===== Task Item Component ===== */
function TaskItem({ task }: { task: LessonTask }) {
  const Icon = taskIcons[task.type]

  if (task.locked) {
    return (
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50">
        <div className="flex items-center gap-4">
          <div className="size-6 rounded-lg border-2 border-white/20 flex items-center justify-center" />
          <span className="text-sm font-medium">{task.title}</span>
        </div>
        <Lock className="size-5 text-slate-600" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group/task hover:bg-white/10 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "size-6 rounded-lg border-2 flex items-center justify-center",
            task.completed ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"
          )}
        >
          {task.completed && <Check className="size-3 text-emerald-400" />}
        </div>
        <span className="text-sm font-medium">{task.title}</span>
      </div>
      <Icon className="size-5 text-slate-600 group-hover/task:text-white transition-colors" />
    </div>
  )
}

/* ===== Completed Lesson Card ===== */
function CompletedLessonCard({ lesson, href }: { lesson: Lesson; href: string }) {
  return (
    <Link
      href={href}
      className="block bg-[var(--surface)] border border-white/5 rounded-3xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{lesson.title}</h3>
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Clock className="size-4" />
            {lesson.duration}
          </span>
        </div>
        <StatusBadge status={lesson.status} />
      </div>

      {/* Completed Tasks Preview */}
      {lesson.tasks && lesson.tasks.length > 0 && (
        <div className="space-y-2 mt-4 pl-4 border-l-2 border-white/5">
          {lesson.tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 text-sm text-slate-400">
              <CheckCircle className="size-4 text-emerald-400" />
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      )}
    </Link>
  )
}

/* ===== In Progress Lesson Card ===== */
function InProgressLessonCard({ lesson, href }: { lesson: Lesson; href: string }) {
  return (
    <Link
      href={href}
      className="block bg-[var(--surface)] border border-primary/30 rounded-3xl p-8 shadow-xl shadow-primary/5 hover:shadow-primary/10 hover:border-primary/50 transition-all group"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-black text-white group-hover:text-gradient transition-colors">{lesson.title}</h3>
          <span className="text-xs font-medium text-primary flex items-center gap-1">
            <Clock className="size-4" />
            {lesson.duration}
          </span>
        </div>
        <StatusBadge status={lesson.status} />
      </div>

      {/* Description */}
      {lesson.description && (
        <p className="text-slate-400 mb-8 max-w-xl">{lesson.description}</p>
      )}

      {/* Tasks */}
      {lesson.tasks && lesson.tasks.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            Tareas Pendientes
          </h4>
          <div className="grid gap-3">
            {lesson.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </Link>
  )
}

/* ===== Locked Lesson Card ===== */
function LockedLessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <div className="bg-[var(--surface)]/40 border border-white/5 rounded-3xl p-6 opacity-60 cursor-not-allowed">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-slate-400">{lesson.title}</h3>
          <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
            <Clock className="size-4" />
            {lesson.duration}
          </span>
        </div>
        <Lock className="size-5 text-slate-600" />
      </div>
    </div>
  )
}

/* ===== Lesson Card Router ===== */
function LessonCard({ lesson, moduleId, isLast }: LessonCardProps) {
  const href = `/dashboard/library/${moduleId}/${lesson.id}`

  return (
    <div className="timeline-item group">
      <div className={cn("flex gap-6 relative", !isLast && "timeline-line")}>
        {/* Timeline Indicator */}
        <div className="flex-shrink-0 z-10">
          <TimelineIndicator status={lesson.status} />
        </div>

        {/* Card Content */}
        <div className={cn("flex-1", !isLast && "pb-12")}>
          {lesson.status === "completed" && (
            <CompletedLessonCard lesson={lesson} href={href} />
          )}
          {lesson.status === "in-progress" && (
            <InProgressLessonCard lesson={lesson} href={href} />
          )}
          {lesson.status === "locked" && (
            <LockedLessonCard lesson={lesson} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ===== Lesson Timeline Component ===== */
export function LessonTimeline({ lessons, moduleId, className }: LessonTimelineProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {lessons.map((lesson, index) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          moduleId={moduleId}
          isLast={index === lessons.length - 1}
        />
      ))}
    </section>
  )
}
