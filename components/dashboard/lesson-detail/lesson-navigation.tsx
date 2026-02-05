"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface LessonNavItem {
  id: string
  title: string
}

interface LessonNavigationProps {
  moduleId: string
  previousLesson?: LessonNavItem
  nextLesson?: LessonNavItem
  className?: string
}

/* ===== Lesson Navigation Component ===== */
export function LessonNavigation({
  moduleId,
  previousLesson,
  nextLesson,
  className,
}: LessonNavigationProps) {
  return (
    <div
      className={cn(
        "mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6",
        className
      )}
    >
      {/* Previous Lesson */}
      {previousLesson ? (
        <Link
          href={`/dashboard/library/${moduleId}/${previousLesson.id}`}
          className="flex items-center gap-4 group"
        >
          <div className="size-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors">
            <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Anterior
            </p>
            <p className="font-bold">{previousLesson.title}</p>
          </div>
        </Link>
      ) : (
        <div /> /* Spacer */
      )}

      {/* Next Lesson */}
      {nextLesson ? (
        <Link
          href={`/dashboard/library/${moduleId}/${nextLesson.id}`}
          className="flex items-center gap-4 group text-right"
        >
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Siguiente Tema
            </p>
            <p className="font-bold">{nextLesson.title}</p>
          </div>
          <div className="size-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-colors">
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ) : (
        <div /> /* Spacer */
      )}
    </div>
  )
}
