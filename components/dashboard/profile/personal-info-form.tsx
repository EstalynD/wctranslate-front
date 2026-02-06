"use client"

import { useState } from "react"
import { UserPen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { usersService, type UpdateProfileDto } from "@/lib/api/users.service"

/* ===== Types ===== */
interface PersonalInfoFormData {
  firstName: string
  lastName: string
  nickName: string
  email: string
  bio: string
}

interface PersonalInfoFormProps {
  initialData: PersonalInfoFormData
  onSaved?: (updatedData: PersonalInfoFormData) => void
  onCancel?: () => void
}

/* ===== Personal Info Form Component ===== */
export function PersonalInfoForm({
  initialData,
  onSaved,
  onCancel,
}: PersonalInfoFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar mensajes al editar
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const updateData: UpdateProfileDto = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nickName: formData.nickName || undefined,
        bio: formData.bio || undefined,
      }

      await usersService.updateProfile(updateData)
      setSuccess(true)
      onSaved?.(formData)

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al guardar los cambios"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(initialData)
    setError(null)
    setSuccess(false)
    onCancel?.()
  }

  return (
    <div className="bg-card-dark border border-white/5 p-8 rounded-[2rem] shadow-xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <UserPen className="size-5 text-primary" />
          <h3 className="text-xl font-bold">Información Personal</h3>
        </div>
        <button
          onClick={handleCancel}
          className="text-xs font-bold text-slate-400 hover:text-white uppercase transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-xs font-bold text-slate-400 uppercase tracking-wide"
            >
              Nombre
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-xs font-bold text-slate-400 uppercase tracking-wide"
            >
              Apellido
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nick Name */}
          <div className="space-y-2">
            <Label
              htmlFor="nickName"
              className="text-xs font-bold text-slate-400 uppercase tracking-wide"
            >
              Nombre Artístico
            </Label>
            <Input
              id="nickName"
              name="nickName"
              type="text"
              placeholder="Tu nombre en la plataforma"
              value={formData.nickName}
              onChange={handleChange}
              className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Email (solo lectura) */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold text-slate-400 uppercase tracking-wide"
            >
              Correo Electrónico
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-500">
              El email no se puede cambiar
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label
            htmlFor="bio"
            className="text-xs font-bold text-slate-400 uppercase tracking-wide"
          >
            Bio Pública
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="Cuéntanos sobre ti..."
            className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm text-slate-300"
          />
          <p className="text-[10px] text-slate-500 text-right">
            {formData.bio.length}/500
          </p>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        {success && (
          <p className="text-emerald-400 text-sm">
            Cambios guardados exitosamente
          </p>
        )}

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="gradient-coral-violet text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Guardando...
              </span>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
