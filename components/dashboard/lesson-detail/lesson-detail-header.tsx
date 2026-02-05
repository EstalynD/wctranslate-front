"use client"

import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

/* ===== Types ===== */
interface LessonDetailHeaderProps {
  moduleTitle: string
  lessonNumber: number
  totalLessons: number
  completedLessons: number
  title: string
  highlightedText?: string
  description: string
  progress: number
  className?: string
}

/* ===== Lesson Detail Header Component ===== */
export function LessonDetailHeader({
  moduleTitle,
  lessonNumber,
  totalLessons,
  completedLessons,
  title,
  highlightedText,
  description,
  progress,
  className,
}: LessonDetailHeaderProps) {
  // Split title to highlight specific text
  const renderTitle = () => {
    if (!highlightedText) {
      return <span>{title}</span>
    }

    const parts = title.split(highlightedText)
    return (
      <>
        {parts[0]}
        <span className="text-gradient">{highlightedText}</span>
        {parts[1] || ""}
      </>
    )
  }

  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12", className)}>
      {/* Left Content */}
      <div>
        {/* Badges */}
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
            <CheckCircle className="size-3" />
            {completedLessons}/{totalLessons} Temas
          </span>
          <span className="text-slate-500 text-sm font-medium">
            Tema {lessonNumber} del {moduleTitle}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {renderTitle()}
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-lg mt-4 max-w-2xl">
          {description}
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 min-w-[240px] flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Progreso del Tema
          </span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
          <div
            className="h-full gradient-coral-violet rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
