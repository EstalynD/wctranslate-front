"use client"

import { Search, PlayCircle, Lock } from "lucide-react"
import { useState, useMemo } from "react"

const categories = ["Todos", "Marketing", "Técnico", "Psicología", "Legal", "Styling"]

const categoryColors = {
  "Marketing": "bg-pink-500/80",
  "Técnico": "bg-purple-500/80",
  "Psicología": "bg-cyan-500/80",
  "Legal": "bg-yellow-500/80",
  "Styling": "bg-orange-500/80",
}

const levelColors = {
  "Básico": "bg-green-500/80 text-white",
  "Intermedio": "bg-blue-500/80 text-white",
  "Avanzado": "bg-red-500/80 text-white",
}

const modules = [
  {
    id: 1,
    title: "Psicología de la Audiencia",
    description: "Engagement, retención y conexión emocional",
    level: "Avanzado",
    category: "Psicología",
    image: "/psi.png",
    progress: 72,
    locked: false,
  },
  {
    id: 2,
    title: "Retención de usuarios",
    description: "Aprende a mantener a tu audiencia cautiva",
    level: "Intermedio",
    category: "Marketing",
    image: "/ret.png",
    progress: 40,
    locked: false,
  },
  {
    id: 3,
    title: "Configuración de transmisiones",
    description: "Setup profesional para streams",
    level: "Básico",
    category: "Técnico",
    image: "/confg.png",
    progress: 0,
    locked: false,
  },
  {
    id: 4,
    title: "Lenguaje seductor",
    description: "Comunicación persuasiva en vivo",
    level: "Intermedio",
    category: "Legal",
    image: "/leng.png",
    progress: 0,
    locked: true,
  },
]

export default function LibraryPage() {
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState("Todos")
  const [activeCategory, setActiveCategory] = useState("Todos")

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchCategory =
        activeCategory === "Todos" || m.category === activeCategory

      const matchLevel =
        levelFilter === "Todos" || m.level === levelFilter

      const matchSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())

      return matchCategory && matchLevel && matchSearch
    })
  }, [search, levelFilter, activeCategory])

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca de módulos</h1>
          <p className="text-white/50">
            Explora todos los módulos disponibles para tu formación.
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar módulo..."
              className="rounded-xl bg-white/5 pl-9 pr-4 py-2 text-sm outline-none border border-white/10 focus:border-orange-400"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm border border-white/10 focus:border-orange-400 outline-none"
          >
            <option>Todos</option>
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              activeCategory === cat
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredModules.map((m) => (
          <div
            key={m.id}
            className="group relative overflow-hidden rounded-3xl bg-[#15132d] shadow-lg"
          >
            <div className="relative h-48 w-full overflow-hidden">
                <img
                src={m.image}
                alt={m.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40" />
            
            {/* Badges */}
            
              <span className={"absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs backdrop-blur " + (categoryColors[m.category] || "bg-black/50")}>
                {m.category}
              </span>

              <span className={"absolute bottom-4 right-4 rounded-full px-3 py-1 text-xs " + (levelColors[m.level] || "bg-orange-500/80")}>
                {m.level}
              </span>
            </div>
            {/* Content */}
            <div className="relative p-6 space-y-3">
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className="text-sm text-white/60">{m.description}</p>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Progreso</span>
                  <span>{m.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              <button
                disabled={m.locked}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition ${
                  m.locked
                    ? "bg-white/5 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-400 to-pink-500 hover:opacity-90"
                }`}
              >
                {m.locked ? (
                  <>
                    <Lock className="w-4 h-4" /> Bloqueado
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" /> Ver módulo
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
