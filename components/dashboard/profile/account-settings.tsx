"use client"

import { useState } from "react"
import { Settings2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

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
}

/* ===== Account Settings Component ===== */
export function AccountSettings({
  notifications: initialNotifications,
  onPasswordChange,
  onNotificationsChange,
}: AccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [notifications, setNotifications] = useState(initialNotifications)

  const handlePasswordUpdate = () => {
    if (currentPassword && newPassword) {
      onPasswordChange?.(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
    }
  }

  const handleNotificationChange = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    onNotificationsChange?.(updated)
  }

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
              onChange={(e) => setCurrentPassword(e.target.value)}
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
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-bg-dark border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary"
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="text-primary text-xs font-bold mt-2 hover:underline"
          >
            Actualizar Contraseña
          </button>
        </div>

        {/* Notification Preferences Section */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-white mb-4">
            Preferencias de Notificación
          </h4>

          {/* Email Alerts */}
          <div className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-semibold">Alertas por Email</p>
              <p className="text-xs text-slate-500">
                Recibe resúmenes semanales
              </p>
            </div>
            <Switch
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) =>
                handleNotificationChange("emailAlerts", checked)
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-semibold">Notificaciones Push</p>
              <p className="text-xs text-slate-500">
                Avisos instantáneos de tareas
              </p>
            </div>
            <Switch
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) =>
                handleNotificationChange("pushNotifications", checked)
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Community Messages */}
          <div className="flex items-center justify-between group">
            <div>
              <p className="text-sm font-semibold">Mensajes de Comunidad</p>
              <p className="text-xs text-slate-500">
                Cuando alguien responde a tu post
              </p>
            </div>
            <Switch
              checked={notifications.communityMessages}
              onCheckedChange={(checked) =>
                handleNotificationChange("communityMessages", checked)
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
