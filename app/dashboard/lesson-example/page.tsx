"use client"

import { ArrowLeft, Clock, CheckCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { ContentBlockRenderer, BlockType, ContentBlock } from "@/components/dashboard/lesson-detail/content-block-renderer"

/* ===== Mock Data - Esto vendría del API ===== */
const mockLesson = {
  _id: "lesson_001",
  title: "Test de Afinidad para Modelos",
  slug: "test-de-afinidad-para-modelos",
  description: "Descubre con qué perfil de usuario tendrás mayor compatibilidad y potencial de ventas. Este test analizará tus preferencias, estilo y personalidad.",
  type: "READING",
  status: "PUBLISHED",
  durationMinutes: 15,

  // 🧱 Content Blocks - El HTML interactivo se carga como IFRAME
  contentBlocks: [
    {
      type: BlockType.IFRAME,
      order: 1,
      iframeSrc: "/lessons/task-1-tarea-1-de-prueba.html",
      settings: {
        allowFullScreen: true,
        height: "900px"
      }
    }
  ] as ContentBlock[],

  resources: [],

  // Información del módulo/tema padre
  theme: {
    title: "Psicología de la Audiencia",
    module: {
      title: "Módulo 1: Fundamentos"
    }
  }
}

/* ===== Page Component ===== */
export default function LessonDetailPage() {
  const lesson = mockLesson

  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white">
      {/* Header con padding normal */}
      <div className="px-4 md:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/dashboard/library" className="hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Volver a Módulos
          </Link>
          <span>/</span>
          <span className="hidden sm:inline">{lesson.theme.module.title}</span>
          <span className="hidden sm:inline">/</span>
          <span className="truncate max-w-[150px] sm:max-w-none">{lesson.theme.title}</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="size-3" />
              Lectura Interactiva
            </span>
            <span className="text-slate-400 text-xs sm:text-sm flex items-center gap-1.5">
              <Clock className="size-3 sm:size-4" />
              {lesson.durationMinutes} min
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3">
            {lesson.title}
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-sm sm:text-base md:text-lg">
            {lesson.description}
          </p>
        </header>
      </div>

      {/* Content Blocks - Full width con padding mínimo */}
      <main className="bg-[#15132d] rounded-t-3xl md:rounded-3xl md:mx-4 lg:mx-6 p-4 sm:p-6 md:p-8 border border-white/5 border-b-0 md:border-b">
        <ContentBlockRenderer blocks={lesson.contentBlocks} />

      </main>

      {/* Footer - Navegación */}
      <footer className="sticky bottom-0 bg-[#0b0a1a]/95 backdrop-blur-lg border-t border-white/5 px-4 py-4 md:px-6">
        <div className="flex justify-between items-center gap-2">
          <Link
            href="/dashboard/library"
            className="px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
          >
            ← <span className="hidden sm:inline">Anterior</span>
          </Link>

          <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2">
            <CheckCircle className="size-4" />
            <span className="hidden xs:inline">Completar</span>
            <span className="xs:hidden">✓</span>
          </button>

          <Link
            href="/dashboard/library"
            className="px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
          >
            <span className="hidden sm:inline">Siguiente</span> →
          </Link>
        </div>
      </footer>
    </div>
  )
}
