"use client"

import { useState, type ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

/* ===== Types ===== */
interface DashboardLayoutProps {
  children: ReactNode
}

/* ===== Main Dashboard Layout ===== */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const closeMobileSidebar = () => setIsMobileOpen(false)
  const openMobileSidebar = () => setIsMobileOpen(true)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--deep-dark)] text-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          onKeyDown={(e) => e.key === "Escape" && closeMobileSidebar()}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          role="button"
          tabIndex={0}
          aria-label="Cerrar menú"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isMobile onClose={closeMobileSidebar} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header onOpenMobile={openMobileSidebar} />

        {/* Page Content */}
        <div className="p-2 sm:p-4 md:p-10 space-y-6 md:space-y-10">
          {children}
        </div>
      </main>
    </div>
  )
}
