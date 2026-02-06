"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface ProgressCardProps {
  percentage?: number
  message?: string
  className?: string
}

/* ===== Progress Card Component ===== */
export function ProgressCard({
  percentage = 72,
  message = "Estás a solo 4 módulos de completar el nivel profesional.",
  className,
}: ProgressCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-xl shadow-black/20",
        className
      )}
    >
      {/* Circular Progress */}
      <div className="relative size-40 flex items-center justify-center">
        {/* Progress Ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(var(--coral) ${percentage}%, rgba(255, 255, 255, 0.1) 0deg)`,
          }}
        />
        {/* Inner Circle */}
        <div className="absolute inset-2 bg-[var(--surface)] rounded-full flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl font-black block">{percentage}%</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              General
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-1">Tu Progreso</h3>
        <p className="text-sm text-slate-400 mb-4">{message}</p>

        {/* CTA Button */}
        <Link
          href="#modulos"
          className="inline-flex items-center gap-2 px-6 py-3 gradient-coral-violet text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 group"
        >
          <span>Continuar aprendiendo</span>
          <ArrowDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
