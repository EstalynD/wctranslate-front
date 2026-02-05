"use client"

import Link from "next/link"
import { Epilogue, Manrope } from "next/font/google"
import { useState, type FormEvent, type ChangeEvent, useEffect } from "react"
import { Eye, EyeOff, User, Mail, Lock, Building2, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/contexts"

/* ===== Fonts ===== */
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

/* ===== Types ===== */
interface FormData {
  email: string
  firstName: string
  lastName: string
  nickName: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  firstName?: string
  lastName?: string
  nickName?: string
  password?: string
  confirmPassword?: string
}

/* ===== Validation ===== */
const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: "La contraseña debe tener al menos 8 caracteres" }
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos una minúscula" }
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos una mayúscula" }
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos un número" }
  }
  return { isValid: true }
}

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {}

  if (!data.email.trim()) {
    errors.email = "El email es requerido"
  } else if (!validateEmail(data.email)) {
    errors.email = "El email no es válido"
  }

  if (!data.firstName.trim()) {
    errors.firstName = "El nombre es requerido"
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = "El nombre debe tener al menos 2 caracteres"
  }

  if (!data.lastName.trim()) {
    errors.lastName = "El apellido es requerido"
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = "El apellido debe tener al menos 2 caracteres"
  }

  if (!data.password) {
    errors.password = "La contraseña es requerida"
  } else {
    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message
    }
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden"
  }

  return errors
}

