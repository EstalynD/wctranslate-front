"use client"

import { useState, useCallback } from "react"
import { Upload, X, CheckCircle, Send, CloudUpload } from "lucide-react"
import { cn } from "@/lib/utils"

/* ===== Types ===== */
interface UploadedFile {
  id: string
  name: string
  size: string
  status: "uploading" | "ready" | "error"
}

interface TaskSubmissionProps {
  onSubmit?: (files: UploadedFile[], comment: string) => void
  maxFileSize?: string
  acceptedFormats?: string[]
  className?: string
}

/* ===== File Item Component ===== */
function FileItem({
  file,
  onRemove,
}: {
  file: UploadedFile
  onRemove: (id: string) => void
}) {
  const statusStyles = {
    uploading: "bg-amber-500/10 border-amber-500/20",
    ready: "bg-emerald-500/10 border-emerald-500/20",
    error: "bg-red-500/10 border-red-500/20",
  }

  const statusColors = {
    uploading: "text-amber-500",
    ready: "text-emerald-500",
    error: "text-red-500",
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        statusStyles[file.status]
      )}
    >
      <CheckCircle className={cn("size-5", statusColors[file.status])} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs font-bold truncate", statusColors[file.status])}>
          {file.name}
        </p>
        <p className={cn("text-[10px] opacity-70", statusColors[file.status])}>
          {file.status === "ready" ? "Listo para enviar" : file.status === "uploading" ? "Subiendo..." : "Error al subir"}
        </p>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="text-slate-400 hover:text-red-500 transition-colors"
        aria-label="Eliminar archivo"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

/* ===== Drop Zone Component ===== */
function DropZone({
  onFilesSelected,
  maxFileSize,
  acceptedFormats,
}: {
  onFilesSelected: (files: FileList) => void
  maxFileSize: string
  acceptedFormats: string[]
}) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files)
      }
    },
    [onFilesSelected]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected(e.target.files)
      }
    },
    [onFilesSelected]
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group",
        isDragging
          ? "border-primary bg-primary/10"
          : "border-white/10 hover:border-primary/50 hover:bg-primary/5"
      )}
    >
      <div
        className={cn(
          "size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 transition-transform",
          isDragging ? "scale-110" : "group-hover:scale-110"
        )}
      >
        <Upload
          className={cn(
            "size-8 transition-colors",
            isDragging ? "text-primary" : "text-slate-400 group-hover:text-primary"
          )}
        />
      </div>
      <p className="font-medium text-sm mb-1">Arrastra tus archivos aquí</p>
      <p className="text-xs text-slate-500">
        Formatos: {acceptedFormats.join(", ")} (Máx {maxFileSize})
      </p>
      <label className="mt-4 inline-block">
        <span className="px-4 py-2 text-xs font-bold border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          Seleccionar Archivo
        </span>
        <input
          type="file"
          className="hidden"
          multiple
          onChange={handleFileInput}
          accept={acceptedFormats.map((f) => `.${f.toLowerCase()}`).join(",")}
        />
      </label>
    </div>
  )
}

/* ===== Task Submission Component ===== */
export function TaskSubmission({
  onSubmit,
  maxFileSize = "50MB",
  acceptedFormats = ["JPG", "PNG", "MP4"],
  className,
}: TaskSubmissionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [comment, setComment] = useState("")

  const handleFilesSelected = useCallback((files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      status: "ready" as const,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleRemoveFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(uploadedFiles, comment)
    }
  }, [onSubmit, uploadedFiles, comment])

  const canSubmit = uploadedFiles.some((f) => f.status === "ready")

  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-[var(--surface)] border border-white/5 shadow-2xl relative overflow-hidden",
        className
      )}
    >
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-1 h-full gradient-coral-violet" />

      {/* Header */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <CloudUpload className="size-5 text-primary" />
        Tu Entrega
      </h2>

      {/* Drop Zone */}
      <div className="mb-6">
        <DropZone
          onFilesSelected={handleFilesSelected}
          maxFileSize={maxFileSize}
          acceptedFormats={acceptedFormats}
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2 mb-6">
          {uploadedFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onRemove={handleRemoveFile}
            />
          ))}
        </div>
      )}

      {/* Comment Box */}
      <div className="space-y-2 mb-6">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Comentarios Adicionales
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-500 resize-none"
          placeholder="Escribe aquí cualquier nota o respuesta a la tarea..."
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={cn(
          "w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all",
          canSubmit
            ? "gradient-coral-violet text-white shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98]"
            : "bg-white/10 text-slate-500 cursor-not-allowed"
        )}
      >
        <span>Enviar Tarea</span>
        <Send className="size-5" />
      </button>

      {/* Disclaimer */}
      <p className="text-[10px] text-center text-slate-500 mt-4">
        Al enviar, confirmas que esta es tu propia obra.
      </p>
    </div>
  )
}
