"use client"

import {
  Trophy,
  Rocket,
  Banknote,
  Star,
  Heart,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface Achievement {
  id: string
  name: string
  icon: React.ElementType
  colorClass: string
  unlocked: boolean
}

interface AchievementsGridProps {
  unlockedCount: number
  totalCount: number
  achievements?: Achievement[]
}

/* ===== Default Achievements ===== */
const defaultAchievements: Achievement[] = [
  {
    id: "top",
    name: "Top",
    icon: Trophy,
    colorClass: "text-primary border-primary",
    unlocked: true,
  },
  {
    id: "inicio",
    name: "Inicio",
    icon: Rocket,
    colorClass: "text-violet-400 border-violet-400",
    unlocked: true,
  },
  {
    id: "ventas",
    name: "Ventas",
    icon: Banknote,
    colorClass: "text-emerald-400 border-emerald-400",
    unlocked: true,
  },
  {
    id: "5stars",
    name: "5 Stars",
    icon: Star,
    colorClass: "text-amber-400 border-amber-400",
    unlocked: true,
  },
  {
    id: "fan",
    name: "Fan",
    icon: Heart,
    colorClass: "text-pink-400 border-pink-400",
    unlocked: true,
  },
  { id: "locked1", name: "", icon: Lock, colorClass: "", unlocked: false },
  { id: "locked2", name: "", icon: Lock, colorClass: "", unlocked: false },
  { id: "locked3", name: "", icon: Lock, colorClass: "", unlocked: false },
  { id: "locked4", name: "", icon: Lock, colorClass: "", unlocked: false },
]

/* ===== Achievement Item Component ===== */
function AchievementItem({ achievement }: { achievement: Achievement }) {
  const Icon = achievement.icon

  if (!achievement.unlocked) {
    return (
      <div className="aspect-square bg-white/5 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/5 opacity-40 grayscale">
        <Lock className="size-5 text-slate-400" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-xl",
        "flex flex-col items-center justify-center gap-1 border border-white/5",
        "hover:border-current transition-colors cursor-pointer group",
        achievement.colorClass
      )}
    >
      <Icon className="size-5 group-hover:scale-110 transition-transform" />
      <span className="text-[8px] font-bold uppercase text-slate-400">
        {achievement.name}
      </span>
    </div>
  )
}

/* ===== Achievements Grid Component ===== */
export function AchievementsGrid({
  unlockedCount,
  totalCount,
  achievements = defaultAchievements,
}: AchievementsGridProps) {
  return (
    <div className="bg-card-dark border border-white/5 p-8 rounded-[2rem] shadow-xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Logros</h3>
        <div className="text-xs font-bold text-slate-400">
          {unlockedCount}/{totalCount}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {achievements.map((achievement) => (
          <AchievementItem key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  )
}
