"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, ArrowRight, Brain, Clock, BookOpen, Users, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/types/course.types"
import {
  CourseCategory,
  CourseLevel,
  levelLabels,
} from "@/lib/types/course.types"

/* ===== Props ===== */
interface LibraryModuleCardProps {
  course: Course
  /** Progreso del usuario 0-100 (se obtendrá de la API de progreso) */
  progress?: number
  className?: string
}

/* ===== Level Styles ===== */
const levelStyles: Record<CourseLevel, string> = {
  [CourseLevel.BASIC]: "bg-white/10 backdrop-blur-md text-white",
  [CourseLevel.INTERMEDIATE]: "bg-white/10 backdrop-blur-md text-white",
  [CourseLevel.ADVANCED]: "bg-primary text-white",
}

/* ===== Gradient Backgrounds para cursos sin thumbnail ===== */
const categoryGradients: Record<CourseCategory, string> = {
  [CourseCategory.TECHNICAL]: "from-rose-900 to-orange-950",
  [CourseCategory.MARKETING]: "from-violet-900 to-purple-950",
  [CourseCategory.PSYCHOLOGY]: "from-indigo-900 to-violet-950",
  [CourseCategory.LEGAL]: "from-amber-900 to-yellow-950",
  [CourseCategory.STYLING]: "from-pink-900 to-rose-950",
  [CourseCategory.COMMUNICATION]: "from-sky-900 to-cyan-950",
  [CourseCategory.GENERAL]: "from-slate-800 to-slate-950",
}

/* ===== Helpers ===== */
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

/* ===== Library Module Card Component ===== */
export function LibraryModuleCard({ course, progress = 0, className }: LibraryModuleCardProps) {
  const hasProgress = progress > 0
  const isCompleted = progress === 100
  const isLocked = course.isLocked ?? false

  return (
    <div
      className={cn(
        "group bg-[var(--surface)] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-xl shadow-black/20 transition-all",
        isLocked
          ? "opacity-60 cursor-not-allowed"
          : "hover:border-white/20",
        className
      )}
    >
      {/* Imagen */}
      <div className="relative h-52 overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <>
            <div className={cn("absolute inset-0 bg-gradient-to-br", categoryGradients[course.category])} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="size-16 text-white/20" />
            </div>
          </>
        )}

        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

        {/* Overlay de bloqueado */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="size-16 rounded-full bg-slate-800/80 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Lock className="size-8 text-slate-400" />
            </div>
          </div>
        )}

        {/* Badge completado o bloqueado */}
        {isLocked ? (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-slate-700/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock className="size-3" />
              Bloqueado
            </span>
          </div>
        ) : isCompleted ? (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider text-white">
              Completado
            </span>
          </div>
        ) : null}

        {/* Badge nivel */}
        <div className="absolute bottom-4 right-4">
          <span
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
              levelStyles[course.level]
            )}
          >
            {levelLabels[course.level]}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Metadatos */}
        <div className="flex items-center gap-4 mb-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-3.5" />
            {course.totalLessons} lecciones
          </span>
          {course.totalDurationMinutes > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatDuration(course.totalDurationMinutes)}
            </span>
          )}
          {course.enrolledCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              {course.enrolledCount}
            </span>
          )}
        </div>

        {/* Progreso y Acción */}
        <div className="mt-auto space-y-4">
          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Progreso</span>
              <span className={hasProgress ? "text-primary" : "text-slate-600"}>
                {progress}%
              </span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isCompleted
                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    : hasProgress
                      ? "gradient-coral-violet shadow-[0_0_10px_rgba(255,126,95,0.4)]"
                      : "bg-white/10"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Botón de acción */}
          {isLocked ? (
            <div
              className="w-full py-3.5 rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-1 bg-slate-800/50 border border-white/5 text-slate-500 cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Lock className="size-4" />
                Bloqueado
              </span>
              {course.lockReason && (
                <span className="text-[10px] font-normal text-slate-600">
                  {course.lockReason}
                </span>
              )}
            </div>
          ) : (
            <Link
              href={`/dashboard/library/${course.slug}`}
              className={cn(
                "w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                hasProgress
                  ? "gradient-coral-violet hover:opacity-90 shadow-lg shadow-primary/20 text-white"
                  : "bg-white/10 hover:bg-white/20 border border-white/10 text-white"
              )}
            >
              <span>{isCompleted ? "Repasar" : hasProgress ? "Continuar" : "Comenzar"}</span>
              {hasProgress ? (
                <Play className="size-4 fill-current" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
