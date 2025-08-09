FROM node:20-alpine

# Installer les dépendances système nécessaires pour sqlite3
RUN apk add --no-cache python3 make g++ sqlite libc6-compat

# Installer pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copier les fichiers de configuration du monorepo depuis la racine
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copier le package.json de l'app
COPY apps/angeline.api/package.json ./

# Installer les dépendances
RUN pnpm install

# Copier tout le code source de l'app
COPY apps/angeline.api/ ./

# Build de l'application
RUN pnpm run build

# Créer le répertoire pour la base SQLite
RUN mkdir -p /app/data && chmod 755 /app/data

# Exposer le port
EXPOSE 5066

# Commande de démarrage
CMD ["pnpm", "run", "start"]