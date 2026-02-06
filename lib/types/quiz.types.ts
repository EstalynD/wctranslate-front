/**
 * Quiz Types - Tipos para el sistema de quizzes
 */

// --- Enums ---
export enum QuizType {
  PRE_QUIZ = 'PRE_QUIZ',
  POST_QUIZ = 'POST_QUIZ',
  PRACTICE = 'PRACTICE',
  FINAL = 'FINAL',
}

export enum QuizStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTIPLE_ANSWER = 'MULTIPLE_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
  TEXT = 'TEXT',
  FILL_BLANK = 'FILL_BLANK',
  MATCHING = 'MATCHING',
  ORDERING = 'ORDERING',
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  ABANDONED = 'ABANDONED',
}

// --- Interfaces ---
export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
  // isCorrect se omite para estudiantes
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  explanation?: string;
  imageUrl?: string;
  videoUrl?: string;
  options?: QuestionOption[];
  orderItems?: { id: string; text: string }[];
  matchingPairs?: MatchingPair[];
  points: number;
  partialCredit: boolean;
  difficulty: DifficultyLevel;
  order: number;
  isRequired: boolean;
}

export interface QuizSettings {
  timeLimit?: number;
  showTimer: boolean;
  maxAttempts: number;
  cooldownMinutes?: number;
  passingScore: number;
  showScoreImmediately: boolean;
  allowSkip: boolean;
  allowReview: boolean;
  allowBackNavigation: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  feedbackTiming: 'immediate' | 'after_submit' | 'never';
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  preQuizBehavior?: {
    showContentOnFail: boolean;
    bypassOnSuccess: boolean;
    motivationalMessageOnFail?: string;
    congratsMessageOnPass?: string;
  };
  postQuizBehavior?: {
    requirePassToComplete: boolean;
    unlockNextOnPass: boolean;
    retryMessageOnFail?: string;
  };
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  instructions?: string;
  type: QuizType;
  status: QuizStatus;
  lessonId?: string;
  themeId?: string;
  courseId?: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

// --- Quiz para estudiante (sin respuestas correctas) ---
export interface QuizForStudent {
  _id: string;
  title: string;
  description?: string;
  instructions?: string;
  type: QuizType;
  questions: QuizQuestion[];
  settings: QuizSettings;
  totalPoints: number;
  questionsCount: number;
  estimatedMinutes: number;
}

// --- Intentos ---
export interface QuestionAnswer {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  orderedItems?: string[];
  matchedPairs?: { leftId: string; rightId: string }[];
  answeredAt: string;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  userId: string;
  status: AttemptStatus;
  attemptNumber: number;
  answers: QuestionAnswer[];
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  expiresAt?: string;
  totalTimeSeconds?: number;
  tokensEarned?: number;
  xpEarned?: number;
}

// --- DTOs ---
export interface StartAttemptDto {
  quizId: string;
}

export interface SubmitAnswerDto {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  orderedItems?: string[];
  matchedPairs?: { leftId: string; rightId: string }[];
  timeSpentSeconds: number;
}

export interface SubmitAttemptDto {
  answers: SubmitAnswerDto[];
}

export interface SaveProgressDto {
  answers: SubmitAnswerDto[];
}

// --- Responses ---
export interface CanStartResponse {
  canStart: boolean;
  reason?: string;
  attemptsUsed: number;
  maxAttempts: number;
  cooldownEndsAt?: string;
}

export interface StartAttemptResponse {
  attemptId: string;
  quizId: string;
  attemptNumber: number;
  startedAt: string;
  expiresAt?: string;
  questionOrder: string[];
  quiz: QuizForStudent;
}

export interface SubmitAttemptResponse {
  attemptId: string;
  status: AttemptStatus;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  totalTimeSeconds: number;
  startedAt: string;
  completedAt: string;
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    partialCorrect: number;
  };
  rewards?: {
    tokensEarned: number;
    xpEarned: number;
    isFirstPass: boolean;
    isPerfectScore: boolean;
  };
  feedback?: {
    message: string;
  };
  correctAnswers?: {
    questionId: string;
    correctOptionIds?: string[];
    correctAnswers?: string[];
    correctOrder?: string[];
    matchingPairs?: MatchingPair[];
  }[];
  explanations?: {
    questionId: string;
    explanation: string;
  }[];
  retryInfo: {
    canRetry: boolean;
    attemptsRemaining: number | null;
    cooldownEndsAt?: string;
  };
}
