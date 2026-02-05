"use client"

import Image from "next/image"
import Link from "next/link"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface ModuleCardProps {
  id: string | number
  title: string
  level: "Básico" | "Intermedio" | "Avanzado"
  progress: number
  image?: string
  href?: string
  className?: string
}

/* ===== Level Gradient Styles ===== */
const levelGradients = {
  Básico: "from-rose-900 to-rose-600",
  Intermedio: "from-emerald-900 to-emerald-600",
  Avanzado: "from-indigo-900 to-indigo-600",
}

/* ===== Module Card Component ===== */
export function ModuleCard({
  id,
  title,
  level,
  progress,
  image,
  href,
  className,
}: ModuleCardProps) {
  const CardWrapper = href ? Link : "div"
  const cardProps = href ? { href } : {}

  return (
    <CardWrapper
      {...(cardProps as any)}
      className={cn(
        "group bg-[var(--surface)] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all block",
        className
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "h-40 relative",
          `bg-gradient-to-br ${levelGradients[level]}`
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Camera className="size-10 text-white/20" />
          </div>
        )}
        {/* Level Badge */}
        <div className="absolute inset-0 p-6 flex items-end">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider">
            {level}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h4 className="font-bold text-lg mb-4 group-hover:text-primary transition-colors">
          {title}
        </h4>
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Completado</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="h-full gradient-coral-violet rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}
