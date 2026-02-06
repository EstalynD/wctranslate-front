  "use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface ModuleDetailHeaderProps {
  moduleNumber?: number
  level: "Básico" | "Intermedio" | "Avanzado"
  title: string
  highlightedWord?: string
  description: string
  progress: number
  showProgress?: boolean
  className?: string
}

/* ===== Module Detail Header Component ===== */
export function ModuleDetailHeader({
  moduleNumber,
  level,
  title,
  highlightedWord,
  description,
  progress,
  showProgress = true,
  className,
}: ModuleDetailHeaderProps) {
  // Split title to highlight specific word
  const renderTitle = () => {
    if (!highlightedWord) {
      return <span>{title}</span>
    }

    const parts = title.split(highlightedWord)
    return (
      <>
        {parts[0]}
        <span className="text-gradient">{highlightedWord}</span>
        {parts[1] || ""}
      </>
    )
  }

  return (
    <section className={cn("mb-12", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left Content */}
        <div>
          {/* Badge */}
          <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            {moduleNumber ? `Módulo ${String(moduleNumber).padStart(2, "0")} • ` : ""}
            {level}
          </span>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            {renderTitle()}
          </h2>

          {/* Description */}
          <p className="text-slate-400 text-lg max-w-2xl">
            {description}
          </p>
        </div>

        {/* Progress Card */}
        {showProgress && (
          <div className="bg-[var(--surface)] border border-white/10 rounded-2xl p-6 min-w-[200px] flex-shrink-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Progreso
              </span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full gradient-coral-violet rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ===== Back Button Component ===== */
export function BackToModulesButton({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard/library"
      className={cn(
        "flex items-center gap-2 text-slate-400 hover:text-white transition-colors group",
        className
      )}
    >
      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-semibold uppercase tracking-wider">
        Volver a Módulos
      </span>
    </Link>
  )
}
