"use client"

import Link from "next/link"
import { Trophy, Clock, Star, Lock, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface Achievement {
  id: string
  icon: LucideIcon
  name: string
  unlocked: boolean
  variant: "gradient" | "violet" | "emerald" | "locked"
}

interface AchievementsCardProps {
  achievements?: Achievement[]
  className?: string
}

/* ===== Default Achievements ===== */
const defaultAchievements: Achievement[] = [
  {
    id: "top-streamer",
    icon: Trophy,
    name: "Top Streamer",
    unlocked: true,
    variant: "gradient",
  },
  {
    id: "early-bird",
    icon: Clock,
    name: "Madrugadora",
    unlocked: true,
    variant: "violet",
  },
  {
    id: "five-star",
    icon: Star,
    name: "5 Estrellas",
    unlocked: true,
    variant: "emerald",
  },
  {
    id: "mystery",
    icon: Lock,
    name: "¿?",
    unlocked: false,
    variant: "locked",
  },
]

/* ===== Variant Styles ===== */
const variantStyles = {
  gradient: "gradient-coral-violet shadow-lg",
  violet: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  locked: "bg-white/10 text-white/50",
}

/* ===== Achievements Card Component ===== */
export function AchievementsCard({
  achievements = defaultAchievements,
  className,
}: AchievementsCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-white/5 p-8 rounded-[2.5rem] shadow-xl shadow-black/20",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold">Logros Recientes</h3>
        <Link
          href="/dashboard/achievements"
          className="text-primary text-xs font-bold uppercase hover:underline transition-colors"
        >
          Ver todos
        </Link>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 gap-4">
        {achievements.map(({ id, icon: Icon, name, unlocked, variant }) => (
          <div
            key={id}
            className={cn(
              "bg-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-colors",
              unlocked && "hover:bg-white/10 cursor-pointer",
              !unlocked && "opacity-40"
            )}
          >
            <div
              className={cn(
                "size-12 rounded-full flex items-center justify-center",
                variantStyles[variant]
              )}
            >
              <Icon className="size-5" />
            </div>
            <p className="text-[10px] font-bold uppercase">{name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
