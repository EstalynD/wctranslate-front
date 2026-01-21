"use client"

import { useState } from "react"
import {
    Bell,
    BookOpen,
    TrendingUp,
    LayoutGrid,
    ClipboardCheck,
    Users,
    Trophy,
    Clock,
    Star,
    Sparkles,
    Menu,
} from "lucide-react"

export default function Layout({ children }) {
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
                        <DashboardContent />
                    </section>
                </main>
            </div>

            {/* Mobile layout */}
            <div className="md:hidden">
                <Header onOpenMobile={() => setIsMobileOpen(true)} />
                <section className="p-6">
                    {children}
                    <DashboardContent />
                </section>
            </div>
        </div>
    )
}

/* Sidebar component */
function SidebarContent({ collapsed = false, onToggle }) {
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
                    { label: "Inicio", icon: LayoutGrid },
                    { label: "Mi Progreso", icon: TrendingUp },
                    { label: "Módulos", icon: BookOpen },
                    { label: "Mis Tareas", icon: ClipboardCheck },
                    { label: "Comunidad", icon: Users },
                ].map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        className={`flex w-full items-center rounded-lg px-4 py-3 hover:bg-white/5 ${
                            collapsed ? "justify-center" : "gap-3"
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        {!collapsed && <span>{label}</span>}
                    </button>
                ))}
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
                <span className="text-sm text-white/50">Panel de formación</span>
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

/* Main dashboard content */
function DashboardContent() {
    return (
        <div>
            {/* Greeting section */}
            <div className="mb-10 max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold">
                    ¡Hola,{" "}
                    <span className="bg-linear-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                        Modelo
                    </span>
                    !
                </h1>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold">
                    ¿Lista para brillar hoy?
                </h2>
                <p className="mt-4 text-white/60">
                    Tienes <span className="text-white">2 nuevas tareas</span> y un
                    logro a punto de desbloquearse.
                </p>
            </div>

            {/* Dashboard cards */}
            <div className="mb-12 grid grid-flow-col auto-cols-[240px] gap-5 overflow-x-auto snap-x sm:auto-cols-[260px] md:grid-flow-row md:grid-cols-3 md:auto-cols-auto md:overflow-visible">
                {/* Progress card */}
                <div className="snap-start h-65 rounded-3xl bg-[#15132d] p-5 shadow-lg">
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="relative mb-3 w-24 h-24 md:w-32 md:h-32">
                            <div className="absolute inset-0 rounded-full border-8 border-white/10" />
                            <div className="absolute inset-0 rounded-full border-8 border-orange-400 border-t-transparent rotate-220" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-xl md:text-2xl font-bold">72%</p>
                            </div>
                        </div>
                        <p className="text-base md:text-lg font-semibold">Tu Progreso</p>
                        <p className="mt-1 text-sm text-white/50">
                            Estás a solo 4 módulos de completar el nivel intermedio.
                        </p>
                    </div>
                </div>

                {/* Next task card */}
                <div className="snap-start h-65 flex flex-col rounded-3xl bg-[#15132d] p-5 shadow-lg">
                    <span className="inline-flex w-fit items-center gap-1 mb-3 rounded-full bg-orange-500/15 px-3 py-1 text-[11px] uppercase tracking-wide text-orange-400">
                        PRÓXIMA TAREA
                    </span>
                    <p className="text-lg md:text-xl font-semibold">
                        Seducción con palabras en tus transmisiones
                    </p>
                    <p className="mt-3 text-sm text-white/60">
                        Aprende a cautivar a tu audiencia con el poder de la palabra.
                    </p>
                    <button className="group mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-400 to-pink-500 px-6 py-3 text-sm font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-10px_rgba(249,115,22,0.8)] active:translate-y-0">
                        Continuar{" "}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </button>
                </div>

                {/* Achievements card */}
                <div className="snap-start h-65 rounded-3xl bg-[#15132d] p-5 shadow-lg">
                    <div className="flex justify-between mb-4">
                        <p className="text-base md:text-lg font-semibold">Logros recientes</p>
                        <button className="text-sm text-orange-400 hover:underline">
                            Ver todos
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: Trophy, text: "Top Streamer", color: "text-yellow-400" },
                            { icon: Clock, text: "Madrugadora", color: "text-blue-400" },
                            { icon: Star, text: "Estrella 5", color: "text-purple-400" },
                            {
                                icon: Sparkles,
                                text: "Todos tus Logros",
                                color: "text-orange-400",
                            },
                        ].map(({ icon: Icon, text, color }) => (
                            <div
                                key={text}
                                className="rounded-xl bg-white/5 p-3 flex flex-col items-center justify-center text-center transition hover:bg-white/10"
                            >
                                <Icon className={`w-6 h-6 mb-2 ${color}`} />
                                <p className="text-xs text-white/70 leading-tight">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active modules section */}
            <section className="mt-20">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Módulos en curso</h3>
                    <button className="text-sm text-white/60 transition hover:text-white">
                        Explorar historial →
                    </button>
                </div>

                {/* Module cards grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Module 1 */}
                    <div className="group relative h-65 overflow-hidden rounded-3xl bg-[#15132d] shadow-lg">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/40 to-indigo-600/40" />
                        <img
                            src="/psi.png"
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs backdrop-blur">
                            Avanzado
                        </span>
                        <div className="relative z-10 flex h-full flex-col justify-end p-6">
                            <h4 className="text-lg font-semibold leading-tight">
                                Psicología de la Audiencia
                            </h4>
                            <p className="mt-1 text-sm text-white/60">
                                Engagement, retención y conexión emocional
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition group-hover:opacity-100" />
                    </div>

                    {/* Module 2 */}
                    <div className="group relative h-65 overflow-hidden rounded-3xl bg-[#15132d] shadow-lg">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/40 to-indigo-600/40" />
                        <img
                            src="/ret.png"
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs backdrop-blur">
                            Intermedio
                        </span>
                        <div className="relative z-10 flex h-full flex-col justify-end p-6">
                            <h4 className="text-lg font-semibold leading-tight">
                                Retencion de usuarios
                            </h4>
                            <p className="mt-1 text-sm text-white/60">
                                Aprende a mantener a tu audiencia cautiva
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition group-hover:opacity-100" />
                    </div>

                    {/* Module 3 */}
                    <div className="group relative h-65 overflow-hidden rounded-3xl bg-[#15132d] shadow-lg">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/40 to-indigo-600/40" />
                        <img
                            src="/confg.png"
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs backdrop-blur">
                            Basico
                        </span>
                        <div className="relative z-10 flex h-full flex-col justify-end p-6">
                            <h4 className="text-lg font-semibold leading-tight">
                                Aprende a configurar tus transmisiones
                            </h4>
                            <p className="mt-1 text-sm text-white/60">
                                Configuracion de transmisiones
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition group-hover:opacity-100" />
                    </div>

                    {/* Module 4 */}
                    <div className="group relative h-65 overflow-hidden rounded-3xl bg-[#15132d] shadow-lg">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/40 to-indigo-600/40" />
                        <img
                            src="/leng.png"
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs backdrop-blur">
                            Intermedio
                        </span>
                        <div className="relative z-10 flex h-full flex-col justify-end p-6">
                            <h4 className="text-lg font-semibold leading-tight">
                                Lenguaje seductor en transmisiones
                            </h4>
                            <p className="mt-1 text-sm text-white/60">
                                Aprende a cautivar a tu audiencia con el poder de la palabra
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition group-hover:opacity-100" />
                    </div>

                    {/* Module 5 */}
                    <div className="group relative h-65 overflow-hidden rounded-3xl bg-[#15132d] shadow-lg">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/40 to-indigo-600/40" />
                        <img
                            src="/pos.png"
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs backdrop-blur">
                            Avanzado
                        </span>
                        <div className="relative z-10 flex h-full flex-col justify-end p-6">
                            <h4 className="text-lg font-semibold leading-tight">
                                Poses y Expresiones
                            </h4>
                            <p className="mt-1 text-sm text-white/60">
                                Domina el arte de la comunicación no verbal
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition group-hover:opacity-100" />
                    </div>

                    {/* Module 6 */}
                    <div className="group relative h-65 overflow-hidden rounded-3xl bg-[#15132d] shadow-lg">
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/40 to-indigo-600/40" />
                        <img
                            src="/show.png"
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute top-4 left-4 z-10 rounded-full bg-black/40 px-3 py-1 text-xs backdrop-blur">
                            Avanzado
                        </span>
                        <div className="relative z-10 flex h-full flex-col justify-end p-6">
                            <h4 className="text-lg font-semibold leading-tight">
                                Guia de shows
                            </h4>
                            <p className="mt-1 text-sm text-white/60">
                                Aprende los diferentes tipos de shows y como realizarlos
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 transition group-hover:opacity-100" />
                    </div>
                </div>
            </section>
        </div>
    )
}
