FROM node:20-alpine AS base
# Même version que packageManager dans le package.json racine.
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copier les fichiers workspace depuis la racine
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copier votre app
COPY packages ./packages
COPY apps/angeline.front ./apps/angeline.front

# Installer
RUN pnpm install --frozen-lockfile --filter=angeline.front...

# Build
WORKDIR /app/apps/angeline.front
RUN pnpm build

# Start
CMD ["pnpm", "start"]
