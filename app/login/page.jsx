"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react"
import { Poppins } from "next/font/google"
import { useState } from "react"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

/* ===== Animations ===== */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: "easeOut",
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
}





export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  
  const [attempts, setAttempts] = useState(0)
  const [showForgot, setShowForgot] = useState(false)
  const [error, setError] = useState("")
  const MAX_ATTEMPTS = 3
  const handleLogin = async () => {
  // 🔴 SIMULACIÓN de login fallido
  const loginSuccess = false // aquí luego va tu llamada real al backend

    if (!loginSuccess) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setError("Usuario o contraseña incorrectos")

      if (newAttempts >= MAX_ATTEMPTS) {
        setShowForgot(true)
      }
      return
    }

  
    setAttempts(0)
    setShowForgot(false)
    setError("")
  }
  
  return (
  
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`relative h-screen w-full overflow-hidden ${poppins.className}`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg3.png')",
          backgroundSize: "1200px auto",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Header */}
      <motion.div variants={item} className="relative z-10 h-24">
        {/* Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-24 sm:translate-x-0 sm:top-14 flex items-center gap-3">
          <img src="/logo.svg" alt="WC Training" className="h-14 w-14 sm:h-16 sm:w-16" />
          <span className="text-white text-xl sm:text-3xl flex items-center gap-3 leading-none">
            <span className="text-purple-500">WC</span>{" "} 
            TRAINING
          </span>
        </div>

        {/* CTA */}
        <div className="hidden sm:block absolute top-14 right-24">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-full bg-white/25 backdrop-blur-xl border border-white/70 px-10 py-3"
          >
            <button className="text-white font-medium px-6 py-2 sm:px-10 sm:py-3">
              Unirse ahora
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Login */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-0">
        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center">
          <motion.p variants={item} className="text-sm text-white/80 mb-1">
            ¡Qué bueno verte de nuevo!
          </motion.p>

          <motion.p
            variants={item}
            className="font-bold mb-6 text-[22px] text-center text-white"
          >
            Empoderando tu crecimiento profesional
          </motion.p>

          <motion.div variants={item} className="w-full">
            <Card className="w-full rounded-3xl bg-white/80 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-medium bg-gradient-to-r from-orange-400  to-purple-600 bg-clip-text text-transparent">
                  Acceso Modelo
                </CardTitle>
                <p className="text-sm text-black">
                  Ingresa a tu panel de formación
                </p>
              </CardHeader>

              <div className="px-6">
                <div className="h-px bg-gray-200" />
              </div>

              <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-2 text-black">
                  <Label>Email o usuario</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2 text-black">
                  <Label>Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={handleLogin}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect()
                    setPos({
                      x: ((e.clientX - r.left) / r.width) * 100,
                      y: ((e.clientY - r.top) / r.height) * 100,
                    })
                  }}
                  className="w-full rounded-full text-white shadow-lg"
                  style={{
                    background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, #a855f7, #6366f1, #f97316)`,
                  }}
                >
                  Iniciar sesión
                </Button>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
                  )}
                  {showForgot && (
                    <div className="mt-2 text-center">
                      <button className="text-sm text-purple-600 hover:underline">
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  )}
                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">o</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Create account */}
                <div className="flex justify-center gap-2 text-sm">
                  <span className="text-gray-500">¿No tienes cuenta?</span>
                  <button className="relative flex items-center gap-1 font-medium text-purple-500 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-gradient-to-r after:from-orange-500 after:via-purple-500 after:to-indigo-500">
                    Crear cuenta
                    <GraduationCap size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div variants={item} className="mt-6 flex gap-6 text-xs text-white/60">
            {["Ayuda", "Privacidad", "Términos"].map((t) => (
              <button key={t} className="hover:text-white hover:underline">
                {t}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
