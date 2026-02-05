"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface SuggestedModule {
  id: string
  title: string
  image?: string
}

interface ModuleDetailFooterProps {
  suggestedModule?: SuggestedModule
  className?: string
}

/* ===== Module Detail Footer Component ===== */
export function ModuleDetailFooter({
  suggestedModule,
  className,
}: ModuleDetailFooterProps) {
  return (
    <footer
      className={cn(
        "mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8",
        className
      )}
    >
      {/* Suggested Module */}
      {suggestedModule && (
        <div className="flex items-center gap-6">
          <div className="size-24 rounded-2xl overflow-hidden shadow-2xl bg-[var(--surface)] flex-shrink-0">
            {suggestedModule.image ? (
              <Image
                src={suggestedModule.image}
                alt={suggestedModule.title}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <BookOpen className="size-8 text-primary" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-300">Próximo Módulo Sugerido</h4>
            <p className="text-xl font-black">{suggestedModule.title}</p>
          </div>
        </div>
      )}

      {/* Explore Button */}
      <Link
        href="/dashboard/library"
        className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors font-bold flex items-center gap-2 group"
      >
        Explorar otros módulos
        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </footer>
  )
}
