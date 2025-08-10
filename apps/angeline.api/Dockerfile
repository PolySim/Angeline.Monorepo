# Stage 1: Build
FROM node:20-alpine AS builder

# Installer pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/

# Copier les fichiers de l'API
COPY apps/angeline.api/package.json ./apps/angeline.api/
COPY apps/angeline.api/tsconfig.json ./apps/angeline.api/
COPY apps/angeline.api/tsconfig.build.json ./apps/angeline.api/
COPY apps/angeline.api/nest-cli.json ./apps/angeline.api/

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le code source de l'API
COPY apps/angeline.api/src/ ./apps/angeline.api/src/
COPY apps/angeline.api/.env.prod ./apps/angeline.api/.env

# Build l'application
RUN pnpm --filter angeline.api build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Copier les fichiers de configuration du monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copier le package.json de l'API
COPY apps/angeline.api/package.json ./apps/angeline.api/

# Copier les node_modules depuis le stage builder (avec toutes les dépendances)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/angeline.api/node_modules ./apps/angeline.api/node_modules

# Copier les fichiers buildés depuis le stage builder
COPY --from=builder /app/apps/angeline.api/dist ./apps/angeline.api/dist

# Copier le fichier .env
COPY --from=builder /app/apps/angeline.api/.env ./apps/angeline.api/.env

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Changer les permissions du répertoire de travail
RUN chown -R nestjs:nodejs /app

USER nestjs

# Exposer le port
EXPOSE 5066

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5066

WORKDIR /app/apps/angeline.api

# Commande de démarrage
CMD ["node", "dist/main"]
