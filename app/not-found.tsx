import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe o ha sido movida.",
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="max-w-md text-center">
        <div className="mb-4 text-8xl font-bold bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
          Página no encontrada
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Por favor, verifica la URL o regresa al inicio.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-orange-400 to-purple-600 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Volver al inicio
          </Link>
          <Link
            href="/dashboard/home"
            className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
