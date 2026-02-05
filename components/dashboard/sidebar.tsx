"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  Sparkles,
  HelpCircle,
  X,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface NavItem {
  label: string
  icon: React.ElementType
  href: string
}

interface SidebarProps {
  collapsed?: boolean
  isMobile?: boolean
  onClose?: () => void
}

/* ===== Navigation Items ===== */
const navItems: NavItem[] = [
  { label: "Inicio", icon: LayoutDashboard, href: "/dashboard/home" },
  { label: "Mi Progreso", icon: TrendingUp, href: "/dashboard/progress" },
  { label: "Módulos", icon: BookOpen, href: "/dashboard/library" },
  { label: "Mis Tareas", icon: ClipboardCheck, href: "/dashboard/tasks" },
  { label: "Mi Perfil", icon: User, href: "/dashboard/profile" },
  { label: "Comunidad", icon: MessageSquare, href: "/dashboard/community" },
]

/* ===== Sidebar Component ===== */
export function Sidebar({ collapsed = false, isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-full flex-col justify-between py-8 bg-[var(--deep-dark)] border-r border-white/5",
        collapsed ? "w-20" : "w-64",
        "transition-all duration-300 ease-in-out"
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-10 px-6">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 gradient-coral-violet rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Sparkles className="size-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="text-xl font-black leading-none tracking-tight">
                  WC TRAINING
                </h1>
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                  Model Edition
                </p>
              </div>
            )}
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/")

            return (
              <Link
                key={href}
                href={href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                  isActive
                    ? "bg-white/10 text-white font-semibold"
                    : "hover:bg-white/5 text-slate-400 hover:text-white",
                  collapsed && "justify-center px-3"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "size-5 flex-shrink-0 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-primary"
                  )}
                />
                {!collapsed && <span className="text-sm">{label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section - Support Card */}
      {!collapsed && (
        <div className="px-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="size-4 text-slate-400" />
              <p className="text-xs text-slate-400">Soporte 24/7</p>
            </div>
            <button className="w-full text-xs font-bold py-2.5 px-4 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-all">
              Centro de Ayuda
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
