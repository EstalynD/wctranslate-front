"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface TaskDetailHeaderProps {
  moduleNumber: number
  estimatedTime: string
  title: string
  description: string
  instructions: string[]
  className?: string
}

/* ===== Component ===== */
export function TaskDetailHeader({
  moduleNumber,
  estimatedTime,
  title,
  description,
  instructions,
  className,
}: TaskDetailHeaderProps) {
  return (
    <div
      className={cn(
        "p-8 rounded-xl bg-[var(--surface)] border border-white/5 shadow-xl",
        className
      )}
    >
      {/* Badge Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full tracking-wide uppercase">
          Módulo {moduleNumber}
        </span>
        <span className="text-slate-400 text-sm flex items-center gap-1">
          <Clock className="size-4" />
          Tiempo estimado: {estimatedTime}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>

      {/* Description */}
      <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
        <p className="text-lg leading-relaxed">{description}</p>

        {/* Instructions */}
        {instructions.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-white mt-8">
              Instrucciones Paso a Paso:
            </h3>
            <ol className="list-decimal pl-5 space-y-3">
              {instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="text-slate-300"
                  dangerouslySetInnerHTML={{ __html: instruction }}
                />
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  )
}
