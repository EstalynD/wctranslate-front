import { httpClient } from "./client"
import { apiConfig } from "./config"
import { User, UserProfile, AUTH_STORAGE_KEYS } from "../types"

/* ===== Types ===== */

/** DTO para actualizar perfil propio */
export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
  nickName?: string
  bio?: string
}

/** DTO para cambiar contraseña */
export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

/** Respuesta al subir avatar */
export interface AvatarUploadResponse {
  message: string
  avatarUrl: string
  user: User
}

/* ===== Users Service ===== */
export const usersService = {
  /**
   * Obtener perfil del usuario autenticado
   */
  async getMe(): Promise<User> {
    return httpClient.get<User>(apiConfig.endpoints.user.me)
  },

  /**
   * Actualizar perfil propio (nombre, apellido, nick, bio)
   */
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    return httpClient.put<User>(apiConfig.endpoints.user.meProfile, data)
  },

  /**
   * Subir/actualizar foto de perfil (avatar)
   * Usa FormData para enviar el archivo multipart
   */
  async uploadAvatar(file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData()
    formData.append("avatar", file)

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN)
        : null

    const response = await fetch(
      `${apiConfig.baseUrl}${apiConfig.endpoints.user.meAvatar}`,
      {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        (errorData as { message?: string })?.message ||
          "Error al subir la foto de perfil"
      )
    }

    return response.json()
  },

  /**
   * Cambiar contraseña propia
   */
  async changePassword(data: ChangePasswordDto): Promise<void> {
    await httpClient.put<void>(apiConfig.endpoints.user.mePassword, data)
  },
}
