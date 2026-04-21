# Build Stage
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

RUN npm prune --production


# Run Stage
FROM node:22-alpine

WORKDIR /app

COPY package.json ./

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

COPY src/db/migrations ./dist/db/migrations

ARG PORT=8000
EXPOSE ${PORT}

CMD ["sh", "-c", "node dist/db/migrate.js && node dist/index.js"]
