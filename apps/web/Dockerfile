FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages packages
COPY apps/web apps/web
RUN npm ci && npm run build -w @ziyokor/shared && npm run build -w @ziyokor/web

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
