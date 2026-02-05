"use client"

import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface SupportCardProps {
  className?: string
}

/* ===== Support Card Component ===== */
export function SupportCard({ className }: SupportCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="size-4 text-slate-400" />
        <p className="text-xs text-slate-400">Soporte 24/7</p>
      </div>
      <button className="w-full text-xs font-bold py-2.5 px-4 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-all">
        Centro de Ayuda
      </button>
    </div>
  )
}
