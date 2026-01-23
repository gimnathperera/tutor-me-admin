# -----------------------
# Base image with corepack
# -----------------------
FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

# -----------------------
# Builder Stage
# -----------------------
FROM base AS builder

# Build-time arguments with safe defaults for Zod validation
ARG NEXT_PUBLIC_API_URL="https://tutorme-backend-api-d7a6cjdkgnedbxf0.southeastasia-01.azurewebsites.net"
ARG NEXT_PUBLIC_WHATSAPP_NUMBER="0713697366"

# Copy only package files first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Create an env file ONLY for build-time public variables
# These values get embedded in the NEXT.js client bundle
RUN printf "NEXT_PUBLIC_API_URL=%s\nNEXT_PUBLIC_WHATSAPP_NUMBER=%s\n" \
    "${NEXT_PUBLIC_API_URL}" "${NEXT_PUBLIC_WHATSAPP_NUMBER}" \
    > .env.production.local

# Build the Next.js application
RUN pnpm build

# -----------------------
# Runner Stage
# -----------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production build & runtime files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# NOTE:
# These sensitive server-side variables will be passed at runtime by Azure:
#   UPLOADTHING_TOKEN
#   AZURE_STORAGE_ACCOUNT_NAME
#   AZURE_STORAGE_ACCOUNT_KEY
#   AZURE_CONTAINER_NAME
#   AZURE_SAS_TOKEN
#
# They are NOT included in the image — SAFE for production.

EXPOSE 3000

CMD ["pnpm", "start"]
