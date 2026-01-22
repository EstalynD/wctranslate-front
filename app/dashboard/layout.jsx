"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Bell,
  BookOpen,
  TrendingUp,
  LayoutGrid,
  ClipboardCheck,
  Users,
  Menu,
} from "lucide-react"

export default function DashboardLayout({ children }) {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0b0a1a] text-white">
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <>
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0d24] border-r border-white/5 md:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Desktop layout */}
      <div className="hidden md:grid min-h-screen grid-cols-[auto_1fr]">
        <aside
          className={`bg-[#0f0d24] border-r border-white/5 transition-all duration-300 ${
            isDesktopCollapsed ? "w-20" : "w-64"
          }`}
        >
          <SidebarContent
            collapsed={isDesktopCollapsed}
            onToggle={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
          />
        </aside>

        <main className="min-h-screen">
          <Header onOpenMobile={() => setIsMobileOpen(true)} />
          <section className="p-6 md:p-8">
            {children}
          </section>
        </main>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <Header onOpenMobile={() => setIsMobileOpen(true)} />
        <section className="p-6">
          {children}
        </section>
      </div>
    </div>
  )
}

/* Sidebar component */
function SidebarContent({ collapsed = false, onToggle }) {
  const pathname = usePathname()

  return (
    <div className="h-full">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-6 hover:bg-white/5"
      >
        <img src="/logo.svg" className="w-10 h-10" />
        {!collapsed && (
          <div>
            <p className="font-bold">WC TRAINING</p>
            <span className="text-xs text-white/40">Models Edition</span>
          </div>
        )}
      </button>

      <nav className="px-3 space-y-1">
        {[
          { label: "Inicio", icon: LayoutGrid, href: "/dashboard/home" },
          { label: "Mi Progreso", icon: TrendingUp, href: "/dashboard/progress" },
          { label: "Módulos", icon: BookOpen, href: "/dashboard/library" },
          { label: "Mis Tareas", icon: ClipboardCheck, href: "/dashboard/tasks" },
          { label: "Comunidad", icon: Users, href: "/dashboard/community" },
        ].map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href

          return (
            <Link
              key={label}
              href={href}
              className={`flex w-full items-center rounded-lg px-4 py-3 ${
                isActive
                  ? "bg-orange-500/10 text-orange-400"
                  : "hover:bg-white/5 text-white/60"
              } ${collapsed ? "justify-center" : "gap-3"}`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

/* Header component */
function Header({ onOpenMobile }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/5 px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-lg hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm text-white/50">Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">Modelo</p>
            <p className="text-xs text-orange-400">NIVEL INTERMEDIO</p>
          </div>
        </div>
      </div>
    </header>
  )
}