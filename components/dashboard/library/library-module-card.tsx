"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, ArrowRight, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
export type ModuleCategory = "Marketing" | "Técnico" | "Psicología" | "Legal" | "Styling"
export type ModuleLevel = "Básico" | "Intermedio" | "Avanzado"

export interface LibraryModule {
  id: string
  title: string
  description: string
  category: ModuleCategory
  level: ModuleLevel
  progress: number
  image?: string
  icon?: React.ReactNode
}

interface LibraryModuleCardProps {
  module: LibraryModule
  className?: string
}

/* ===== Category Color Mapping ===== */
const categoryColors: Record<ModuleCategory, string> = {
  Técnico: "text-primary",
  Marketing: "text-violet-400",
  Psicología: "text-emerald-400",
  Legal: "text-amber-400",
  Styling: "text-pink-400",
}

/* ===== Level Styles ===== */
const levelStyles: Record<ModuleLevel, string> = {
  Básico: "bg-white/10 backdrop-blur-md text-white",
  Intermedio: "bg-white/10 backdrop-blur-md text-white",
  Avanzado: "bg-primary text-white",
}

/* ===== Gradient Backgrounds for modules without images ===== */
const categoryGradients: Record<ModuleCategory, string> = {
  Técnico: "from-rose-900 to-orange-950",
  Marketing: "from-violet-900 to-purple-950",
  Psicología: "from-indigo-900 to-violet-950",
  Legal: "from-amber-900 to-yellow-950",
  Styling: "from-pink-900 to-rose-950",
}

/* ===== Library Module Card Component ===== */
export function LibraryModuleCard({ module, className }: LibraryModuleCardProps) {
  const hasProgress = module.progress > 0
  const isCompleted = module.progress === 100

  return (
    <div
      className={cn(
        "group bg-[var(--surface)] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-xl shadow-black/20 hover:border-white/20 transition-all",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        {module.image ? (
          <Image
            src={module.image}
            alt={module.title}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <>
            <div className={cn("absolute inset-0 bg-gradient-to-br", categoryGradients[module.category])} />
            <div className="absolute inset-0 flex items-center justify-center">
              {module.icon || <Brain className="size-16 text-white/20" />}
            </div>
          </>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              "px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider",
              categoryColors[module.category]
            )}
          >
            {module.category}
          </span>
        </div>

        {/* Level Badge */}
        <div className="absolute bottom-4 right-4">
          <span
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
              levelStyles[module.level]
            )}
          >
            {module.level}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {module.title}
        </h3>
        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
          {module.description}
        </p>

        {/* Progress & Action */}
        <div className="mt-auto space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Progreso</span>
              <span className={hasProgress ? "text-primary" : "text-slate-600"}>
                {module.progress}%
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  hasProgress
                    ? "gradient-coral-violet shadow-[0_0_10px_rgba(255,126,95,0.4)]"
                    : "bg-white/10"
                )}
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <Link
            href={`/dashboard/library/${module.id}`}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              hasProgress
                ? "gradient-coral-violet hover:opacity-90 shadow-lg shadow-primary/20 text-white"
                : "bg-white/10 hover:bg-white/20 border border-white/10 text-white"
            )}
          >
            <span>{hasProgress ? "Continuar" : "Comenzar"}</span>
            {hasProgress ? (
              <Play className="size-4 fill-current" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
