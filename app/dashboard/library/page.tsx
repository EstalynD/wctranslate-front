"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { BookOpen, AlertCircle, RefreshCw, GraduationCap } from "lucide-react"
import {
  SearchBar,
  CategoryFilters,
  LibraryModuleCard,
  CoursesGridSkeleton,
  type CategoryFilterValue,
} from "@/components/dashboard/library"
import { coursesService } from "@/lib/api"
import {
  CourseCategory,
  CourseStatus,
  type Course,
} from "@/lib/types/course.types"

/* ===== Constants ===== */
const categories: CategoryFilterValue[] = [
  "ALL",
  CourseCategory.MARKETING,
  CourseCategory.TECHNICAL,
  CourseCategory.PSYCHOLOGY,
  CourseCategory.LEGAL,
  CourseCategory.STYLING,
  CourseCategory.COMMUNICATION,
]

/* ===== Hero Section ===== */
function HeroSection({ totalCourses }: { totalCourses: number }) {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
        Biblioteca de <span className="text-gradient">Módulos</span>
      </h2>
      <p className="text-slate-400">
        Potencia tu carrera con contenido especializado y actualizado.
        {totalCourses > 0 && (
          <span className="text-slate-500 ml-1">
            · {totalCourses} módulos disponibles
          </span>
        )}
      </p>
    </div>
  )
}

/* ===== Empty State ===== */
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <BookOpen className="size-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">No se encontraron módulos</h3>
      <p className="text-slate-400 max-w-md">
        {hasFilters
          ? "No hay módulos que coincidan con los filtros seleccionados. Intenta con otros criterios de búsqueda."
          : "Aún no hay módulos disponibles. Pronto se agregarán nuevos contenidos."}
      </p>
    </div>
  )
}

/* ===== Error State ===== */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="size-10 text-red-400" />
      </div>
      <h3 className="text-xl font-bold mb-2">Error al cargar módulos</h3>
      <p className="text-slate-400 max-w-md mb-6">
        No pudimos cargar los módulos. Verifica tu conexión e intenta de nuevo.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-bold transition-all"
      >
        <RefreshCw className="size-4" />
        Reintentar
      </button>
    </div>
  )
}

/* ===== Stats Bar ===== */
function StatsBar({ total, filtered }: { total: number; filtered: number }) {
  if (total === 0) return null

  return (
    <div className="flex items-center gap-3 text-xs text-slate-500">
      <div className="flex items-center gap-1.5">
        <GraduationCap className="size-3.5" />
        <span>
          {filtered === total
            ? `${total} módulos`
            : `${filtered} de ${total} módulos`}
        </span>
      </div>
    </div>
  )
}

/* ===== Main Page ===== */
export default function LibraryPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<CategoryFilterValue>("ALL")

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const response = await coursesService.getMyCourses()
      setCourses(response.courses)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Filtrado local por categoría y búsqueda
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchCategory =
        activeCategory === "ALL" || course.category === activeCategory

      const matchSearch =
        !search ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [courses, search, activeCategory])

  const hasFilters = activeCategory !== "ALL" || search.length > 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <HeroSection totalCourses={courses.length} />

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar módulos..."
          />
        </div>
      </section>

      {/* Filtros por categoría */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          showFiltersButton={false}
        />
        {!loading && <StatsBar total={courses.length} filtered={filteredCourses.length} />}
      </div>

      {/* Grid de módulos */}
      {loading ? (
        <CoursesGridSkeleton count={6} />
      ) : error ? (
        <div className="grid grid-cols-1">
          <ErrorState onRetry={fetchCourses} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <LibraryModuleCard key={course._id} course={course} />
            ))
          ) : (
            <EmptyState hasFilters={hasFilters} />
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="h-10" />
    </div>
  )
}
