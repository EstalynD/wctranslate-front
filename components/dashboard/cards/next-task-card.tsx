"use client"

import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface NextTaskCardProps {
  title?: string
  description?: string
  href?: string
  className?: string
}

/* ===== Next Task Card Component ===== */
export function NextTaskCard({
  title = "Optimización de Iluminación\npara Horas Doradas",
  description = "Aprende a configurar tus luces para maximizar el engagement nocturno.",
  href = "/dashboard/tasks",
  className,
}: NextTaskCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between shadow-xl shadow-black/20 relative overflow-hidden group",
        className
      )}
    >
      {/* Background Icon */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Zap className="size-20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <span className="inline-flex px-3 py-1 rounded-full bg-white/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
          Próxima Tarea
        </span>
        <h3 className="text-2xl font-bold leading-tight mb-4 whitespace-pre-line">
          {title}
        </h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>

      {/* CTA Button */}
      <Link
        href={href}
        className="mt-8 w-full gradient-coral-violet text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 group/btn"
      >
        <span>Continuar</span>
        <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}
