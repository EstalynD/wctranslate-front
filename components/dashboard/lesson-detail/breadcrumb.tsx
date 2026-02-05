"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/* ===== Breadcrumb Component ===== */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm font-medium", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={item.label} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-slate-500 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white" : "text-slate-500"}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="size-3 text-slate-700" />
            )}
          </div>
        )
      })}
    </nav>
  )
}
