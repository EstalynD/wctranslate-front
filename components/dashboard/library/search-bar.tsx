"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

/* ===== SearchBar Component ===== */
export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar módulos...",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative group min-w-[280px] md:min-w-[300px]", className)}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
      />
    </div>
  )
}
