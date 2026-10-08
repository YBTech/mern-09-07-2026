# One image for the whole app: Express serves the API AND the built React files.
# The pipeline builds this once per commit, tags it with the commit ID, and deploys the
# SAME image to dev and then prod.

# ---- Stage 1: build. Has dev dependencies, TypeScript, Vite... none of it ships. ----
FROM node:22-alpine AS build
WORKDIR /app

# Dependency lists first: this slow step is cached until a package.json changes.
COPY api/package*.json api/
COPY web/package*.json web/
RUN npm ci --prefix api && npm ci --prefix web

# Then the source, then compile: api → api/dist, web → web/dist.
COPY api api
COPY web web
RUN npm run build --prefix api && npm run build --prefix web

# ---- Stage 2: runtime. Only what's needed to RUN the app. ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY api/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/api/dist ./dist
COPY --from=build /app/web/dist ./public

USER node
EXPOSE 3022
CMD ["node", "dist/server.js"]
