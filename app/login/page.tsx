"use client"

import Link from "next/link"
import { Epilogue, Manrope } from "next/font/google"
import { useState, type FormEvent, useEffect } from "react"
import { Eye, EyeOff, User, GraduationCap, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/contexts"

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-epilogue",
})

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
})

const MAX_ATTEMPTS = 3

export default function LoginPage() {
  const { login, isLoading: authLoading, error: authError, clearError, isAuthenticated } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [showForgot, setShowForgot] = useState(false)
  const [localError, setLocalError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Limpiar error al cambiar campos
  useEffect(() => {
    if (localError || authError) {
      setLocalError("")
      clearError()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError("")
    clearError()
    setIsSubmitting(true)

    // Validación básica
    if (!email.trim()) {
      setLocalError("El email es requerido")
      setIsSubmitting(false)
      return
    }

    if (!password) {
      setLocalError("La contraseña es requerida")
      setIsSubmitting(false)
      return
    }

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      })
      // El redirect lo maneja el AuthContext
    } catch (err) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= MAX_ATTEMPTS) {
        setShowForgot(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = authLoading || isSubmitting
  const displayError = localError || authError?.message

  // Si ya está autenticado, el AuthContext redirigirá
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#764BA2] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative ${epilogue.variable} ${manrope.variable}`}>
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-[#FF7E5F]/30 to-[#764BA2]/50" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow-lg text-[#764BA2]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48">
              <path
                clipRule="evenodd"
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-epilogue)' }}>
            WC <span className="font-normal opacity-80">TRAINING</span>
          </span>
        </div>
        <Link
          href="/register"
          className="hidden sm:block bg-white/15 backdrop-blur border border-white/25 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/25 transition-all"
        >
          Unirse ahora
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg" style={{ fontFamily: 'var(--font-epilogue)' }}>
              ¡Bienvenida de nuevo!
            </h1>
            <p className="text-white/80 text-sm mt-1" style={{ fontFamily: 'var(--font-manrope)' }}>
              Empoderando tu carrera profesional
            </p>
          </div>

          {/* Card */}
          <div className="glass-pane rounded-2xl p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
              <div>
                <h2 className="text-[#764BA2] text-xl font-bold" style={{ fontFamily: 'var(--font-epilogue)' }}>
                  Acceso Modelo
                </h2>
                <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: 'var(--font-manrope)' }}>
                  Ingresa a tu panel de formación
                </p>
              </div>
              <GraduationCap className="w-7 h-7 text-[#FF7E5F]/50" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-gray-600 text-[11px] font-bold tracking-wider uppercase ml-1">
                  Email o Usuario
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    required
                    autoComplete="email"
                    className="w-full bg-white/60 border border-gray-200 rounded-xl h-12 px-4 pr-11 text-gray-800 text-sm focus:outline-none focus:border-[#FF7E5F] focus:ring-2 focus:ring-[#FF7E5F]/20 transition-all placeholder:text-gray-400"
                  />
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-gray-600 text-[11px] font-bold tracking-wider uppercase">
                    Contraseña
                  </label>
                  {showForgot && (
                    <Link href="/forgot-password" className="text-[#764BA2] hover:text-[#FF7E5F] text-[11px] font-bold transition-colors">
                      ¿Olvidaste tu clave?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full bg-white/60 border border-gray-200 rounded-xl h-12 px-4 pr-11 text-gray-800 text-sm focus:outline-none focus:border-[#FF7E5F] focus:ring-2 focus:ring-[#FF7E5F]/20 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#764BA2] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {displayError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-xs font-medium">{displayError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 btn-gradient text-white rounded-full font-bold text-base shadow-lg mt-2"
                style={{ fontFamily: 'var(--font-epilogue)' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Iniciando...
                  </span>
                ) : "Iniciar Sesión"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">O</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Register */}
              <p className="text-center text-gray-500 text-sm">
                ¿Eres nueva?{" "}
                <Link href="/register" className="text-[#764BA2] font-bold hover:text-[#FF7E5F] transition-colors">
                  Crea tu cuenta
                </Link>
              </p>
            </form>
          </div>

          {/* Links */}
          <div className="mt-6 flex justify-center gap-6">
            {["Ayuda", "Privacidad", "Términos"].map((t) => (
              <Link key={t} href={`/${t.toLowerCase()}`} className="text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-white/50 text-[9px] font-bold uppercase tracking-[0.25em]">
          WC TRAINING • V2.4.0
        </p>
      </footer>
    </div>
  )
}