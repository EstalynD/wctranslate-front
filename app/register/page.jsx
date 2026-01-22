"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"
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
      staggerChildren: 0.06,
      ease: "easeOut",
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38 },
  },
}

export default function RegisterPage() {
  // visual / UX
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [showPassword, setShowPassword] = useState(false)

  // form state
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [estudio, setEstudio] = useState("") // select value
  const [password, setPassword] = useState("")

  // feedback
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // simple validators
  const validateEmail = (e) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())
  const isFormValid = () =>
    validateEmail(email) &&
    nickname.trim().length >= 2 &&
    estudio.trim().length > 0 &&
    password.length >= 6

  // fake submit (replace with tu API)
  const handleRegister = async (ev) => {
    ev?.preventDefault()
    setError("")
    if (!isFormValid()) {
      setError("Por favor completa correctamente todos los campos (min. contraseña 6 caracteres).")
      return
    }

    try {
      setLoading(true)
      // Simulación de llamada al backend — reemplaza por fetch/axios
      await new Promise((res) => setTimeout(res, 900))

      // ejemplo: si la API responde ok -> success
      setSuccess(true)
      // reset (si quieres)
      setEmail("")
      setNickname("")
      setEstudio("")
      setPassword("")
    } catch (err) {
      setError("Ocurrió un error al registrar. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`relative h-screen w-full overflow-hidden ${poppins.className}`}
    >
      {/* Background (puedes cambiar la imagen para registro) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/register-bg.png')",
          backgroundSize: "1300px",
          filter: "brightness(.55) ", // lo hace menos distractor
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Header (reutilizable) */}
      <motion.div variants={item} className="relative z-10 h-24">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-24 sm:translate-x-0 sm:top-14 flex items-center gap-3">
          <img src="/logo.svg" alt="WC Training" className="h-14 w-14 sm:h-16 sm:w-16" />
          <span className="text-white text-xl sm:text-3xl flex items-center gap-3 leading-none">
            <span className="text-purple-500">WC</span>{" "}TRAINING
          </span>
        </div>
      </motion.div>

      {/* Register form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-0">
        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center">
          <motion.p variants={item} className="text-sm text-white/80 mb-1">
            Bienvenido — crea tu cuenta
          </motion.p>

          <motion.p variants={item} className="font-bold mb-6 text-[20px] sm:text-[22px] text-center text-white">
            Solicitud de acceso
          </motion.p>

          <motion.div variants={item} className="w-full">
            <Card className="w-full rounded-3xl bg-white/95 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-medium bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                  Registro
                </CardTitle>
                <p className="text-sm text-black">Introduce tus datos para enviar la solicitud al estudio</p>
              </CardHeader>

              <div className="px-6">
                <div className="h-px bg-gray-200" />
              </div>

              <CardContent className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2 text-black">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  {/* Nickname */}
                  <div className="space-y-2 text-black">
                    <Label>Nickname</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
                      <Input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        type="text"
                        placeholder="Tu nombre de usuario"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>

                  {/* Estudio (select) */}
                  <div className="space-y-2 text-black">
                    <Label>Estudio al que quieres enviar solicitud</Label>
                    <select
                      value={estudio}
                      onChange={(e) => setEstudio(e.target.value)}
                      className="block w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 bg-white h-11"
                    >
                      <option value="">Selecciona un estudio...</option>
                      <option value="estudio-a">Estudio A</option>
                      <option value="estudio-b">Estudio B</option>
                      <option value="estudio-c">Estudio C</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div className="space-y-2 text-black">
                    <Label>Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11"
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

                  {/* Error */}
                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                  {/* Success */}
                  {success && <p className="text-sm text-green-600 text-center">Solicitud enviada correctamente. El estudio revisará tu petición.</p>}

                  {/* Submit */}
                  <div>
                    <Button
                      type="submit"
                      disabled={loading}
                      onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect()
                        setPos({
                          x: ((e.clientX - r.left) / r.width) * 100,
                          y: ((e.clientY - r.top) / r.height) * 100,
                        })
                      }}
                      className="w-full h-10 rounded-full text-white shadow-lg text-sm sm:text-base"
                      style={{
                        background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, #a855f7, #6366f1, #f97316)`,
                      }}
                    >
                      {loading ? "Enviando..." : "Enviar solicitud"}
                    </Button>
                  </div>
                </form>

                {/* small note */}
                <p className="text-xs text-gray-500 text-center">
                  Tu solicitud será revisada por el estudio. Te notificaremos por correo.
                </p>

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
