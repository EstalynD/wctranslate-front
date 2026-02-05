"use client"

import { useState, useMemo } from "react"
import { Scissors, BookOpen } from "lucide-react"
import {
  SearchBar,
  CategoryFilters,
  LibraryModuleCard,
  type CategoryFilter,
  type LibraryModule,
} from "@/components/dashboard/library"

/* ===== Constants ===== */
const categories: CategoryFilter[] = [
  "Todos",
  "Marketing",
  "Técnico",
  "Psicología",
  "Legal",
  "Styling",
]

/* ===== Mock Data (TODO: Replace with API) ===== */
const modules: LibraryModule[] = [
  {
    id: "mastering-lighting",
    title: "Mastering Lighting",
    description:
      "Aprende técnicas profesionales de iluminación para resaltar tus mejores rasgos y crear atmósferas envolventes.",
    category: "Técnico",
    level: "Avanzado",
    progress: 75,
    image: "/lighting.png",
  },
  {
    id: "social-media-strategy",
    title: "Social Media Strategy",
    description:
      "Cómo construir una marca personal sólida en Twitter e Instagram para atraer tráfico de calidad a tus shows.",
    category: "Marketing",
    level: "Básico",
    progress: 32,
    image: "/social.png",
  },
  {
    id: "psicologia-fan",
    title: "Psicología del Fan",
    description:
      "Entiende los comportamientos y motivaciones de tus usuarios para crear conexiones emocionales duraderas.",
    category: "Psicología",
    level: "Intermedio",
    progress: 0,
  },
  {
    id: "proteccion-legal",
    title: "Protección & Legal",
    description:
      "Todo lo que necesitas saber sobre contratos, DMCA y protección de contenido en plataformas internacionales.",
    category: "Legal",
    level: "Básico",
    progress: 15,
    image: "/legal.png",
  },
  {
    id: "edicion-express",
    title: "Edición Express",
    description:
      "Edita tus mejores clips para redes sociales en menos de 5 minutos usando solo tu smartphone.",
    category: "Técnico",
    level: "Intermedio",
    progress: 0,
    icon: <Scissors className="size-16 text-white/20" />,
  },
  {
    id: "imagen-personaje",
    title: "Imagen & Personaje",
    description:
      "Define tu alter ego y crea un armario cápsula que impacte visualmente en cada una de tus sesiones.",
    category: "Styling",
    level: "Intermedio",
    progress: 0,
    image: "/styling.png",
  },
]

/* ===== Hero Section ===== */
function HeroSection() {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight">
        Biblioteca de <span className="text-gradient">Módulos</span>
      </h2>
      <p className="text-slate-400">
        Potencia tu carrera con contenido especializado y actualizado.
      </p>
    </div>
  )
}

/* ===== Empty State ===== */
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <BookOpen className="size-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">No se encontraron módulos</h3>
      <p className="text-slate-400 max-w-md">
        No hay módulos que coincidan con los filtros seleccionados. Intenta con otros criterios de búsqueda.
      </p>
    </div>
  )
}

/* ===== Main Page ===== */
export default function LibraryPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Todos")

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchCategory =
        activeCategory === "Todos" || module.category === activeCategory

      const matchSearch =
        module.title.toLowerCase().includes(search.toLowerCase()) ||
        module.description.toLowerCase().includes(search.toLowerCase())

      return matchCategory && matchSearch
    })
  }, [search, activeCategory])

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <HeroSection />

        {/* Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar módulos..."
          />
        </div>
      </section>

      {/* Category Filters */}
      <CategoryFilters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        showFiltersButton={true}
        onFiltersClick={() => console.log("Open filters modal")}
      />

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <LibraryModuleCard key={module.id} module={module} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Bottom Spacer */}
      <div className="h-10" />
    </div>
  )
}
