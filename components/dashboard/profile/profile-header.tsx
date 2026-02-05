"use client"

import { Camera, Share2, Diamond } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

/* ===== Types ===== */
interface ProfileHeaderProps {
  name: string
  email: string
  avatar: string
  level: string
  memberSince: string
  onAvatarChange?: () => void
  onShareProfile?: () => void
}

/* ===== Profile Header Component ===== */
export function ProfileHeader({
  name,
  level,
  avatar,
  memberSince,
  onAvatarChange,
  onShareProfile,
}: ProfileHeaderProps) {
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
          <div className="size-40 rounded-full border-[6px] border-[var(--deep-dark)] p-1 bg-[var(--deep-dark)] shadow-2xl">
            <Image
              src={avatar}
              alt={`Foto de perfil de ${name}`}
              width={160}
              height={160}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button
            onClick={onAvatarChange}
            className="absolute bottom-4 right-2 bg-card-dark text-white p-2.5 rounded-full border border-white/10 shadow-lg hover:bg-primary transition-colors"
            aria-label="Cambiar foto de perfil"
          >
            <Camera className="size-4" />
          </button>
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
        </div>

        {/* Share Button */}
        <div className="mb-4 hidden md:block">
          <Button
            variant="outline"
            onClick={onShareProfile}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-sm font-bold"
          >
            <Share2 className="size-4 text-primary" />
            Compartir Perfil
          </Button>
        </div>
      </div>
    </>
  )
}
