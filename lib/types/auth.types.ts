/**
 * Authentication Types
 * Tipos centralizados para el sistema de autenticación
 */

// --- Enums (Mirror del backend) ---
export enum UserRole {
  MODEL = 'MODEL',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum PlanType {
  TESTER = 'TESTER',
  FREE = 'FREE',
  PRO = 'PRO',
  ELITE = 'ELITE',
}

export enum UserStage {
  INICIACION = 'INICIACION',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
}

export enum StreamingPlatform {
  CHATURBATE = 'CHATURBATE',
  LIVEJASMIN = 'LIVEJASMIN',
  STRIPCHAT = 'STRIPCHAT',
  BONGACAMS = 'BONGACAMS',
  CAM4 = 'CAM4',
  MYFREECAMS = 'MYFREECAMS',
  FLIRT4FREE = 'FLIRT4FREE',
  STREAMATE = 'STREAMATE',
  OTHER = 'OTHER',
}

// --- User Profile ---
export interface UserProfile {
  firstName: string;
  lastName: string;
  nickName?: string;
  avatarUrl?: string;
  bio?: string;
}

// --- User Gamification ---
export interface UserGamification {
  level: number;
  stars: number;
  currentXp: number;
}

// --- Subscription Access ---
export interface SubscriptionAccess {
  isActive: boolean;
  planType: PlanType;
  expiresAt: string | null;
  subscriptionId?: string;
}

// --- Model Config ---
export interface ModelConfig {
  streamingPlatform: StreamingPlatform | null;
  stage: UserStage;
  isSuperUser: boolean;
  isDemo: boolean;
  studioId: string | null;
}

// --- Daily Progress ---
export interface DailyProgress {
  tasksCompletedToday: number;
  lastTaskDate: string | null;
  maxDailyTasks: number;
}

// --- User (respuesta del backend) ---
export interface User {
  _id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  gamification: UserGamification;
  subscriptionAccess: SubscriptionAccess;
  modelConfig: ModelConfig;
  dailyProgress: DailyProgress;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Auth DTOs ---
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterProfileDto {
  firstName: string;
  lastName: string;
  nickName?: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  profile: RegisterProfileDto;
}

// --- Auth Responses ---
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  expiresAt: string;
}

export interface LogoutResponse {
  message: string;
}

export interface LogoutAllResponse {
  message: string;
  sessionsInvalidated: number;
}

export interface RefreshTokenResponse {
  message: string;
  token?: string;
  expiresAt?: string;
  success?: boolean;
}

// --- Auth State ---
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: string | null;
}

// --- Auth Error ---
export interface AuthError {
  message: string;
  statusCode?: number;
  error?: string;
}

// --- Session Storage Keys ---
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'wctraining_auth_token',
  USER: 'wctraining_auth_user',
  EXPIRES_AT: 'wctraining_auth_expires',
} as const;
