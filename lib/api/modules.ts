import { httpClient } from "./client"
import { apiConfig } from "./config"

/* ===== Types ===== */
export interface Module {
  id: number
  title: string
  description: string
  level: "Básico" | "Intermedio" | "Avanzado"
  category: string
  image: string
  progress: number
  locked: boolean
  duration?: string
  lessons?: number
}

export interface ModuleDetail extends Module {
  content: ModuleContent[]
  requirements?: string[]
}

export interface ModuleContent {
  id: number
  title: string
  type: "video" | "quiz" | "reading"
  duration?: string
  completed: boolean
}

export interface ModuleProgress {
  moduleId: number
  progress: number
  completedLessons: number[]
  lastAccessedAt: string
}

/* ===== Modules Service ===== */
export const modulesService = {
  /**
   * Get all modules
   */
  async getAll(): Promise<Module[]> {
    return httpClient.get<Module[]>(apiConfig.endpoints.modules.list)
  },

  /**
   * Get module by ID
   */
  async getById(id: string): Promise<ModuleDetail> {
    return httpClient.get<ModuleDetail>(apiConfig.endpoints.modules.detail(id))
  },

  /**
   * Get module progress
   */
  async getProgress(id: string): Promise<ModuleProgress> {
    return httpClient.get<ModuleProgress>(
      apiConfig.endpoints.modules.progress(id)
    )
  },

  /**
   * Update module progress
   */
  async updateProgress(
    id: string,
    lessonId: string,
    completed: boolean
  ): Promise<ModuleProgress> {
    return httpClient.patch<ModuleProgress>(
      apiConfig.endpoints.modules.progress(id),
      { lessonId, completed }
    )
  },
}
