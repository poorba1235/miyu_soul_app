# ===== Base image =====
FROM oven/bun:1.2.23 AS base
WORKDIR /app

ENV NODE_ENV=production
ENV CI=true
ENV HF_HOME=/app/.cache/huggingface
ENV TRANSFORMERS_CACHE=/app/.cache/huggingface

# ===== Dependencies image =====
FROM base AS deps

# Install Git LFS for GLB files
RUN apt-get update && apt-get install -y git-lfs && git lfs install

# Copy package.json files for workspace install
COPY package.json bun.lock ./
COPY opensouls/package.json opensouls/
COPY opensouls/packages/core/package.json opensouls/packages/core/
COPY opensouls/packages/engine/package.json opensouls/packages/engine/
COPY opensouls/packages/soul/package.json opensouls/packages/soul/
COPY opensouls/packages/react/package.json opensouls/packages/react/
COPY opensouls/packages/pipeline/package.json opensouls/packages/pipeline/
COPY opensouls/packages/cli/package.json opensouls/packages/cli/
COPY opensouls/packages/soul-engine-cloud/package.json opensouls/packages/soul-engine-cloud/
COPY opensouls/packages/soul-engine-cloud/frozen-npm/soul-engine/ opensouls/packages/soul-engine-cloud/frozen-npm/soul-engine/
COPY packages/tanaki-speaks/package.json packages/tanaki-speaks/
COPY packages/tanaki-speaks-web/package.json packages/tanaki-speaks-web/

RUN bun install

# ===== Builder image =====
FROM deps AS builder
COPY . .

# Pull real LFS files for GLB
RUN git lfs pull

# Generate prisma client for soul-engine-cloud
WORKDIR /app/opensouls/packages/soul-engine-cloud
RUN bunx --bun prisma generate

# Warm HuggingFace model cache
RUN bun -e "import { pipeline } from '@huggingface/transformers'; await pipeline('feature-extraction', 'mixedbread-ai/mxbai-embed-xsmall-v1');"

# Build web frontend
WORKDIR /app/packages/tanaki-speaks-web
RUN bun run build

# ===== Runtime image =====
FROM base AS runner
WORKDIR /app

COPY --from=builder /app /app

# Ensure runtime data dirs exist
RUN mkdir -p /app/data /app/data/pglite

WORKDIR /app/packages/tanaki-speaks-web
EXPOSE 3002
EXPOSE 9091

CMD ["bash", "/app/packages/tanaki-speaks-web/start.sh"]
