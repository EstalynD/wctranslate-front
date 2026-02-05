"use client"

import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface DeadlineCardProps {
  deadline: string
  className?: string
}

/* ===== Component ===== */
export function DeadlineCard({ deadline, className }: DeadlineCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-primary/5 border border-primary/20",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <CalendarDays className="size-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-wide">
            Fecha de Cierre
          </p>
          <p className="text-sm font-semibold">{deadline}</p>
        </div>
      </div>
    </div>
  )
}
