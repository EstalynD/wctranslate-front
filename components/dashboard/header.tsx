"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Menu,
  ChevronDown,
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  X,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface HeaderProps {
  onOpenMobile?: () => void
  user?: {
    name: string
    level: string
    avatar: string
  }
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

/* ===== Mock Notifications ===== */
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nueva tarea disponible",
    message: "Se ha agregado una nueva tarea en el módulo de Engagement",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "2",
    title: "¡Logro desbloqueado!",
    message: "Has completado tu primera semana de entrenamiento",
    time: "Hace 2 horas",
    read: false,
  },
  {
    id: "3",
    title: "Feedback recibido",
    message: "Tu instructor ha comentado tu última entrega",
    time: "Hace 1 día",
    read: true,
  },
]

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
export function Header({
  onOpenMobile,
  user = {
    name: "Elena Vance",
    level: "Nivel Diamante",
    avatar: "https://i.pravatar.cc/100",
  },
}: HeaderProps) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Get current page title from pathname
  const getPageTitle = () => {
    const basePath = Object.keys(breadcrumbMap).find((key) =>
      pathname.startsWith(key)
    )
    return basePath ? breadcrumbMap[basePath] : "Dashboard"
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
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

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar módulos, tareas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="md:hidden p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          aria-label="Buscar"
        >
          <Search className="size-5" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen)
              setIsUserMenuOpen(false)
            }}
            className="relative p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            aria-label="Notificaciones"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--deep-dark)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card-dark border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h3 className="font-bold">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Marcar todas como leídas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={cn(
                        "w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.read && (
                          <span className="size-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={cn(!notification.read ? "" : "ml-5")}>
                          <p className="text-sm font-semibold">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="size-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tienes notificaciones</p>
                  </div>
                )}
              </div>
              <Link
                href="/dashboard/notifications"
                className="block p-3 text-center text-sm text-primary hover:bg-white/5 transition-colors border-t border-white/5"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 hidden sm:block" aria-hidden="true" />

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen)
              setIsNotificationsOpen(false)
            }}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors group"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none group-hover:text-white transition-colors">
                {user.name}
              </p>
              <p className="text-[11px] text-primary font-bold uppercase tracking-wider mt-1">
                {user.level}
              </p>
            </div>
            <div className="size-11 rounded-full border-2 border-primary p-0.5 group-hover:border-primary/80 transition-colors">
              <Image
                src={user.avatar}
                alt={`Foto de perfil de ${user.name}`}
                width={44}
                height={44}
                className="w-full h-full object-cover rounded-full"
              />
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
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                  {user.level}
                </p>
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
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    // TODO: Implement logout
                  }}
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

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full bg-[var(--deep-dark)] border-b border-white/5 p-4 md:hidden animate-in slide-in-from-top duration-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar módulos, tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
            <button
              onClick={() => {
                setIsSearchOpen(false)
                setSearchQuery("")
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
