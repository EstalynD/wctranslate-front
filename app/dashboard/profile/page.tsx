"use client"

import { useState } from "react"
import { Home, Loader2 } from "lucide-react"
import {
  ProfileHeader,
  PersonalInfoForm,
  AccountSettings,
  LearningStats,
  AchievementsGrid,
} from "@/components/dashboard/profile"
import { useAuth } from "@/lib/contexts"
import { usersService } from "@/lib/api"

/* ===== Helper: Formatear fecha de registro ===== */
function formatMemberSince(dateStr: string): string {
  const date = new Date(dateStr)
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ]
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

/* ===== Helper: Obtener label del nivel ===== */
function getLevelLabel(level: number): string {
  if (level >= 50) return "Nivel Diamante"
  if (level >= 30) return "Nivel Platino"
  if (level >= 20) return "Nivel Oro"
  if (level >= 10) return "Nivel Plata"
  if (level >= 5) return "Nivel Bronce"
  return `Nivel ${level}`
}

/* ===== Profile Page ===== */
export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Si no hay usuario aún, mostrar loading
  if (!user) {
    return (
      <main className="flex-1 flex items-center justify-center bg-[var(--deep-dark)]">
        <Loader2 className="size-8 text-primary animate-spin" />
      </main>
    )
  }

  // Datos del usuario autenticado
  const fullName = `${user.profile.firstName} ${user.profile.lastName}`
  const level = getLevelLabel(user.gamification?.level || 1)
  const memberSince = formatMemberSince(user.createdAt)

  // Cuando se sube un nuevo avatar
  const handleAvatarUploaded = (avatarUrl: string) => {
    updateUser({
      ...user,
      profile: { ...user.profile, avatarUrl },
    })
  }

  // Cuando se guardan los datos personales
  const handleProfileSaved = (data: {
    firstName: string
    lastName: string
    nickName: string
    email: string
    bio: string
  }) => {
    updateUser({
      ...user,
      profile: {
        ...user.profile,
        firstName: data.firstName,
        lastName: data.lastName,
        nickName: data.nickName || undefined,
        bio: data.bio || undefined,
      },
    })
  }

  // Cambiar contraseña
  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setPasswordError(null)
    setPasswordSuccess(false)

    try {
      await usersService.changePassword({ currentPassword, newPassword })
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Error al cambiar la contraseña"
      )
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-y-auto bg-[var(--deep-dark)] relative">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/80">
          <Home className="size-4" />
          <span className="text-xs font-bold text-white/40">/</span>
          <span className="text-xs font-bold uppercase tracking-widest">
            Perfil
          </span>
        </div>

        {/* TODO: Botones de notificaciones y configuración - Sin lógica de backend aún */}
        {/* <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white" aria-label="Notificaciones">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white" aria-label="Configuración">
            <Settings className="size-5" />
          </Button>
        </div> */}
      </div>

      {/* Profile Header with Banner and Avatar */}
      <ProfileHeader
        name={fullName}
        email={user.email}
        avatar={user.profile.avatarUrl || null}
        level={level}
        memberSince={memberSince}
        onAvatarUploaded={handleAvatarUploaded}
      />

      {/* Content Grid */}
      <div className="px-8 md:px-12 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info Form */}
          <PersonalInfoForm
            initialData={{
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              nickName: user.profile.nickName || "",
              email: user.email,
              bio: user.profile.bio || "",
            }}
            onSaved={handleProfileSaved}
          />

          {/* Account Settings - Contraseña funcional, notificaciones comentadas */}
          <AccountSettings
            notifications={{
              emailAlerts: false,
              pushNotifications: false,
              communityMessages: false,
            }}
            onPasswordChange={handlePasswordChange}
            passwordError={passwordError}
            passwordSuccess={passwordSuccess}
          />
        </div>

        {/* Right Column - Stats and Achievements */}
        <div className="space-y-8">
          {/* Learning Stats - TODO: Conectar con endpoint de stats reales cuando exista */}
          {/* <LearningStats
            hoursTrainied={0}
            modulesCompleted={0}
            tasksSubmitted={0}
          /> */}

          {/* Achievements - TODO: Sin sistema de logros en backend aún */}
          {/* <AchievementsGrid unlockedCount={0} totalCount={30} /> */}

          {/* Gamificación básica del usuario */}
          <div className="bg-card-dark border border-white/5 p-8 rounded-[2rem] shadow-xl shadow-black/20">
            <h3 className="text-xl font-bold mb-6">Tu Progreso</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Nivel</span>
                <span className="text-lg font-black text-primary">
                  {user.gamification?.level || 1}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Estrellas</span>
                <span className="text-lg font-black text-yellow-400">
                  {user.gamification?.stars || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">XP Actual</span>
                <span className="text-lg font-black text-accent">
                  {user.gamification?.currentXp || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Plan</span>
                <span className="text-sm font-bold text-white uppercase">
                  {user.subscriptionAccess?.planType || "TESTER"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
