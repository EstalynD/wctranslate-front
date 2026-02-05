import { httpClient, ApiError } from "./client";
import { apiConfig } from "./config";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  LogoutResponse,
  RefreshTokenResponse,
  User,
  AUTH_STORAGE_KEYS,
} from "../types";

/* ===== Storage Helpers ===== */
const storage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  },

  getExpiresAt: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_STORAGE_KEYS.EXPIRES_AT);
  },

  setExpiresAt: (expiresAt: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_STORAGE_KEYS.EXPIRES_AT, expiresAt);
  },

  removeExpiresAt: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEYS.EXPIRES_AT);
  },

  clearAll: (): void => {
    storage.removeToken();
    storage.removeUser();
    storage.removeExpiresAt();
  },
};

/* ===== Auth Service ===== */
export const authService = {
  /**
   * Almacenamiento de autenticación
   */
  storage,

  /**
   * Login - Inicia sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      apiConfig.endpoints.auth.login,
      credentials
    );

    // Almacenar datos de autenticación
    storage.setToken(response.token);
    storage.setUser(response.user);
    storage.setExpiresAt(response.expiresAt);

    return response;
  },

  /**
   * Register - Registra un nuevo usuario
   */
  async register(data: RegisterCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      apiConfig.endpoints.auth.register,
      data
    );

    // Almacenar datos de autenticación
    storage.setToken(response.token);
    storage.setUser(response.user);
    storage.setExpiresAt(response.expiresAt);

    return response;
  },

  /**
   * Logout - Cierra la sesión actual
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const response = await httpClient.post<LogoutResponse>(
        apiConfig.endpoints.auth.logout
      );
      return response;
    } finally {
      // Siempre limpiar el almacenamiento local
      storage.clearAll();
    }
  },

  /**
   * Logout All - Cierra todas las sesiones del usuario
   */
  async logoutAll(): Promise<{ message: string; sessionsInvalidated: number }> {
    try {
      const response = await httpClient.post<{
        message: string;
        sessionsInvalidated: number;
      }>(apiConfig.endpoints.auth.logoutAll);
      return response;
    } finally {
      storage.clearAll();
    }
  },

  /**
   * Refresh Token - Renueva el token de autenticación
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await httpClient.post<RefreshTokenResponse>(
      apiConfig.endpoints.auth.refresh
    );

    if (response.token && response.expiresAt) {
      storage.setToken(response.token);
      storage.setExpiresAt(response.expiresAt);
    }

    return response;
  },

  /**
   * Get Current User - Obtiene información del usuario actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get<{ user: User }>(
      apiConfig.endpoints.auth.me
    );

    // Actualizar usuario almacenado
    storage.setUser(response.user);

    return response.user;
  },

  /**
   * Validate Session - Valida si la sesión actual es válida
   */
  async validateSession(): Promise<{ isValid: boolean; user: User | null }> {
    const token = storage.getToken();

    if (!token) {
      return { isValid: false, user: null };
    }

    try {
      const user = await authService.getCurrentUser();
      return { isValid: true, user };
    } catch (error) {
      if (error instanceof ApiError) {
        // Token inválido o expirado
        if (error.status === 401) {
          storage.clearAll();
          return { isValid: false, user: null };
        }
      }
      throw error;
    }
  },

  /**
   * Is Token Expired - Verifica si el token ha expirado
   */
  isTokenExpired(): boolean {
    const expiresAt = storage.getExpiresAt();
    if (!expiresAt) return true;

    const expirationDate = new Date(expiresAt);
    const now = new Date();

    // Añadir margen de 5 minutos antes de la expiración
    const margin = 5 * 60 * 1000; // 5 minutos en ms
    return now.getTime() > expirationDate.getTime() - margin;
  },

  /**
   * Is Authenticated - Verifica si hay una sesión activa
   */
  isAuthenticated(): boolean {
    const token = storage.getToken();
    const user = storage.getUser();

    if (!token || !user) return false;
    if (authService.isTokenExpired()) {
      storage.clearAll();
      return false;
    }

    return true;
  },

  /**
   * Get Stored Auth - Obtiene los datos de autenticación almacenados
   */
  getStoredAuth(): {
    token: string | null;
    user: User | null;
    expiresAt: string | null;
  } {
    return {
      token: storage.getToken(),
      user: storage.getUser(),
      expiresAt: storage.getExpiresAt(),
    };
  },
};

// Re-export ApiError for convenience
export { ApiError };
