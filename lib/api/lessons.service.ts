import { httpClient } from "./client";
import { apiConfig } from "./config";
import type { BackendLesson } from "../types/course.types";

/* ===== Lessons Service ===== */
export const lessonsService = {
  /**
   * Obtener todas las lecciones (opcionalmente filtradas por tema)
   */
  async getAll(themeId?: string): Promise<BackendLesson[]> {
    const endpoint = themeId
      ? apiConfig.endpoints.lessons.byTheme(themeId)
      : apiConfig.endpoints.lessons.list;
    return httpClient.get<BackendLesson[]>(endpoint);
  },

  /**
   * Obtener una lección por ID
   */
  async getById(id: string): Promise<BackendLesson> {
    return httpClient.get<BackendLesson>(
      apiConfig.endpoints.lessons.detail(id)
    );
  },

  /**
   * Obtener una lección por slug
   */
  async getBySlug(slug: string): Promise<BackendLesson> {
    return httpClient.get<BackendLesson>(
      apiConfig.endpoints.lessons.bySlug(slug)
    );
  },

  /**
   * Obtener lecciones por tema
   */
  async getByTheme(themeId: string): Promise<BackendLesson[]> {
    return httpClient.get<BackendLesson[]>(
      apiConfig.endpoints.lessons.byTheme(themeId)
    );
  },

  /**
   * Obtener lecciones publicadas por tema
   */
  async getPublishedByTheme(themeId: string): Promise<BackendLesson[]> {
    return httpClient.get<BackendLesson[]>(
      apiConfig.endpoints.lessons.publishedByTheme(themeId)
    );
  },
};
