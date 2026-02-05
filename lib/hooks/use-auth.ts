"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts";

interface UseRequireAuthOptions {
  redirectTo?: string;
  allowedRoles?: string[];
}

/**
 * Hook para proteger rutas que requieren autenticación
 *
 * @param options - Opciones de configuración
 * @returns { isLoading, isAuthenticated, user }
 *
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   const { isLoading, isAuthenticated } = useRequireAuth();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!isAuthenticated) return null; // Redirigirá automáticamente
 *
 *   return <div>Contenido protegido</div>;
 * }
 * ```
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = "/login", allowedRoles } = options;
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Guardar la ruta actual para redirigir después del login
      if (typeof window !== "undefined" && pathname) {
        sessionStorage.setItem("auth_redirect", pathname);
      }
      router.push(redirectTo);
      return;
    }

    // Verificar roles si se especificaron
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
    }
  }, [isLoading, isAuthenticated, user, router, redirectTo, allowedRoles, pathname]);

  return {
    isLoading,
    isAuthenticated,
    user,
  };
}

/**
 * Hook para obtener la URL de redirección después del login
 *
 * @returns La URL guardada o el dashboard por defecto
 */
export function useAuthRedirect(): string {
  if (typeof window === "undefined") return "/dashboard";

  const savedRedirect = sessionStorage.getItem("auth_redirect");
  if (savedRedirect) {
    sessionStorage.removeItem("auth_redirect");
    return savedRedirect;
  }

  return "/dashboard";
}

/**
 * Hook para redirigir usuarios autenticados (para páginas de login/register)
 *
 * @param redirectTo - URL a la que redirigir si está autenticado
 */
export function useRedirectIfAuthenticated(redirectTo = "/dashboard") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isLoading, isAuthenticated };
}
