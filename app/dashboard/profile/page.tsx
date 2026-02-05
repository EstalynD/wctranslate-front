"use client"

import { Bell, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ProfileHeader,
  PersonalInfoForm,
  AccountSettings,
  LearningStats,
  AchievementsGrid,
} from "@/components/dashboard/profile"

/* ===== Mock Data ===== */
// TODO: Replace with actual API calls
const mockUser = {
  name: "Elena Vance",
  email: "elena.vance@wctraining.com",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCkQQhat69Jhr3pWqXRhLGjXrsQZ7xDhlU_x9AdJPJlfLTvZqEjvPRRG8lIvmOH18uIIQWuXgl58Ve2IwbS3Vn8PLTG_wk39E8VHqel0YI_DiARClL1Rt6LSZCODlnm5xag1Gh-8SaoViYHzvecM_0n7cFxSv5cEkr2RGSSKfKgVnImhNFqFBcY1LA7OUhKlXj5t0fJ8eBCpMp1ORY4-0EY2e1WC_f_u6n2aw8afCjQ-blsxDKdNH0bnT5bemiCWlNRwNReYeSNgs8",
  level: "Nivel Diamante",
  memberSince: "2022",
  studio: "Vixen Studio International",
  bio: "Modelo profesional con 3 años de experiencia. Apasionada por el aprendizaje continuo y la interacción auténtica.",
}

const mockStats = {
  hoursTrainied: 124,
  modulesCompleted: 18,
  tasksSubmitted: 42,
}

const mockNotifications = {
  emailAlerts: true,
  pushNotifications: true,
  communityMessages: false,
}

/* ===== Profile Page ===== */
export default function ProfilePage() {
  // Event handlers
  const handleAvatarChange = () => {
    // TODO: Open file picker and upload avatar
    console.log("Change avatar")
  }

  const handleShareProfile = () => {
    // TODO: Open share modal or copy link
    console.log("Share profile")
  }

  const handleSavePersonalInfo = (data: {
    fullName: string
    email: string
    studio: string
    bio: string
  }) => {
    // TODO: Send to API
    console.log("Save personal info:", data)
  }

  const handleCancelEdit = () => {
    // TODO: Reset form to original values
    console.log("Cancel edit")
  }

  const handlePasswordChange = (currentPassword: string, newPassword: string) => {
    // TODO: Send to API
    console.log("Change password", { currentPassword, newPassword })
  }

  const handleNotificationsChange = (notifications: typeof mockNotifications) => {
    // TODO: Send to API
    console.log("Update notifications:", notifications)
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

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white"
            aria-label="Notificaciones"
          >
            <Bell className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white"
            aria-label="Configuración"
          >
            <Settings className="size-5" />
          </Button>
        </div>
      </div>

      {/* Profile Header with Banner and Avatar */}
      <ProfileHeader
        name={mockUser.name}
        email={mockUser.email}
        avatar={mockUser.avatar}
        level={mockUser.level}
        memberSince={mockUser.memberSince}
        onAvatarChange={handleAvatarChange}
        onShareProfile={handleShareProfile}
      />

      {/* Content Grid */}
      <div className="px-8 md:px-12 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info Form */}
          <PersonalInfoForm
            initialData={{
              fullName: mockUser.name,
              email: mockUser.email,
              studio: mockUser.studio,
              bio: mockUser.bio,
            }}
            onSave={handleSavePersonalInfo}
            onCancel={handleCancelEdit}
          />

          {/* Account Settings */}
          <AccountSettings
            notifications={mockNotifications}
            onPasswordChange={handlePasswordChange}
            onNotificationsChange={handleNotificationsChange}
          />
        </div>

        {/* Right Column - Stats and Achievements */}
        <div className="space-y-8">
          {/* Learning Stats */}
          <LearningStats
            hoursTrainied={mockStats.hoursTrainied}
            modulesCompleted={mockStats.modulesCompleted}
            tasksSubmitted={mockStats.tasksSubmitted}
          />

          {/* Achievements */}
          <AchievementsGrid unlockedCount={12} totalCount={30} />
        </div>
      </div>
    </main>
  )
}
