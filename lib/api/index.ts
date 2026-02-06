// API Services - Centralized exports
export { httpClient, ApiError } from "./client";
export { apiConfig } from "./config";
export { authService } from "./auth.service";
export { usersService } from "./users.service";
export { modulesService } from "./modules";
export { coursesService } from "./courses.service";
export { themesService } from "./themes.service";
export { lessonsService } from "./lessons.service";
export { progressService } from "./progress.service";
export { quizService } from "./quiz.service";

// Service types
export type { CourseWithThemes } from "./courses.service";
export type { ThemeWithLessons } from "./themes.service";
export type {
  ProgressUpdateResponse,
  UserStats,
  StreakData,
} from "./progress.service";

// Types re-exports
export type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  UserProfile,
  UserRole,
  UserStatus,
} from "../types";

export type {
  Course,
  CoursesResponse,
  CoursesQueryParams,
  Theme,
  BackendLesson,
  CourseProgressData,
  ThemeProgressData,
  LessonProgressData,
  UserProgressData,
} from "../types/course.types";

export {
  CourseCategory,
  CourseLevel,
  CourseStatus,
  LessonType,
  LessonStatus,
  ProgressStatus,
  categoryLabels,
  levelLabels,
  lessonTypeLabels,
} from "../types/course.types";

