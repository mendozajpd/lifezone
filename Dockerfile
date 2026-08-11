FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/* \
    && chown node:node /app
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci

FROM base AS dev
COPY --chown=node:node . .
EXPOSE 8081 19000 19001 19002
CMD ["npx", "expo", "start", "--web", "--host", "lan"]

FROM base AS build
COPY --chown=node:node . .
RUN npx expo export -p web

FROM node:22-bookworm-slim AS prod
WORKDIR /app
RUN npm install -g serve && chown node:node /app
USER node
COPY --from=build --chown=node:node /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
