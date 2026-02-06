"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Clock, ChevronLeft, ChevronRight, Check, AlertCircle, Loader2, Trophy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { quizService } from "@/lib/api"
import { QuestionType } from "@/lib/types/quiz.types"
import type {
  QuizForStudent,
  QuizQuestion,
  StartAttemptResponse,
  SubmitAttemptResponse,
  SubmitAnswerDto,
} from "@/lib/types/quiz.types"

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  quizId: string
  quizType: "pre" | "post"
  onComplete: (passed: boolean) => void
}

type QuizState = "loading" | "intro" | "questions" | "submitting" | "results" | "error"

interface UserAnswer {
  questionId: string
  selectedOptionIds?: string[]
  textAnswer?: string
  startTime: number
}

export function QuizModal({ isOpen, onClose, quizId, quizType, onComplete }: QuizModalProps) {
  // Estado principal
  const [state, setState] = useState<QuizState>("loading")
  const [error, setError] = useState<string | null>(null)

  // Datos del quiz
  const [attemptData, setAttemptData] = useState<StartAttemptResponse | null>(null)
  const [quiz, setQuiz] = useState<QuizForStudent | null>(null)

  // Estado de respuestas
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map())
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

  // Timer
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Resultados
  const [results, setResults] = useState<SubmitAttemptResponse | null>(null)

  // Cargar quiz al abrir
  useEffect(() => {
    if (isOpen && quizId) {
      loadQuiz()
    }
    return () => {
      // Limpiar estado al cerrar
      if (!isOpen) {
        setState("loading")
        setAttemptData(null)
        setQuiz(null)
        setAnswers(new Map())
        setCurrentQuestionIndex(0)
        setResults(null)
        setError(null)
      }
    }
  }, [isOpen, quizId])

  // Timer countdown
  useEffect(() => {
    if (state !== "questions" || !timeRemaining) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval)
          handleSubmit() // Auto-submit cuando se acaba el tiempo
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state, timeRemaining])

  const loadQuiz = async () => {
    try {
      setState("loading")
      setError(null)

      // Verificar si puede iniciar
      const canStart = await quizService.canStartAttempt(quizId)

      if (!canStart.canStart) {
        setError(canStart.reason || "No puedes iniciar este quiz en este momento")
        setState("error")
        return
      }

      // Obtener quiz para mostrar intro
      const quizData = await quizService.getQuizForStudent(quizId)
      setQuiz(quizData)
      setState("intro")
    } catch (err) {
      console.error("Error cargando quiz:", err)
      setError("No se pudo cargar el quiz. Intenta de nuevo.")
      setState("error")
    }
  }

  const startQuiz = async () => {
    try {
      setState("loading")

      const data = await quizService.startAttempt(quizId)
      setAttemptData(data)
      setQuiz(data.quiz)

      // Configurar timer si hay límite de tiempo
      if (data.quiz.settings.timeLimit) {
        setTimeRemaining(data.quiz.settings.timeLimit * 60)
      }

      setQuestionStartTime(Date.now())
      setState("questions")
    } catch (err) {
      console.error("Error iniciando quiz:", err)
      setError("No se pudo iniciar el quiz. Intenta de nuevo.")
      setState("error")
    }
  }

  const handleAnswerSelect = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev)
      const currentAnswer = newAnswers.get(questionId)
      const question = quiz?.questions.find((q) => q.id === questionId)

      if (question?.type === QuestionType.MULTIPLE_ANSWER) {
        // Múltiples respuestas
        const current = currentAnswer?.selectedOptionIds || []
        const updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]

        newAnswers.set(questionId, {
          questionId,
          selectedOptionIds: updated,
          startTime: currentAnswer?.startTime || questionStartTime,
        })
      } else {
        // Una sola respuesta
        newAnswers.set(questionId, {
          questionId,
          selectedOptionIds: [optionId],
          startTime: currentAnswer?.startTime || questionStartTime,
        })
      }

      return newAnswers
    })
  }, [quiz, questionStartTime])

  const handleTextAnswer = useCallback((questionId: string, text: string) => {
    setAnswers((prev) => {
      const newAnswers = new Map(prev)
      const currentAnswer = newAnswers.get(questionId)

      newAnswers.set(questionId, {
        questionId,
        textAnswer: text,
        startTime: currentAnswer?.startTime || questionStartTime,
      })

      return newAnswers
    })
  }, [questionStartTime])

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (quiz?.questions.length || 0)) {
      setCurrentQuestionIndex(index)
      setQuestionStartTime(Date.now())
    }
  }

  const handleSubmit = async () => {
    if (!attemptData || !quiz) return

    try {
      setState("submitting")

      // Preparar respuestas
      const submissionAnswers: SubmitAnswerDto[] = quiz.questions.map((q) => {
        const answer = answers.get(q.id)
        const timeSpent = answer
          ? Math.round((Date.now() - answer.startTime) / 1000)
          : 0

        return {
          questionId: q.id,
          selectedOptionIds: answer?.selectedOptionIds || [],
          textAnswer: answer?.textAnswer,
          timeSpentSeconds: timeSpent,
        }
      })

      const result = await quizService.submitAttempt(attemptData.attemptId, {
        answers: submissionAnswers,
      })

      setResults(result)
      setState("results")
    } catch (err) {
      console.error("Error enviando quiz:", err)
      setError("No se pudo enviar el quiz. Intenta de nuevo.")
      setState("error")
    }
  }

  const handleClose = () => {
    if (results) {
      onComplete(results.passed)
    }
    onClose()
  }

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  const currentQuestion = quiz?.questions[currentQuestionIndex]
  const totalQuestions = quiz?.questions.length || 0
  const answeredCount = answers.size
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={state === "results" ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-[#15132d] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">
              {quizType === "pre" ? "Quiz de Entrada" : "Quiz de Evaluación"}
            </h2>
            {quiz && state === "questions" && (
              <p className="text-sm text-slate-400">
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            {timeRemaining !== null && state === "questions" && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
                timeRemaining <= 60 ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"
              )}>
                <Clock className="size-4" />
                {formatTime(timeRemaining)}
              </div>
            )}

            {/* Close button (solo en intro, results o error) */}
            {(state === "intro" || state === "results" || state === "error") && (
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="size-5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading */}
          {state === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="size-10 text-primary animate-spin mb-4" />
              <p className="text-slate-400">Cargando quiz...</p>
            </div>
          )}

          {/* Error */}
          {state === "error" && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="size-8 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Error</h3>
              <p className="text-slate-400 mb-6 max-w-md">{error}</p>
              <button
                onClick={loadQuiz}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
              >
                <RefreshCw className="size-4" />
                Reintentar
              </button>
            </div>
          )}

          {/* Intro */}
          {state === "intro" && quiz && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{quiz.title}</h3>
                {quiz.description && (
                  <p className="text-slate-400">{quiz.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Preguntas</p>
                  <p className="text-2xl font-bold text-white">{quiz.questionsCount}</p>
                </div>
                {quiz.settings.timeLimit && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-400 mb-1">Tiempo límite</p>
                    <p className="text-2xl font-bold text-white">{quiz.settings.timeLimit} min</p>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Para aprobar</p>
                  <p className="text-2xl font-bold text-white">{quiz.settings.passingScore}%</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-slate-400 mb-1">Puntos totales</p>
                  <p className="text-2xl font-bold text-white">{quiz.totalPoints}</p>
                </div>
              </div>

              {quiz.instructions && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm text-amber-200">{quiz.instructions}</p>
                </div>
              )}

              <button
                onClick={startQuiz}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                Comenzar Quiz
              </button>
            </div>
          )}

          {/* Questions */}
          {state === "questions" && currentQuestion && (
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="flex gap-1">
                {quiz?.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => quiz.settings.allowBackNavigation && goToQuestion(idx)}
                    className={cn(
                      "flex-1 h-2 rounded-full transition-all",
                      idx === currentQuestionIndex
                        ? "bg-primary"
                        : answers.has(quiz.questions[idx].id)
                          ? "bg-emerald-500"
                          : "bg-white/20",
                      quiz.settings.allowBackNavigation && "cursor-pointer hover:opacity-80"
                    )}
                  />
                ))}
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{currentQuestion.question}</h3>

                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Imagen de la pregunta"
                    className="w-full max-h-64 object-contain rounded-xl"
                  />
                )}

                {/* Options */}
                {(currentQuestion.type === QuestionType.MULTIPLE_CHOICE ||
                  currentQuestion.type === QuestionType.MULTIPLE_ANSWER ||
                  currentQuestion.type === QuestionType.TRUE_FALSE) && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => {
                      const isSelected = currentAnswer?.selectedOptionIds?.includes(option.id)
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                          className={cn(
                            "w-full p-4 rounded-xl border text-left transition-all",
                            isSelected
                              ? "bg-primary/20 border-primary text-white"
                              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "size-6 rounded-full border-2 flex items-center justify-center shrink-0",
                              isSelected ? "border-primary bg-primary" : "border-white/30"
                            )}>
                              {isSelected && <Check className="size-4 text-white" />}
                            </div>
                            <span>{option.text}</span>
                          </div>
                        </button>
                      )
                    })}
                    {currentQuestion.type === QuestionType.MULTIPLE_ANSWER && (
                      <p className="text-xs text-slate-500">Puedes seleccionar múltiples opciones</p>
                    )}
                  </div>
                )}

                {/* Text answer */}
                {currentQuestion.type === QuestionType.TEXT && (
                  <textarea
                    value={currentAnswer?.textAnswer || ""}
                    onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary resize-none"
                  />
                )}
              </div>
            </div>
          )}

          {/* Submitting */}
          {state === "submitting" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="size-10 text-primary animate-spin mb-4" />
              <p className="text-slate-400">Enviando respuestas...</p>
            </div>
          )}

          {/* Results */}
          {state === "results" && results && (
            <div className="space-y-6 text-center">
              <div className={cn(
                "size-20 rounded-full flex items-center justify-center mx-auto",
                results.passed ? "bg-emerald-500/20" : "bg-amber-500/20"
              )}>
                <Trophy className={cn(
                  "size-10",
                  results.passed ? "text-emerald-400" : "text-amber-400"
                )} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {results.passed ? "¡Felicitaciones!" : "Sigue practicando"}
                </h3>
                <p className="text-slate-400">
                  {results.feedback?.message || (results.passed
                    ? "Has completado el quiz exitosamente"
                    : "No alcanzaste el puntaje mínimo requerido"
                  )}
                </p>
              </div>

              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <p className={cn(
                    "text-4xl font-black",
                    results.passed ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {results.percentage}%
                  </p>
                  <p className="text-sm text-slate-400">Puntuación</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-white">
                    {results.summary.correctAnswers}/{results.summary.totalQuestions}
                  </p>
                  <p className="text-sm text-slate-400">Correctas</p>
                </div>
              </div>

              {results.rewards && results.rewards.tokensEarned > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30">
                  <p className="text-sm text-slate-300">Has ganado</p>
                  <p className="text-2xl font-bold text-white">
                    +{results.rewards.tokensEarned} tokens
                  </p>
                </div>
              )}

              <button
                onClick={handleClose}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                {results.passed ? "Continuar" : "Cerrar"}
              </button>

              {!results.passed && results.retryInfo.canRetry && (
                <button
                  onClick={() => {
                    setResults(null)
                    setAnswers(new Map())
                    setCurrentQuestionIndex(0)
                    loadQuiz()
                  }}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
                >
                  Intentar de nuevo
                  {results.retryInfo.attemptsRemaining !== null && (
                    <span className="text-slate-400 ml-2">
                      ({results.retryInfo.attemptsRemaining} intentos restantes)
                    </span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer - Navigation (solo en questions) */}
        {state === "questions" && quiz && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <button
              onClick={() => goToQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0 || !quiz.settings.allowBackNavigation}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="size-4" />
              Anterior
            </button>

            <span className="text-sm text-slate-400">
              {answeredCount} de {totalQuestions} respondidas
            </span>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => goToQuestion(currentQuestionIndex + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all"
              >
                Siguiente
                <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < totalQuestions && !quiz.settings.allowSkip}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Check className="size-4" />
                Enviar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
