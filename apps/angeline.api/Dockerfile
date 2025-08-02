FROM node:20-alpine
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
COPY .env.prod ./.env

RUN pnpm run build

EXPOSE 5066

CMD ["pnpm", "run", "start"]