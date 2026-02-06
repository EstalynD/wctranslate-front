# ============================================
# WCTraining Frontend (Modelo) - Next.js 16
# Multi-stage Dockerfile optimizado para producción
# ============================================

# ---- Etapa base: imagen con pnpm ----
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

# Habilitar corepack para pnpm con versión fija
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# ---- Etapa de dependencias ----
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

# Instalar dependencias (sin cache mounts para compatibilidad CI/CD)
RUN pnpm install --frozen-lockfile

# ---- Etapa de build ----
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./

# Copiar configuraciones de build
COPY next.config.ts tsconfig.json postcss.config.js components.json ./

# Copiar código fuente
COPY app/ ./app/
COPY components/ ./components/
COPY lib/ ./lib/
COPY public/ ./public/

# Variables de entorno necesarias en build time
# Estas se pueden sobrescribir con --build-arg
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build de producción (genera standalone output automáticamente si está configurado)
RUN pnpm build

# ---- Etapa de producción ----
FROM node:22-alpine AS production

# Metadatos de la imagen
LABEL maintainer="WCTraining Team"
LABEL description="WCTraining Frontend - Plataforma Modelo"
LABEL version="0.1.0"

# Crear usuario no-root
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3555
ENV HOSTNAME="0.0.0.0"

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar build de Next.js
# Si standalone está habilitado, copiar solo lo necesario:
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./
COPY --from=builder --chown=nextjs:nextjs /app/next.config.ts ./

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3555

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3555 || exit 1

# Comando de inicio
CMD ["npx", "next", "start", "-p", "3555"]
