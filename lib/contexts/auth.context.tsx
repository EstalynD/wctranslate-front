"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
} from "../types";
import { authService, ApiError } from "../api/auth.service";

/* ===== Context Types ===== */
interface AuthContextType extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (user: User) => void;

  // Error state
  error: AuthError | null;
  clearError: () => void;
}

/* ===== Default State ===== */
const defaultAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  expiresAt: null,
};

/* ===== Context ===== */
const AuthContext = createContext<AuthContextType | null>(null);

/* ===== Public Routes (no requieren autenticación) ===== */
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

/* ===== Provider Props ===== */
interface AuthProviderProps {
  children: ReactNode;
}

/* ===== Auth Provider ===== */
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Computed
  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle API errors
   */
  const handleApiError = useCallback((err: unknown): AuthError => {
    if (err instanceof ApiError) {
      const data = err.data as { message?: string; error?: string } | null;
      return {
        message: data?.message || err.statusText || "Error de autenticación",
        statusCode: err.status,
        error: data?.error,
      };
    }

    if (err instanceof Error) {
      return {
        message: err.message || "Error desconocido",
      };
    }

    return {
      message: "Error desconocido",
    };
  }, []);

  /**
   * Initialize auth state from storage
   */
  const initializeAuth = useCallback(async () => {
    try {
      const stored = authService.getStoredAuth();

      if (stored.token && stored.user) {
        // Verificar si el token no ha expirado
        if (!authService.isTokenExpired()) {
          setToken(stored.token);
          setUser(stored.user);
          setExpiresAt(stored.expiresAt);

          // Validar sesión con el servidor en background
          authService.validateSession().then(({ isValid, user: validUser }) => {
            if (!isValid) {
              setToken(null);
              setUser(null);
              setExpiresAt(null);
            } else if (validUser) {
              setUser(validUser);
            }
          }).catch(() => {
            // Silently fail - we already have cached data
          });
        } else {
          // Token expirado, limpiar storage
          authService.storage.clearAll();
        }
      }
    } catch (err) {
      console.error("Error initializing auth:", err);
      authService.storage.clearAll();
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      setToken(response.token);
      setUser(response.user);
      setExpiresAt(response.expiresAt);

      // Redirigir al dashboard
      router.push("/dashboard");
    } catch (err) {
      const authError = handleApiError(err);
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [router, handleApiError]);

  /**
   * Register
   */
  const register = useCallback(async (data: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);

      setToken(response.token);
      setUser(response.user);
      setExpiresAt(response.expiresAt);

      // Redirigir al dashboard home
      router.push("/dashboard/home");
    } catch (err) {
      const authError = handleApiError(err);
      setError(authError);
      throw authError;
    } finally {
      setIsLoading(false);
    }
  }, [router, handleApiError]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setToken(null);
      setUser(null);
      setExpiresAt(null);
      setIsLoading(false);
      router.push("/login");
    }
  }, [router]);

  /**
   * Logout from all devices
   */
  const logoutAll = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logoutAll();
    } catch (err) {
      console.error("Error during logout all:", err);
    } finally {
      setToken(null);
      setUser(null);
      setExpiresAt(null);
      setIsLoading(false);
      router.push("/login");
    }
  }, [router]);

  /**
   * Refresh session
   */
  const refreshSession = useCallback(async () => {
    try {
      const response = await authService.refreshToken();

      if (response.token && response.expiresAt) {
        setToken(response.token);
        setExpiresAt(response.expiresAt);
      }
    } catch (err) {
      console.error("Error refreshing session:", err);
      // Si falla el refresh, hacer logout
      await logout();
    }
  }, [logout]);

  /**
   * Update user
   */
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    authService.storage.setUser(updatedUser);
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Route protection
   */
  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
    const isRootRoute = pathname === "/";

    if (!isAuthenticated && !isPublicRoute && !isRootRoute) {
      // Redirigir a login si no está autenticado y no es ruta pública
      router.push("/login");
    } else if (isAuthenticated && isPublicRoute) {
      // Redirigir a dashboard si está autenticado y está en ruta pública
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  /**
   * Token refresh interval
   */
  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    // Calcular tiempo hasta la expiración menos 5 minutos
    const expirationTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const timeUntilRefresh = expirationTime - now - (5 * 60 * 1000); // 5 min antes

    if (timeUntilRefresh <= 0) {
      // Token ya expiró o está por expirar
      refreshSession();
      return;
    }

    const refreshTimer = setTimeout(() => {
      refreshSession();
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [isAuthenticated, expiresAt, refreshSession]);

  // Context value
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      expiresAt,
      error,
      login,
      register,
      logout,
      logoutAll,
      refreshSession,
      updateUser,
      clearError,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      expiresAt,
      error,
      login,
      register,
      logout,
      logoutAll,
      refreshSession,
      updateUser,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ===== Hook ===== */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/* ===== Utility Hooks ===== */

/**
 * Hook to get current user
 */
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated, isLoading } = useAuth();
  return !isLoading && isAuthenticated;
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role: string): boolean {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.role === role;
}

/**
 * Hook to check if user has active subscription
 */
export function useHasActiveSubscription(): boolean {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && !!user?.subscriptionAccess?.isActive;
}
