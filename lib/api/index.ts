// API Services - Centralized exports
export { httpClient, ApiError } from "./client";
export { apiConfig } from "./config";
export { authService } from "./auth.service";
export { modulesService } from "./modules";

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

