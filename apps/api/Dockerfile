FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages packages
COPY apps/api apps/api
RUN npm ci && npm run build -w @ziyokor/shared && npm run build -w @ziyokor/api

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
