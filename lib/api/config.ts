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
      my: "/courses/my",
      detail: (id: string) => `/courses/${id}`,
      bySlug: (slug: string) => `/courses/slug/${slug}`,
      withThemes: (id: string) => `/courses/${id}/with-themes`,
    },
    themes: {
      list: "/themes",
      detail: (id: string) => `/themes/${id}`,
      bySlug: (slug: string) => `/themes/slug/${slug}`,
      withLessons: (id: string) => `/themes/${id}/with-lessons`,
      byCourse: (courseId: string) => `/themes/course/${courseId}`,
    },
    lessons: {
      list: "/lessons",
      detail: (id: string) => `/lessons/${id}`,
      bySlug: (slug: string) => `/lessons/slug/${slug}`,
      byTheme: (themeId: string) => `/lessons/theme/${themeId}`,
      publishedByTheme: (themeId: string) => `/lessons/theme/${themeId}/published`,
    },
    progress: {
      my: "/progress/my",
      myDashboard: "/progress/my/dashboard",
      myCourse: (courseId: string) => `/progress/my/course/${courseId}`,
      myLesson: (lessonId: string) => `/progress/my/lesson/${lessonId}`,
      myStats: "/progress/my/stats",
      myRecentActivity: "/progress/my/recent-activity",
      myDailyStatus: "/progress/my/daily-status",
      myStartingPoint: "/progress/my/starting-point",
      enroll: (courseId: string) => `/progress/enroll/${courseId}`,
      completeLesson: (lessonId: string) => `/progress/lesson/${lessonId}/complete`,
      updateTime: (lessonId: string) => `/progress/lesson/${lessonId}/time`,
      lessonAccess: (lessonId: string) => `/progress/lesson/${lessonId}/access`,
      lessonsAccessBatch: "/progress/lessons/access-batch",
      lessonFullStatus: (lessonId: string) => `/progress/lesson/${lessonId}/full-status`,
      lessonContentStatus: (lessonId: string) => `/progress/lesson/${lessonId}/content-status`,
      themeAccess: (themeId: string, courseId: string) =>
        `/progress/theme/${themeId}/access?courseId=${courseId}`,
      myStreak: "/progress/my/streak",
    },
    user: {
      me: "/users/me",
      meProfile: "/users/me/profile",
      meAvatar: "/users/me/avatar",
      mePassword: "/users/me/password",
      meGamification: "/users/me/gamification",
      meSubscription: "/users/me/subscription",
      meCourses: "/users/me/courses",
    },
    gamification: {
      stats: "/gamification/stats",
      leaderboard: "/gamification/leaderboard",
    },
    quiz: {
      getForStudent: (quizId: string) => `/quiz/${quizId}/student`,
      canStart: (quizId: string) => `/quiz/${quizId}/can-start`,
      byLesson: (lessonId: string) => `/quiz/lesson/${lessonId}`,
      startAttempt: "/quiz/attempts/start",
      submitAttempt: (attemptId: string) => `/quiz/attempts/${attemptId}/submit`,
      saveProgress: (attemptId: string) => `/quiz/attempts/${attemptId}/progress`,
      abandonAttempt: (attemptId: string) => `/quiz/attempts/${attemptId}/abandon`,
      myAttempts: "/quiz/attempts/me",
      attemptDetail: (attemptId: string) => `/quiz/attempts/${attemptId}`,
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
