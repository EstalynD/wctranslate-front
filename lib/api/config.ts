/**
 * API Configuration
 * Centralizes all API-related configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      logout: "/auth/logout",
      logoutAll: "/auth/logout-all",
      refresh: "/auth/refresh",
      me: "/auth/me",
    },
    modules: {
      list: "/modules",
      detail: (id: string) => `/modules/${id}`,
      progress: (id: string) => `/modules/${id}/progress`,
    },
    courses: {
      list: "/courses",
      detail: (id: string) => `/courses/${id}`,
      themes: (courseId: string) => `/courses/${courseId}/themes`,
      lessons: (themeId: string) => `/themes/${themeId}/lessons`,
    },
    user: {
      profile: "/users/profile",
      achievements: "/users/achievements",
      tasks: "/users/tasks",
      progress: "/users/progress",
    },
    gamification: {
      stats: "/gamification/stats",
      leaderboard: "/gamification/leaderboard",
    },
  },
  defaultHeaders: {
    "Content-Type": "application/json",
  },
  // Timeouts en milisegundos
  timeouts: {
    default: 30000,
    upload: 120000,
  },
} as const;

export type ApiEndpoints = typeof apiConfig.endpoints;
