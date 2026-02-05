"use client"

import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
export type CategoryFilter = "Todos" | "Marketing" | "Técnico" | "Psicología" | "Legal" | "Styling"

interface CategoryFiltersProps {
  categories: CategoryFilter[]
  activeCategory: CategoryFilter
  onCategoryChange: (category: CategoryFilter) => void
  showFiltersButton?: boolean
  onFiltersClick?: () => void
  className?: string
}

/* ===== Category Filters Component ===== */
export function CategoryFilters({
  categories,
  activeCategory,
  onCategoryChange,
  showFiltersButton = true,
  onFiltersClick,
  className,
}: CategoryFiltersProps) {
  return (
    <section className={cn("flex flex-wrap gap-3", className)}>
      {categories.map((category) => {
        const isActive = activeCategory === category

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all",
              isActive
                ? "gradient-coral-violet text-white"
                : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            )}
          >
            {category}
          </button>
        )
      })}

      {showFiltersButton && (
        <button
          onClick={onFiltersClick}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ml-auto"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
        </button>
      )}
    </section>
  )
}
