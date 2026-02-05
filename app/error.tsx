"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AlertCircle className="size-16 text-primary" />
        </div>
        <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
          ¡Algo salió mal!
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo o vuelve al inicio.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-full bg-gradient-to-r from-orange-400 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Volver al inicio
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-zinc-400">
            Código de error: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
