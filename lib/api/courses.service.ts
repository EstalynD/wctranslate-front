import { httpClient } from "./client";
import { apiConfig } from "./config";
import type {
  Course,
  CoursesResponse,
  CoursesQueryParams,
  Theme,
  CourseProgram,
} from "../types/course.types";
import { CourseStatus } from "../types/course.types";

/* ===== Types para respuestas populadas ===== */
export interface CourseWithThemes extends Omit<Course, "themes"> {
  themes: Theme[];
}

/* ===== Courses Service ===== */
export const coursesService = {
  /**
   * Obtener cursos con filtros y paginación
   */
  async getAll(params?: CoursesQueryParams): Promise<CoursesResponse> {
    const searchParams = new URLSearchParams();

    if (params?.status) searchParams.set("status", params.status);
    if (params?.category) searchParams.set("category", params.category);
    if (params?.level) searchParams.set("level", params.level);
    if (params?.isFeatured !== undefined)
      searchParams.set("isFeatured", String(params.isFeatured));
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const query = searchParams.toString();
    const endpoint = `${apiConfig.endpoints.courses.list}${query ? `?${query}` : ""}`;

    return httpClient.get<CoursesResponse>(endpoint);
  },

  /**
   * Obtener cursos accesibles para el usuario autenticado
   */
  async getMyCourses(): Promise<CoursesResponse> {
    return httpClient.get<CoursesResponse>(apiConfig.endpoints.courses.my);
  },

  /**
   * Obtener todos los cursos publicados
   */
  async getPublished(
    params?: Omit<CoursesQueryParams, "status">
  ): Promise<CoursesResponse> {
    return this.getAll({ ...params, status: CourseStatus.PUBLISHED });
  },

  /**
   * Obtener un curso por ID
   */
  async getById(id: string): Promise<Course> {
    return httpClient.get<Course>(apiConfig.endpoints.courses.detail(id));
  },

  /**
   * Obtener un curso por slug
   */
  async getBySlug(slug: string): Promise<Course> {
    return httpClient.get<Course>(apiConfig.endpoints.courses.bySlug(slug));
  },

  /**
   * Obtener programa completo del curso por slug (Curso -> Temas -> Lecciones)
   */
  async getProgramBySlug(slug: string): Promise<CourseProgram> {
    return httpClient.get<CourseProgram>(
      apiConfig.endpoints.courses.programBySlug(slug)
    );
  },

  /**
   * Obtener un curso con sus temas populados
   */
  async getWithThemes(id: string): Promise<CourseWithThemes> {
    return httpClient.get<CourseWithThemes>(
      apiConfig.endpoints.courses.withThemes(id)
    );
  },
};