export default function RegisterPage() {
  const { register, isLoading: authLoading, error: authError, clearError, isAuthenticated } = useAuth()

  // Visual / UX state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    nickName: "",
    password: "",
    confirmPassword: "",
  })

  // Feedback state
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Limpiar errores al cambiar campos
  useEffect(() => {
    if (authError) {
      clearError()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error del campo específico
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()

    // Validar formulario
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    setIsSubmitting(true)

    try {
      await register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        profile: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          nickName: formData.nickName.trim() || undefined,
        },
      })
      // El redirect lo maneja el AuthContext
    } catch {
      // El error se maneja en el AuthContext
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = authLoading || isSubmitting
  const displayError = authError?.message

  // Si ya está autenticado, el AuthContext redirigirá
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#764BA2] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden ${epilogue.variable} ${manrope.variable}`}>
      {/* Background Layer - Studio Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center brightness-90"
        style={{
          backgroundImage: "url('/studio-bg.jpg')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#764BA2]/40 to-[#FF7E5F]/60 mix-blend-multiply z-[1]" />

      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-6 relative z-50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-lg text-[#764BA2]">
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-epilogue)' }}>
            WC <span className="font-normal opacity-90">TRAINING</span>
          </h2>
        </Link>
        <Link
          href="/login"
          className="hidden md:block bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-white/30 transition-all duration-300"
        >
          Iniciar Sesión
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[480px]">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1
              className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-md"
              style={{ fontFamily: 'var(--font-epilogue)' }}
            >
              Únete a nuestra comunidad
            </h1>
            <p
              className="text-white/90 text-lg font-medium"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              Solicita acceso a tu estudio
            </p>
          </div>

          {/* Register Card */}
          <div className="glass-pane rounded-2xl overflow-hidden p-8 md:p-10">
            {/* Card Header */}
            <div className="mb-8 border-b border-gray-100 pb-6 flex items-center justify-between">
              <div>
                <h2
                  className="text-[#764BA2] text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-epilogue)' }}
                >
                  Registro
                </h2>
                <p
                  className="text-gray-500 text-sm mt-1"
                  style={{ fontFamily: 'var(--font-manrope)' }}
                >
                  Introduce tus datos para enviar la solicitud
                </p>
              </div>
              <Building2 className="w-8 h-8 text-[#FF7E5F] opacity-50" />
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-gray-700 text-xs font-bold tracking-widest uppercase ml-1"
                >
                  Email *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@ejemplo.com"
                    required
                    autoComplete="email"
                    className={`w-full bg-white/50 border rounded-xl h-14 px-5 pr-12 text-gray-800 focus:outline-none input-glow transition-all duration-200 placeholder:text-gray-400 ${
                      formErrors.email ? "border-red-400" : "border-gray-200"
                    }`}
                    style={{ fontFamily: 'var(--font-manrope)' }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs ml-1">{formErrors.email}</p>
                )}
              </div>

              {/* First Name & Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-gray-700 text-xs font-bold tracking-widest uppercase ml-1"
                  >
                    Nombre *
                  </label>
                  <div className="relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      minLength={2}
                      autoComplete="given-name"
                      className={`w-full bg-white/50 border rounded-xl h-14 px-5 pr-12 text-gray-800 focus:outline-none input-glow transition-all duration-200 placeholder:text-gray-400 ${
                        formErrors.firstName ? "border-red-400" : "border-gray-200"
                      }`}
                      style={{ fontFamily: 'var(--font-manrope)' }}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  {formErrors.firstName && (
                    <p className="text-red-500 text-xs ml-1">{formErrors.firstName}</p>
                  )}
                </div>

                {/* Last Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-gray-700 text-xs font-bold tracking-widest uppercase ml-1"
                  >
                    Apellido *
                  </label>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      required
                      minLength={2}
                      autoComplete="family-name"
                      className={`w-full bg-white/50 border rounded-xl h-14 px-5 text-gray-800 focus:outline-none input-glow transition-all duration-200 placeholder:text-gray-400 ${
                        formErrors.lastName ? "border-red-400" : "border-gray-200"
                      }`}
                      style={{ fontFamily: 'var(--font-manrope)' }}
                    />
                  </div>
                  {formErrors.lastName && (
                    <p className="text-red-500 text-xs ml-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* NickName Field (optional) */}
              <div className="space-y-2">
                <label
                  htmlFor="nickName"
                  className="text-gray-700 text-xs font-bold tracking-widest uppercase ml-1"
                >
                  Nickname <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <input
                    id="nickName"
                    name="nickName"
                    type="text"
                    value={formData.nickName}
                    onChange={handleChange}
                    placeholder="Tu nombre artístico"
                    autoComplete="username"
                    className="w-full bg-white/50 border border-gray-200 rounded-xl h-14 px-5 pr-12 text-gray-800 focus:outline-none input-glow transition-all duration-200 placeholder:text-gray-400"
                    style={{ fontFamily: 'var(--font-manrope)' }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-gray-700 text-xs font-bold tracking-widest uppercase ml-1"
                >
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres, mayúscula, minúscula y número"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={`w-full bg-white/50 border rounded-xl h-14 px-5 pr-12 text-gray-800 focus:outline-none input-glow transition-all duration-200 placeholder:text-gray-400 ${
                      formErrors.password ? "border-red-400" : "border-gray-200"
                    }`}
                    style={{ fontFamily: 'var(--font-manrope)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#764BA2] transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs ml-1">{formErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-gray-700 text-xs font-bold tracking-widest uppercase ml-1"
                >
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className={`w-full bg-white/50 border rounded-xl h-14 px-5 pr-12 text-gray-800 focus:outline-none input-glow transition-all duration-200 placeholder:text-gray-400 ${
                      formErrors.confirmPassword ? "border-red-400" : "border-gray-200"
                    }`}
                    style={{ fontFamily: 'var(--font-manrope)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#764BA2] transition-colors"
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-xs ml-1">{formErrors.confirmPassword}</p>
                )}
              </div>

              {/* API Error Message */}
              {displayError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-sm font-medium" role="alert">
                    {displayError}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 btn-gradient text-white rounded-full font-bold text-lg tracking-wide shadow-xl disabled:opacity-70"
                  style={{ fontFamily: 'var(--font-epilogue)' }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registrando...
                    </span>
                  ) : (
                    "Crear Cuenta"
                  )}
                </button>
              </div>

              {/* Small Note */}
              <p
                className="text-gray-400 text-xs text-center"
                style={{ fontFamily: 'var(--font-manrope)' }}
              >
                Al registrarte aceptas nuestros términos de servicio y política de privacidad.
              </p>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-1 bg-gray-200" />
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">O</span>
                <div className="h-[1px] flex-1 bg-gray-200" />
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'var(--font-manrope)' }}>
                  ¿Ya tienes cuenta?
                  <Link
                    href="/login"
                    className="text-[#764BA2] font-bold hover:text-[#FF7E5F] ml-1 transition-colors cyber-soft"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer Links */}
          <div className="mt-10 flex justify-center gap-8 opacity-90">
            {["Ayuda", "Privacidad", "Términos"].map((text) => (
              <Link
                key={text}
                href={`/${text.toLowerCase()}`}
                className="text-white hover:text-[#FEB47B] text-xs font-bold uppercase tracking-widest transition-colors"
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center">
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">
          WC TRAINING SYSTEM • VERSION 2.4.0 • EDUCATION AND EMPOWERMENT
        </p>
      </footer>
    </div>
  )
}