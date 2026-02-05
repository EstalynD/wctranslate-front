"use client"

import { cn } from "@/lib/utils"
import { Play, Code, FileText, Image as ImageIcon, HelpCircle } from "lucide-react"

/* ===== Types ===== */
export enum BlockType {
  TEXT = "TEXT",           // HTML del editor de texto rico
  VIDEO = "VIDEO",         // Reproductor de video (YouTube/Vimeo/Bunny)
  IFRAME = "IFRAME",       // HTML externo (juegos, SCORM, quizzes interactivos)
  FILE = "FILE",           // Archivo descargable (PDF, ZIP)
  QUIZ = "QUIZ",           // Quiz incrustado
  CODE = "CODE",           // Bloque de código
  IMAGE = "IMAGE",         // Imagen con caption
}

export interface ContentBlockSettings {
  autoPlay?: boolean
  allowFullScreen?: boolean
  height?: string
  language?: string      // Para CODE (ej: 'javascript')
  caption?: string       // Para IMAGE
  fileName?: string      // Para FILE
  fileSize?: string      // Para FILE
}

export interface ContentBlock {
  type: BlockType
  order: number
  content?: string         // Para TEXT, CODE
  mediaUrl?: string        // Para VIDEO, FILE, IMAGE
  iframeSrc?: string       // Para IFRAME
  settings?: ContentBlockSettings
}

interface ContentBlockRendererProps {
  blocks: ContentBlock[]
  className?: string
}

/* ===== Individual Block Components ===== */

// 📝 Text Block (HTML Rico)
function TextBlock({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// 🎬 Video Block
function VideoBlock({ mediaUrl, settings }: { mediaUrl: string; settings?: ContentBlockSettings }) {
  // Detectar si es YouTube, Vimeo o video directo
  const isYouTube = mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")
  const isVimeo = mediaUrl.includes("vimeo.com")

  if (isYouTube || isVimeo) {
    const embedUrl = isYouTube
      ? mediaUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
      : mediaUrl.replace("vimeo.com/", "player.vimeo.com/video/")

    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={settings?.allowFullScreen ?? true}
        />
      </div>
    )
  }

  // Video directo
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50">
      <video
        src={mediaUrl}
        className="w-full h-full object-contain"
        controls
        autoPlay={settings?.autoPlay}
      />
    </div>
  )
}

// 🖼️ Iframe Block (HTML Externo / Juegos / Quizzes Interactivos)
function IframeBlock({ iframeSrc, settings }: { iframeSrc: string; settings?: ContentBlockSettings }) {
  return (
    <div
      className="relative -mx-4 sm:-mx-6 md:mx-0 md:rounded-2xl overflow-hidden border-y md:border border-white/10 bg-white"
      style={{ height: settings?.height || "600px" }}
    >
      <iframe
        src={iframeSrc}
        className="absolute inset-0 w-full h-full"
        allowFullScreen={settings?.allowFullScreen ?? true}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  )
}

// 🖼️ Image Block
function ImageBlock({ mediaUrl, settings }: { mediaUrl: string; settings?: ContentBlockSettings }) {
  return (
    <figure className="my-8">
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={mediaUrl}
          alt={settings?.caption || "Imagen de la lección"}
          className="w-full h-auto object-cover"
        />
      </div>
      {settings?.caption && (
        <figcaption className="text-center text-sm text-slate-400 mt-3">
          {settings.caption}
        </figcaption>
      )}
    </figure>
  )
}

// 💻 Code Block
function CodeBlock({ content, settings }: { content: string; settings?: ContentBlockSettings }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1e1e2e] border border-white/10">
      {settings?.language && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/10 rounded text-xs text-slate-400">
          {settings.language}
        </div>
      )}
      <pre className="p-6 overflow-x-auto">
        <code className="text-sm text-slate-200 font-mono">{content}</code>
      </pre>
    </div>
  )
}

// 📄 File Block (Descargable)
function FileBlock({ mediaUrl, settings }: { mediaUrl: string; settings?: ContentBlockSettings }) {
  return (
    <a
      href={mediaUrl}
      download
      className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--surface)] border border-white/10 hover:border-primary/50 transition-all group"
    >
      <div className="size-14 rounded-xl bg-red-500/10 flex items-center justify-center">
        <FileText className="size-7 text-red-500" />
      </div>
      <div className="flex-1">
        <p className="font-bold">{settings?.fileName || "Archivo descargable"}</p>
        <p className="text-sm text-slate-400">{settings?.fileSize || "Descargar"}</p>
      </div>
      <span className="px-4 py-2 rounded-lg bg-white/5 text-sm font-medium group-hover:bg-primary group-hover:text-white transition-all">
        Descargar
      </span>
    </a>
  )
}

/* ===== Main Renderer Component ===== */
export function ContentBlockRenderer({ blocks, className }: ContentBlockRendererProps) {
  // Ordenar bloques por order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order)

  return (
    <div className={cn("space-y-8", className)}>
      {sortedBlocks.map((block, index) => (
        <div key={`block-${index}-${block.type}`} className="content-block">
          {block.type === BlockType.TEXT && block.content && (
            <TextBlock content={block.content} />
          )}

          {block.type === BlockType.VIDEO && block.mediaUrl && (
            <VideoBlock mediaUrl={block.mediaUrl} settings={block.settings} />
          )}

          {block.type === BlockType.IFRAME && block.iframeSrc && (
            <IframeBlock iframeSrc={block.iframeSrc} settings={block.settings} />
          )}

          {block.type === BlockType.IMAGE && block.mediaUrl && (
            <ImageBlock mediaUrl={block.mediaUrl} settings={block.settings} />
          )}

          {block.type === BlockType.CODE && block.content && (
            <CodeBlock content={block.content} settings={block.settings} />
          )}

          {block.type === BlockType.FILE && block.mediaUrl && (
            <FileBlock mediaUrl={block.mediaUrl} settings={block.settings} />
          )}
        </div>
      ))}
    </div>
  )
}
