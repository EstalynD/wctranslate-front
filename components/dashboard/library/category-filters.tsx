"use client"

import { SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CourseCategory,
  categoryLabels,
} from "@/lib/types/course.types"

/* ===== Types ===== */
export type CategoryFilterValue = "ALL" | CourseCategory

interface CategoryFiltersProps {
  categories: CategoryFilterValue[]
  activeCategory: CategoryFilterValue
  onCategoryChange: (category: CategoryFilterValue) => void
  showFiltersButton?: boolean
  onFiltersClick?: () => void
  className?: string
}

/* ===== Helpers ===== */
function getCategoryLabel(value: CategoryFilterValue): string {
  if (value === "ALL") return "Todos"
  return categoryLabels[value] || value
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
            {getCategoryLabel(category)}
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
