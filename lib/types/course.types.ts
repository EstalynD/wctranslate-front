/**
 * Course Types
 * Tipos para el sistema de cursos/módulos de entrenamiento
 */

// --- Enums (Mirror del backend) ---
export enum CourseCategory {
  GENERAL = "GENERAL",
  MARKETING = "MARKETING",
  TECHNICAL = "TECHNICAL",
  PSYCHOLOGY = "PSYCHOLOGY",
  LEGAL = "LEGAL",
  STYLING = "STYLING",
  COMMUNICATION = "COMMUNICATION",
}

export enum CourseLevel {
  BASIC = "BASIC",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum LessonType {
  VIDEO = "VIDEO",
  EXERCISE = "EXERCISE",
  QUIZ = "QUIZ",
  READING = "READING",
  DOWNLOAD = "DOWNLOAD",
}

export enum LessonStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum ProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

// --- Interfaces ---
export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  category: CourseCategory;
  level: CourseLevel;
  status: CourseStatus;
  isFeatured: boolean;
  allowedPlans: string[];
  themes: string[] | Theme[];
  totalDurationMinutes: number;
  totalLessons: number;
  enrolledCount: number;
  displayOrder: number;
  platformId: string | null;
  createdAt: string;
  updatedAt: string;
  // Estado de bloqueo (para modelos generales)
  isLocked?: boolean;
  lockReason?: string;
}

export interface Theme {
  _id: string;
  title: string;
  slug: string;
  description: string;
  highlightedText: string | null;
  courseId: string;
  lessons: string[] | BackendLesson[];
  order: number;
  totalDurationMinutes: number;
  totalLessons: number;
  requiresPreviousCompletion: boolean;
  unlockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendLesson {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: LessonType;
  status: LessonStatus;
  themeId: string;
  contentBlocks: ContentBlock[];
  resources: LessonResource[];
  durationMinutes: number;
  order: number;
  requiresPreviousCompletion: boolean;
  deadline: string | null;
  submissionConfig: SubmissionConfig | null;
  quizId: string | null;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  type: string;
  order: number;
  content?: string;
  mediaUrl?: string;
  iframeSrc?: string;
  settings?: Record<string, unknown>;
}

export interface LessonResource {
  id: string;
  name: string;
  type: "pdf" | "video" | "image" | "document" | "other";
  size: string;
  url: string;
}

export interface SubmissionConfig {
  maxFileSize: string;
  acceptedFormats: string[];
  requiresComment: boolean;
}

// --- Progress Types ---
export interface LessonProgressData {
  lessonId: string;
  status: ProgressStatus;
  completedAt: string | null;
  completedBlocks: number[];
  timeSpent?: number;
  submission?: {
    fileUrl: string;
    fileName: string;
    comment: string;
    submittedAt: string;
    grade: number | null;
    feedback: string | null;
  };
  quizResult?: {
    score: number;
    maxScore: number;
    percentage: number;
    attempts: number;
    lastAttemptAt: string;
    passed: boolean;
  };
}

export interface ThemeProgressData {
  themeId: string;
  status: ProgressStatus;
  progressPercentage: number;
  lessonsProgress: LessonProgressData[];
  startedAt: string | null;
  completedAt: string | null;
}

export interface CourseProgressData {
  courseId: string;
  status: ProgressStatus;
  progressPercentage: number;
  themesProgress: ThemeProgressData[];
  enrolledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  lastAccessedAt: string;
}

export interface UserProgressData {
  _id: string;
  userId: string;
  courses: CourseProgressData[];
  totalCoursesCompleted: number;
  totalLessonsCompleted: number;
  totalTimeSpentMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

export interface StartingPointResponse {
  courseId: string;
  themeId: string;
  lessonId: string;
  courseName: string;
  themeName: string;
  lessonName: string;
  themeOrder: number;
  lessonOrder: number;
}

export interface DailyStatusResponse {
  tasksCompletedToday: number;
  maxDailyTasks: number;
  tasksRemaining: number;
  canCompleteMore: boolean;
  lastTaskDate: string | null;
}

export interface ThemeAccessResponse {
  canAccess: boolean;
  reason?: string;
  themeId: string;
  requiresCompletion: boolean;
  previousThemeProgress?: number;
  unlockThreshold?: number;
}

export interface LessonAccessResponse {
  canAccess: boolean;
  reason?: string;
  preQuizRequired?: boolean;
  preQuizId?: string;
  themeAccessible?: boolean;
  postQuiz?: {
    required: boolean;
    quizId?: string;
    hasPassed: boolean;
    message: string;
  };
  preQuiz?: {
    required: boolean;
    quizId?: string;
    hasPassed: boolean;
    message: string;
  };
}

export interface LessonContentStatusResponse {
  canView: boolean;
  canBypass: boolean;
  preQuiz?: {
    required: boolean;
    quizId?: string;
    hasPassed: boolean;
    message: string;
  };
  postQuiz?: {
    required: boolean;
    quizId?: string;
    hasPassed: boolean;
    message: string;
  };
}

export interface LessonFullStatusResponse {
  access: LessonAccessResponse;
  contentStatus: LessonContentStatusResponse;
  dailyStatus: DailyStatusResponse;
  lessonProgress: LessonProgressData | null;
}

// --- Responses ---
export interface CoursesResponse {
  courses: Course[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CoursesQueryParams {
  status?: CourseStatus;
  category?: CourseCategory;
  level?: CourseLevel;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

// --- Mapeos para UI ---
export const categoryLabels: Record<CourseCategory, string> = {
  [CourseCategory.GENERAL]: "General",
  [CourseCategory.MARKETING]: "Marketing",
  [CourseCategory.TECHNICAL]: "Técnico",
  [CourseCategory.PSYCHOLOGY]: "Psicología",
  [CourseCategory.LEGAL]: "Legal",
  [CourseCategory.STYLING]: "Styling",
  [CourseCategory.COMMUNICATION]: "Comunicación",
};

export const levelLabels: Record<CourseLevel, string> = {
  [CourseLevel.BASIC]: "Básico",
  [CourseLevel.INTERMEDIATE]: "Intermedio",
  [CourseLevel.ADVANCED]: "Avanzado",
};

export const lessonTypeLabels: Record<LessonType, string> = {
  [LessonType.VIDEO]: "Video",
  [LessonType.EXERCISE]: "Ejercicio",
  [LessonType.QUIZ]: "Quiz",
  [LessonType.READING]: "Lectura",
  [LessonType.DOWNLOAD]: "Descarga",
};

// --- Dashboard Types ---
export interface DashboardCourseItem {
  id: string;
  title: string;
  slug: string;
  level: string;
  thumbnail: string | null;
  progress: number;
  status: string;
  lastAccessedAt: string | null;
}

export interface DashboardNextTask {
  lessonId: string;
  lessonTitle: string;
  lessonSlug: string;
  lessonDescription: string;
  themeId: string;
  themeName: string;
  courseId: string;
  courseName: string;
}

export interface DashboardHomeResponse {
  user: {
    firstName: string;
    lastName: string;
    nickName?: string;
    avatarUrl?: string;
  };
  stats: {
    totalProgress: number;
    coursesEnrolled: number;
    coursesCompleted: number;
    lessonsCompleted: number;
    currentStreak: number;
    pendingTasks: number;
    modulesRemaining: number;
  };
  coursesInProgress: DashboardCourseItem[];
  nextTask: DashboardNextTask | null;
}
