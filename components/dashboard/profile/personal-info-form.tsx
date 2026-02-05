"use client"

import { useState } from "react"
import { UserPen, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

/* ===== Types ===== */
interface PersonalInfoFormProps {
  initialData: {
    fullName: string
    email: string
    studio: string
    bio: string
  }
  onSave?: (data: PersonalInfoFormProps["initialData"]) => void
  onCancel?: () => void
}

/* ===== Personal Info Form Component ===== */
export function PersonalInfoForm({
  initialData,
  onSave,
  onCancel,
}: PersonalInfoFormProps) {
  const [formData, setFormData] = useState(initialData)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
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
          onClick={onCancel}
          className="text-xs font-bold text-slate-400 hover:text-white uppercase transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-xs font-bold text-slate-400 uppercase tracking-wide"
            >
              Nombre Completo
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Email */}
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
              onChange={handleChange}
              className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Studio */}
        <div className="space-y-2">
          <Label
            htmlFor="studio"
            className="text-xs font-bold text-slate-400 uppercase tracking-wide"
          >
            Afiliación de Estudio
          </Label>
          <div className="relative">
            <Building2 className="absolute left-4 top-3.5 size-5 text-slate-500" />
            <Input
              id="studio"
              name="studio"
              type="text"
              value={formData.studio}
              onChange={handleChange}
              className="w-full bg-bg-dark border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
            className="w-full bg-bg-dark border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm text-slate-300"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            className="gradient-coral-violet text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
