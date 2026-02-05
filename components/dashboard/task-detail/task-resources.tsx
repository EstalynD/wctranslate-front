"use client"

import { FolderOpen, FileText, PlayCircle, Download, Eye, File } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
export type ResourceType = "pdf" | "video" | "image" | "document" | "other"

export interface Resource {
  id: string
  name: string
  type: ResourceType
  size: string
  url: string
}

interface TaskResourcesProps {
  resources: Resource[]
  className?: string
}

interface ResourceCardProps {
  resource: Resource
}

/* ===== Icon & Color Mapping ===== */
const resourceConfig: Record<
  ResourceType,
  { icon: React.ElementType; bgColor: string; textColor: string; action: React.ElementType }
> = {
  pdf: {
    icon: FileText,
    bgColor: "bg-red-500/10",
    textColor: "text-red-500",
    action: Download,
  },
  video: {
    icon: PlayCircle,
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
    action: Eye,
  },
  image: {
    icon: File,
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500",
    action: Eye,
  },
  document: {
    icon: FileText,
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-500",
    action: Download,
  },
  other: {
    icon: File,
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-500",
    action: Download,
  },
}

/* ===== Resource Card Component ===== */
function ResourceCard({ resource }: ResourceCardProps) {
  const config = resourceConfig[resource.type]
  const Icon = config.icon
  const ActionIcon = config.action

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center p-4 rounded-xl bg-[var(--surface)] border border-white/5 hover:border-primary/50 transition-all"
    >
      {/* Icon */}
      <div
        className={cn(
          "size-12 rounded-lg flex items-center justify-center mr-4",
          config.bgColor
        )}
      >
        <Icon className={cn("size-6", config.textColor)} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{resource.name}</p>
        <p className="text-xs text-slate-500">
          {resource.size} • {resource.type.toUpperCase()}
        </p>
      </div>

      {/* Action Icon */}
      <ActionIcon className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
    </a>
  )
}

/* ===== Task Resources Component ===== */
export function TaskResources({ resources, className }: TaskResourcesProps) {
  if (resources.length === 0) return null

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-bold flex items-center gap-2">
        <FolderOpen className="size-5 text-primary" />
        Recursos del Tema
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}
