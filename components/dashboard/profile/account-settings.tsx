"use client"

import { useState } from "react"
import { Settings2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ===== Types ===== */
interface NotificationPreferences {
  emailAlerts: boolean
  pushNotifications: boolean
  communityMessages: boolean
}

interface AccountSettingsProps {
  notifications: NotificationPreferences
  onPasswordChange?: (currentPassword: string, newPassword: string) => void
  onNotificationsChange?: (notifications: NotificationPreferences) => void
  passwordError?: string | null
  passwordSuccess?: boolean
}

/* ===== Account Settings Component ===== */
export function AccountSettings({
  onPasswordChange,
  passwordError,
  passwordSuccess,
}: AccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChanging, setIsChanging] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handlePasswordUpdate = async () => {
    setLocalError(null)

    if (!currentPassword || !newPassword) {
      setLocalError("Completa ambos campos de contraseña")
      return
    }

    if (newPassword.length < 8) {
      setLocalError("La nueva contraseña debe tener al menos 8 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setLocalError("Las contraseñas no coinciden")
      return
    }

    // Validar que tenga mayúscula, minúscula y número
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setLocalError(
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      )
      return
    }

    setIsChanging(true)
    try {
      await onPasswordChange?.(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } finally {
      setIsChanging(false)
    }
  }

  const displayError = localError || passwordError

  return (
    <div className="bg-card-dark border border-white/5 p-8 rounded-[2rem] shadow-xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <Settings2 className="size-5 text-accent" />
        <h3 className="text-xl font-bold">Configuración de Cuenta</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Security Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white mb-4">Seguridad</h4>

          {/* Current Password */}
          <div className="space-y-2">
            <Label
              htmlFor="currentPassword"
              className="text-[10px] font-bold text-slate-400 uppercase"
            >
              Contraseña Actual
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setLocalError(null)
              }}
              className="w-full bg-bg-dark border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-[10px] font-bold text-slate-400 uppercase"
            >
              Nueva Contraseña
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setLocalError(null)
              }}
              className="w-full bg-bg-dark border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-[10px] font-bold text-slate-400 uppercase"
            >
              Confirmar Nueva Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setLocalError(null)
              }}
              className="w-full bg-bg-dark border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary"
            />
          </div>

          {/* Mensajes de estado */}
          {displayError && (
            <p className="text-red-400 text-xs">{displayError}</p>
          )}
          {passwordSuccess && (
            <p className="text-emerald-400 text-xs">
              Contraseña actualizada exitosamente
            </p>
          )}

          <button
            onClick={handlePasswordUpdate}
            disabled={isChanging}
            className="text-primary text-xs font-bold mt-2 hover:underline disabled:opacity-50 flex items-center gap-2"
          >
            {isChanging ? (
              <>
                <Loader2 className="size-3 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar Contraseña"
            )}
          </button>
        </div>

        {/* Notification Preferences Section - TODO: Sin lógica de backend aún */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white mb-4">
            Preferencias de Notificación
          </h4>
          <p className="text-xs text-slate-500">
            Las preferencias de notificación estarán disponibles próximamente.
          </p>
          {/* TODO: Habilitar cuando el backend soporte notificaciones
          <div className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-semibold">Alertas por Email</p>
              <p className="text-xs text-slate-500">Recibe resúmenes semanales</p>
            </div>
            <Switch
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) => handleNotificationChange("emailAlerts", checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <div className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-semibold">Notificaciones Push</p>
              <p className="text-xs text-slate-500">Avisos instantáneos de tareas</p>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <div className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-semibold">Mensajes de Comunidad</p>
              <p className="text-xs text-slate-500">Cuando alguien responde a tu post</p>
            </div>
            <Switch
              checked={notifications.communityMessages}
              onCheckedChange={(checked) => handleNotificationChange("communityMessages", checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          */}
        </div>
      </div>
    </div>
  )
}
