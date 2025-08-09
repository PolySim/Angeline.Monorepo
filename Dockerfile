FROM node:20-alpine

RUN apk add --no-cache python3 make g++ sqlite libc6-compat

RUN npm install -g pnpm

WORKDIR /app
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

# Copier le package.json de l'app
COPY apps/angeline.api/package.json ./
RUN pnpm install 

COPY apps/angeline.api/ ./

COPY apps/angeline.api/.env.prod ./.env

RUN mkdir -p /app/data && chmod 755 /app/data

RUN pnpm run build

EXPOSE 5066

CMD ["pnpm", "run", "start"]