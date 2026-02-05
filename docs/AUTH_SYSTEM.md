# Sistema de Autenticación - WC Training Frontend

## Descripción

Sistema de autenticación completo integrado con el backend de WC Training. Incluye:

- **Contexto de autenticación** con estado global
- **Protección de rutas** automática
- **Gestión de sesiones** con refresh automático de tokens
- **Hooks personalizados** para usar en componentes

## Estructura de archivos

```
lib/
├── api/
│   ├── auth.service.ts    # Servicio de autenticación con API
│   ├── client.ts          # Cliente HTTP configurado
│   └── config.ts          # Configuración de endpoints
├── contexts/
│   └── auth.context.tsx   # Proveedor de autenticación React
├── hooks/
│   └── use-auth.ts        # Hooks de autenticación
└── types/
    └── auth.types.ts      # Tipos TypeScript
```

## Uso

### 1. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Usar el contexto de autenticación

El `AuthProvider` ya está configurado en el layout principal. Para acceder al estado de autenticación:

```tsx
import { useAuth } from "@/lib/contexts";

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Cargando...</div>;

  if (!isAuthenticated) {
    return <button onClick={() => login({ email, password })}>Login</button>;
  }

  return (
    <div>
      <p>Bienvenido, {user.profile.firstName}!</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

### 3. Proteger rutas

```tsx
import { useRequireAuth } from "@/lib/hooks";

function ProtectedPage() {
  const { isLoading, isAuthenticated, user } = useRequireAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null; // Redirige automáticamente

  return <div>Contenido protegido para {user?.profile.firstName}</div>;
}
```

### 4. Verificar roles

```tsx
import { useHasRole } from "@/lib/contexts";

function AdminSection() {
  const isAdmin = useHasRole("ADMIN");

  if (!isAdmin) return <div>Acceso denegado</div>;

  return <div>Panel de administración</div>;
}
```

## API del contexto

### Estado

| Propiedad         | Tipo                | Descripción                   |
| ----------------- | ------------------- | ----------------------------- |
| `user`            | `User \| null`      | Usuario autenticado           |
| `token`           | `string \| null`    | Token de sesión               |
| `isAuthenticated` | `boolean`           | Si hay sesión activa          |
| `isLoading`       | `boolean`           | Si está verificando sesión    |
| `expiresAt`       | `string \| null`    | Fecha de expiración del token |
| `error`           | `AuthError \| null` | Error de autenticación        |

### Acciones

| Método               | Descripción                 |
| -------------------- | --------------------------- |
| `login(credentials)` | Inicia sesión               |
| `register(data)`     | Registra nuevo usuario      |
| `logout()`           | Cierra sesión actual        |
| `logoutAll()`        | Cierra todas las sesiones   |
| `refreshSession()`   | Renueva el token            |
| `updateUser(user)`   | Actualiza datos del usuario |
| `clearError()`       | Limpia errores              |

## Hooks disponibles

- `useAuth()` - Contexto completo
- `useCurrentUser()` - Solo el usuario
- `useIsAuthenticated()` - Solo estado de autenticación
- `useHasRole(role)` - Verificar rol
- `useHasActiveSubscription()` - Verificar suscripción
- `useRequireAuth()` - Proteger componentes/páginas
- `useRedirectIfAuthenticated()` - Redirigir si autenticado

## Usuario Demo

Para crear un usuario de demostración, ejecuta en el backend:

```bash
cd wctraining-back
pnpm seed:demo-user
```

Credenciales por defecto:

- **Email:** `modelo.demo@wctraining.com`
- **Password:** `DemoUser123!`
