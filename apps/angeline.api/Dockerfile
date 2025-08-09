FROM node:20-alpine

# Installer les dépendances système nécessaires pour sqlite3
RUN apk add --no-cache python3 make g++ sqlite libc6-compat

# Installer pnpm
RUN npm install -g pnpm

WORKDIR /app

# === APPROCHE MONOREPO COMPLÈTE ===
# Copier les fichiers de configuration du monorepo
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copier les package.json de toutes les apps pour que pnpm comprenne la structure
COPY apps/angeline.api/package.json ./apps/angeline.api/package.json

# Installer toutes les dépendances du monorepo
RUN pnpm install

# Copier tout le code source de l'app
COPY apps/angeline.api/ ./apps/angeline.api/

# Build de l'application depuis le bon répertoire
WORKDIR /app/apps/angeline.api
RUN pnpm run build

# Créer le répertoire pour la base SQLite
RUN mkdir -p /app/data && chmod 755 /app/data

# Exposer le port
EXPOSE 5066

# Commande de démarrage
CMD ["pnpm", "run", "start"]