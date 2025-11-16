FROM node:20-alpine AS base

# 의존성 설치 스테이지
FROM base AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# 빌드 스테이지
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 환경 변수 (빌드 시)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Next.js 빌드
RUN npm run build

# 프로덕션 스테이지
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 프로덕션 의존성만 복사
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
