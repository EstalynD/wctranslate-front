import { httpClient } from "./client";
import { apiConfig } from "./config";
import type {
  UserProgressData,
  CourseProgressData,
  LessonProgressData,
  DailyStatusResponse,
  StartingPointResponse,
  LessonAccessResponse,
  LessonContentStatusResponse,
  LessonFullStatusResponse,
  ThemeAccessResponse,
  DashboardHomeResponse,
} from "../types/course.types";

/* ===== Types para respuestas de actualización ===== */
export interface ProgressUpdateResponse {
  success: boolean;
  courseProgress: number;
  themeProgress: number;
  lessonCompleted: boolean;
  themeCompleted: boolean;
  courseCompleted: boolean;
  message?: string;
  postQuizRequired?: {
    quizId: string;
    attemptsCount: number;
    maxAttempts: number;
    bestScore: number;
  };
  dailyLimitReached?: boolean;
  rewards?: {
    tokensEarned: number;
    xpEarned: number;
    streakBonus?: number;
    themeBonus?: number;
    courseBonus?: number;
    leveledUp?: boolean;
    newLevel?: number;
  };
  dailyProgress?: {
    tasksCompletedToday: number;
    maxDailyTasks: number;
    tasksRemaining: number;
  };
  unlockedContent?: {
    nextLesson?: string;
    nextTheme?: string;
  };
}

export interface UserStats {
  totalCoursesCompleted: number;
  totalLessonsCompleted: number;
  totalTimeSpentMinutes: number;
  currentStreak: number;
  longestStreak: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

/* ===== Progress Service ===== */
export const progressService = {
  /**
   * Obtener datos del dashboard home
   */
  async getMyDashboard(): Promise<DashboardHomeResponse> {
    return httpClient.get<DashboardHomeResponse>(apiConfig.endpoints.progress.myDashboard);
  },

  /**
   * Obtener todo el progreso del usuario autenticado
   */
  async getMyProgress(): Promise<UserProgressData> {
    return httpClient.get<UserProgressData>(apiConfig.endpoints.progress.my);
  },

  /**
   * Obtener progreso de un curso específico
   */
  async getMyCourseProgress(
    courseId: string
  ): Promise<CourseProgressData | null> {
    return httpClient.get<CourseProgressData | null>(
      apiConfig.endpoints.progress.myCourse(courseId)
    );
  },

  /**
   * Obtener progreso de una lección específica
   */
  async getMyLessonProgress(
    lessonId: string
  ): Promise<LessonProgressData | null> {
    return httpClient.get<LessonProgressData | null>(
      apiConfig.endpoints.progress.myLesson(lessonId)
    );
  },

  /**
   * Obtener estadísticas del usuario
   */
  async getMyStats(): Promise<UserStats> {
    return httpClient.get<UserStats>(apiConfig.endpoints.progress.myStats);
  },

  /**
   * Obtener estado diario del usuario
   */
  async getMyDailyStatus(): Promise<DailyStatusResponse> {
    return httpClient.get<DailyStatusResponse>(
      apiConfig.endpoints.progress.myDailyStatus
    );
  },

  /**
   * Obtener punto de inicio recomendado
   */
  async getMyStartingPoint(courseId?: string): Promise<StartingPointResponse> {
    const endpoint = courseId
      ? `${apiConfig.endpoints.progress.myStartingPoint}?courseId=${courseId}`
      : apiConfig.endpoints.progress.myStartingPoint;

    return httpClient.get<StartingPointResponse>(endpoint);
  },

  /**
   * Inscribirse en un curso
   */
  async enrollInCourse(courseId: string): Promise<UserProgressData> {
    return httpClient.post<UserProgressData>(
      apiConfig.endpoints.progress.enroll(courseId)
    );
  },

  /**
   * Marcar lección como completada
   */
  async markLessonComplete(
    lessonId: string,
    data?: { completedBlocks?: number[] }
  ): Promise<ProgressUpdateResponse> {
    return httpClient.post<ProgressUpdateResponse>(
      apiConfig.endpoints.progress.completeLesson(lessonId),
      data
    );
  },

  /**
   * Actualizar tiempo dedicado a una lección
   */
  async updateTimeSpent(
    lessonId: string,
    seconds: number
  ): Promise<void> {
    await httpClient.put(apiConfig.endpoints.progress.updateTime(lessonId), {
      seconds,
    });
  },

  /**
   * Verificar acceso a una leccion
   */
  async getLessonAccess(lessonId: string): Promise<LessonAccessResponse> {
    return httpClient.get<LessonAccessResponse>(
      apiConfig.endpoints.progress.lessonAccess(lessonId)
    );
  },

  /**
   * Obtener estado completo de una leccion
   */
  async getLessonFullStatus(lessonId: string): Promise<LessonFullStatusResponse> {
    return httpClient.get<LessonFullStatusResponse>(
      apiConfig.endpoints.progress.lessonFullStatus(lessonId)
    );
  },

  /**
   * Verificar acceso al contenido de una leccion
   */
  async getLessonContentStatus(
    lessonId: string
  ): Promise<LessonContentStatusResponse> {
    return httpClient.get<LessonContentStatusResponse>(
      apiConfig.endpoints.progress.lessonContentStatus(lessonId)
    );
  },

  /**
   * Verificar acceso a un tema
   */
  async getThemeAccess(
    themeId: string,
    courseId: string
  ): Promise<ThemeAccessResponse> {
    return httpClient.get<ThemeAccessResponse>(
      apiConfig.endpoints.progress.themeAccess(themeId, courseId)
    );
  },

  /**
   * Obtener racha actual
   */
  async getMyStreak(): Promise<StreakData> {
    return httpClient.get<StreakData>(apiConfig.endpoints.progress.myStreak);
  },
};
