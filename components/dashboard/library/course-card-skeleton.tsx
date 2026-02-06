import { cn } from "@/lib/utils"

/* ===== Course Card Skeleton ===== */
export function CourseCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-xl shadow-black/20 animate-pulse",
        className
      )}
    >
      {/* Imagen placeholder */}
      <div className="h-52 bg-white/5" />

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Título */}
        <div className="h-6 bg-white/5 rounded-lg w-4/5 mb-3" />
        {/* Descripción */}
        <div className="space-y-2 mb-4">
          <div className="h-3.5 bg-white/5 rounded w-full" />
          <div className="h-3.5 bg-white/5 rounded w-3/4" />
        </div>

        {/* Metadatos */}
        <div className="flex gap-4 mb-6">
          <div className="h-3 bg-white/5 rounded w-20" />
          <div className="h-3 bg-white/5 rounded w-16" />
        </div>

        {/* Progreso */}
        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-2.5 bg-white/5 rounded w-14" />
              <div className="h-2.5 bg-white/5 rounded w-8" />
            </div>
            <div className="h-1.5 bg-white/5 rounded-full" />
          </div>

          {/* Botón */}
          <div className="h-12 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

/* ===== Grid de Skeletons ===== */
export function CoursesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}
