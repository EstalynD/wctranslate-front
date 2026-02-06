import { httpClient } from "./client";
import { apiConfig } from "./config";
import type { Theme, BackendLesson } from "../types/course.types";

/* ===== Types para respuestas populadas ===== */
export interface ThemeWithLessons extends Omit<Theme, "lessons"> {
  lessons: BackendLesson[];
}

/* ===== Themes Service ===== */
export const themesService = {
  /**
   * Obtener todos los temas (opcionalmente filtrados por curso)
   */
  async getAll(courseId?: string): Promise<Theme[]> {
    const endpoint = courseId
      ? apiConfig.endpoints.themes.byCourse(courseId)
      : apiConfig.endpoints.themes.list;
    return httpClient.get<Theme[]>(endpoint);
  },

  /**
   * Obtener un tema por ID
   */
  async getById(id: string): Promise<Theme> {
    return httpClient.get<Theme>(apiConfig.endpoints.themes.detail(id));
  },

  /**
   * Obtener un tema por slug
   */
  async getBySlug(slug: string): Promise<Theme> {
    return httpClient.get<Theme>(apiConfig.endpoints.themes.bySlug(slug));
  },

  /**
   * Obtener tema con sus lecciones populadas
   */
  async getWithLessons(id: string): Promise<ThemeWithLessons> {
    return httpClient.get<ThemeWithLessons>(
      apiConfig.endpoints.themes.withLessons(id)
    );
  },

  /**
   * Obtener todos los temas de un curso
   */
  async getByCourse(courseId: string): Promise<Theme[]> {
    return httpClient.get<Theme[]>(
      apiConfig.endpoints.themes.byCourse(courseId)
    );
  },
};
