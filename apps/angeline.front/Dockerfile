FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

# Copier les fichiers workspace depuis la racine
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copier votre app
COPY packages ./packages
COPY apps/angeline.front ./apps/angeline.front

# Installer
RUN pnpm install --filter=angeline.front...

# Build
WORKDIR /app/apps/angeline.front
RUN pnpm build

# Start
CMD ["pnpm", "start"]
