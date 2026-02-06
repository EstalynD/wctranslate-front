"use client"

import { useState, useRef } from "react"
import { Camera, Share2, Diamond, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usersService } from "@/lib/api"

/* ===== Types ===== */
interface ProfileHeaderProps {
  name: string
  email: string
  avatar: string | null
  level: string
  memberSince: string
  onAvatarUploaded?: (avatarUrl: string) => void
  onShareProfile?: () => void
}

/* ===== Profile Header Component ===== */
export function ProfileHeader({
  name,
  level,
  avatar,
  memberSince,
  onAvatarUploaded,
  onShareProfile,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Iniciales del usuario como fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo y tamaño en el cliente
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Solo se permiten imágenes JPEG, PNG, WebP o GIF")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("La imagen no puede superar los 5MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const response = await usersService.uploadAvatar(file)
      onAvatarUploaded?.(response.avatarUrl)
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Error al subir la foto"
      )
    } finally {
      setIsUploading(false)
      // Limpiar el input para poder subir la misma imagen de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <>
      {/* Banner Gradient */}
      <div className="h-64 w-full bg-gradient-to-r from-primary to-accent relative">
        <div
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"
          aria-hidden="true"
        />
      </div>

      {/* Profile Info Section */}
      <div className="px-8 md:px-12 -mt-20 mb-8 flex flex-col md:flex-row items-end gap-8 relative z-10">
        {/* Avatar */}
        <div className="relative group">
          <div className="size-40 rounded-full border-[6px] border-[var(--deep-dark)] p-1 bg-[var(--deep-dark)] shadow-2xl overflow-hidden">
            {avatar ? (
              <Image
                src={avatar}
                alt={`Foto de perfil de ${name}`}
                width={160}
                height={160}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {initials}
                </span>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="size-8 text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="absolute bottom-4 right-2 bg-card-dark text-white p-2.5 rounded-full border border-white/10 shadow-lg hover:bg-primary transition-colors disabled:opacity-50"
            aria-label="Cambiar foto de perfil"
          >
            <Camera className="size-4" />
          </button>
          {/* Input oculto para seleccionar archivo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Name and Level */}
        <div className="mb-4 flex-1">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {name}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-primary text-xs font-bold uppercase tracking-wider">
              <Diamond className="size-3" />
              {level}
            </div>
            <span className="text-slate-400 text-sm">
              Miembro desde {memberSince}
            </span>
          </div>
          {uploadError && (
            <p className="text-red-400 text-xs mt-2">{uploadError}</p>
          )}
        </div>

        {/* Share Button - TODO: Sin lógica de backend aún */}
        {/* <div className="mb-4 hidden md:block">
          <Button
            variant="outline"
            onClick={onShareProfile}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-sm font-bold"
          >
            <Share2 className="size-4 text-primary" />
            Compartir Perfil
          </Button>
        </div> */}
      </div>
    </>
  )
}
