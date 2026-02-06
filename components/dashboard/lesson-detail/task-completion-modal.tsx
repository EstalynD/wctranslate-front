"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  Trophy,
  Zap,
  Flame,
  Star,
  ArrowRight,
  X,
  Award,
  TrendingUp,
} from "lucide-react"
import type { ProgressUpdateResponse } from "@/lib/api/progress.service"

/* ===== Props ===== */
interface TaskCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  response: ProgressUpdateResponse | null
  /** Ruta base del tema: /dashboard/library/[slug]/[themeId] */
  basePath: string
  /** ID de la siguiente lección si existe */
  nextLessonId?: string
  /** Si se completó el tema entero */
  themeCompleted?: boolean
  /** Si se completó el curso entero */
  courseCompleted?: boolean
}

/* ===== Constantes ===== */
const AUTO_REDIRECT_SECONDS = 5

/* ===== Animaciones ===== */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 350 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.35 },
  }),
}

/* ===== Componente ===== */
export function TaskCompletionModal({
  isOpen,
  onClose,
  response,
  basePath,
  nextLessonId,
  themeCompleted,
  courseCompleted,
}: TaskCompletionModalProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS)

  // Determinar destino de navegación
  const getNextRoute = useCallback(() => {
    if (courseCompleted) return basePath.split("/").slice(0, -1).join("/") // ir al listado de cursos
    if (nextLessonId) return `${basePath}/${nextLessonId}`
    return basePath // volver al listado de tareas del tema
  }, [basePath, nextLessonId, courseCompleted])

  const handleNavigate = useCallback(() => {
    onClose()
    router.push(getNextRoute())
  }, [onClose, router, getNextRoute])

  // Auto-redirect countdown
  useEffect(() => {
    if (!isOpen) {
      setCountdown(AUTO_REDIRECT_SECONDS)
      return
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleNavigate()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, handleNavigate])

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  if (!response) return null

  const rewards = response.rewards
  const dailyProgress = response.dailyProgress

  // Título dinámico según logro
  const title = courseCompleted
    ? "Curso completado"
    : themeCompleted
      ? "Lección completada"
      : "Tarea completada"

  const subtitle = courseCompleted
    ? "Has terminado todas las lecciones de este curso"
    : themeCompleted
      ? "Has completado todas las tareas de esta lección"
      : "Sigue avanzando en tu entrenamiento"

  // Texto del botón
  const buttonText = courseCompleted
    ? "Ir al listado"
    : nextLessonId
      ? "Siguiente tarea"
      : "Volver a la lección"

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1a183a] to-[#12102a] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 size-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-10"
            >
              <X className="size-4 text-slate-400" />
            </button>

            {/* Glow superior decorativo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/20 blur-[80px] pointer-events-none" />

            {/* Contenido */}
            <div className="relative px-6 pt-8 pb-6">
              {/* Icono principal */}
              <motion.div
                className="flex justify-center mb-5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  delay: 0.1,
                }}
              >
                <div
                  className={`size-20 rounded-full flex items-center justify-center ${
                    courseCompleted
                      ? "bg-gradient-to-br from-yellow-400/20 to-amber-500/20 ring-2 ring-yellow-400/30"
                      : themeCompleted
                        ? "bg-gradient-to-br from-purple-400/20 to-pink-500/20 ring-2 ring-purple-400/30"
                        : "bg-gradient-to-br from-emerald-400/20 to-teal-500/20 ring-2 ring-emerald-400/30"
                  }`}
                >
                  {courseCompleted ? (
                    <Trophy className="size-10 text-yellow-400" />
                  ) : themeCompleted ? (
                    <Award className="size-10 text-purple-400" />
                  ) : (
                    <CheckCircle className="size-10 text-emerald-400" />
                  )}
                </div>
              </motion.div>

              {/* Título */}
              <motion.div
                className="text-center mb-6"
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-2xl font-black text-white mb-1">
                  {title}
                </h2>
                <p className="text-sm text-slate-400">{subtitle}</p>
              </motion.div>

              {/* Rewards */}
              {rewards && (
                <motion.div
                  className="grid grid-cols-2 gap-3 mb-5"
                  custom={1}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* XP */}
                  <div className="flex items-center gap-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
                    <div className="size-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp className="size-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-blue-400">
                        +{rewards.xpEarned}
                      </p>
                      <p className="text-[11px] text-blue-300/60 font-medium uppercase tracking-wider">
                        XP
                      </p>
                    </div>
                  </div>

                  {/* Tokens */}
                  <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
                    <div className="size-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Zap className="size-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-amber-400">
                        +{rewards.tokensEarned}
                      </p>
                      <p className="text-[11px] text-amber-300/60 font-medium uppercase tracking-wider">
                        Tokens
                      </p>
                    </div>
                  </div>

                  {/* Bonos extra */}
                  {(rewards.themeBonus ?? 0) > 0 && (
                    <div className="flex items-center gap-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 px-4 py-3">
                      <div className="size-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Star className="size-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-purple-400">
                          +{rewards.themeBonus}
                        </p>
                        <p className="text-[11px] text-purple-300/60 font-medium uppercase tracking-wider">
                          Bono lección
                        </p>
                      </div>
                    </div>
                  )}

                  {(rewards.courseBonus ?? 0) > 0 && (
                    <div className="flex items-center gap-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-3">
                      <div className="size-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Trophy className="size-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-yellow-400">
                          +{rewards.courseBonus}
                        </p>
                        <p className="text-[11px] text-yellow-300/60 font-medium uppercase tracking-wider">
                          Bono curso
                        </p>
                      </div>
                    </div>
                  )}

                  {(rewards.streakBonus ?? 0) > 0 && (
                    <div className="flex items-center gap-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-4 py-3">
                      <div className="size-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <Flame className="size-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-orange-400">
                          +{rewards.streakBonus}
                        </p>
                        <p className="text-[11px] text-orange-300/60 font-medium uppercase tracking-wider">
                          Bono racha
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Level up */}
                  {rewards.leveledUp && (
                    <div className="col-span-2 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 px-4 py-3">
                      <Star className="size-6 text-yellow-400" />
                      <p className="text-base font-black text-yellow-400">
                        Subiste al nivel {rewards.newLevel}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Progreso diario */}
              {dailyProgress && (
                <motion.div
                  className="mb-6"
                  custom={2}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Tareas de hoy</span>
                    <span>
                      {dailyProgress.tasksCompletedToday}/{dailyProgress.maxDailyTasks}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (dailyProgress.tasksCompletedToday /
                            dailyProgress.maxDailyTasks) *
                            100,
                          100
                        )}%`,
                      }}
                      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  {dailyProgress.tasksRemaining > 0 && (
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Te {dailyProgress.tasksRemaining === 1 ? "queda" : "quedan"}{" "}
                      {dailyProgress.tasksRemaining} tarea
                      {dailyProgress.tasksRemaining > 1 ? "s" : ""} disponible
                      {dailyProgress.tasksRemaining > 1 ? "s" : ""} hoy
                    </p>
                  )}
                  {dailyProgress.tasksRemaining === 0 && (
                    <p className="text-[11px] text-amber-400/80 mt-1.5">
                      Completaste todas las tareas de hoy. Vuelve mañana.
                    </p>
                  )}
                </motion.div>
              )}

              {/* Barras de progreso: tema y curso */}
              {response && (
                <motion.div
                  className="space-y-3 mb-6"
                  custom={3}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span>Progreso de la lección</span>
                      <span>{response.themeProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${response.themeProgress}%` }}
                        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span>Progreso del curso</span>
                      <span>{response.courseProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${response.courseProgress}%` }}
                        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Botón de acción */}
              <motion.button
                onClick={handleNavigate}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-[0.98] transition-all"
                custom={4}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {buttonText}
                <ArrowRight className="size-4" />
              </motion.button>

              {/* Countdown */}
              <motion.p
                className="text-center text-[11px] text-slate-500 mt-3"
                custom={5}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                Redirigiendo en {countdown}s...
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
