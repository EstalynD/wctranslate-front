"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  ChevronDown,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Home,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/contexts"
import { PlanType } from "@/lib/types"

/* ===== Types ===== */
interface HeaderProps {
  onOpenMobile?: () => void
}

/* ===== Plan Label Map ===== */
const planLabelMap: Record<string, string> = {
  [PlanType.TESTER]: "Tester",
  [PlanType.FREE]: "Free",
  [PlanType.PRO]: "Pro",
  [PlanType.ELITE]: "Elite",
}

/* ===== Breadcrumb Map ===== */
const breadcrumbMap: Record<string, string> = {
  "/dashboard/home": "Inicio",
  "/dashboard/progress": "Mi Progreso",
  "/dashboard/library": "Módulos",
  "/dashboard/tasks": "Mis Tareas",
  "/dashboard/profile": "Perfil",
  "/dashboard/community": "Comunidad",
}

/* ===== Header Component ===== */
export function Header({ onOpenMobile }: HeaderProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const userMenuRef = useRef<HTMLDivElement>(null)

  // Datos del usuario autenticado
  const displayName = user
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : "Usuario"
  const avatarUrl = user?.profile.avatarUrl || null
  const userInitial = user?.profile.firstName?.charAt(0).toUpperCase() || "U"
  const planLabel = user
    ? planLabelMap[user.subscriptionAccess.planType] || user.subscriptionAccess.planType
    : ""
  const userLevel = user?.gamification.level ?? 0
  const userStars = user?.gamification.stars ?? 0

  // Get current page title from pathname
  const getPageTitle = () => {
    const basePath = Object.keys(breadcrumbMap).find((key) =>
      pathname.startsWith(key)
    )
    return basePath ? breadcrumbMap[basePath] : "Dashboard"
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Manejar logout
  const handleLogout = async () => {
    setIsUserMenuOpen(false)
    await logout()
  }

  return (
    <header className="h-20 border-b border-white/5 bg-[var(--deep-dark)]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="size-5" />
          </button>
        )}

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <Link
            href="/dashboard/home"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Home className="size-4" />
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-medium text-white">{getPageTitle()}</span>
        </nav>

        {/* Mobile Title */}
        <span className="sm:hidden text-white font-medium">{getPageTitle()}</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors group"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none group-hover:text-white transition-colors">
                {displayName}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <span className="text-[11px] text-primary font-bold uppercase tracking-wider">
                  {planLabel}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Nv. {userLevel}
                </span>
                {userStars > 0 && (
                  <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-medium">
                    <Star className="size-3 fill-amber-400" />
                    {userStars}
                  </span>
                )}
              </div>
            </div>
            <div className="size-11 rounded-full border-2 border-primary p-0.5 group-hover:border-primary/80 transition-colors">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`Foto de perfil de ${displayName}`}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">{userInitial}</span>
                </div>
              )}
            </div>
            <ChevronDown
              className={cn(
                "size-4 text-slate-400 hidden md:block transition-transform duration-200",
                isUserMenuOpen && "rotate-180"
              )}
            />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card-dark border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info */}
              <div className="p-4 border-b border-white/5">
                <p className="font-bold text-white">{displayName}</p>
                <p className="text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                  Plan {planLabel}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400">
                    Nivel {userLevel}
                  </span>
                  {userStars > 0 && (
                    <span className="flex items-center gap-0.5 text-[11px] text-amber-400">
                      <Star className="size-3 fill-amber-400" />
                      {userStars}
                    </span>
                  )}
                </div>
                {user?.email && (
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Menu Items */}
              <nav className="p-2">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User className="size-4" />
                  <span className="text-sm">Mi Perfil</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Settings className="size-4" />
                  <span className="text-sm">Configuración</span>
                </Link>
                <Link
                  href="/dashboard/help"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <HelpCircle className="size-4" />
                  <span className="text-sm">Centro de Ayuda</span>
                </Link>
              </nav>

              {/* Logout */}
              <div className="p-2 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="size-4" />
                  <span className="text-sm">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
