#!/usr/bin/env bash
set -euo pipefail

# --------------------------
# Environment variables
# --------------------------
export PORT="${PORT:-3002}"                      # Fly internal_port
export DEBUG_SERVER_PORT="${DEBUG_SERVER_PORT:-4000}"
export CODE_PATH="${CODE_PATH:-/app/data}"
export PGLITE_DATA_DIR="${PGLITE_DATA_DIR:-/app/data/pglite}"
export METRICS_PORT="${METRICS_PORT:-9091}"

# Ensure required directories exist
mkdir -p "${CODE_PATH}" "${PGLITE_DATA_DIR}"

# --------------------------
# Start Soul Engine (internal only)
# --------------------------
(
  cd /app/opensouls/packages/soul-engine-cloud
  echo "[boot] starting soul-engine on port ${DEBUG_SERVER_PORT}..."
  exec bun run scripts/run-server.ts "${CODE_PATH}"
) &

SOUL_ENGINE_PID=$!

# Give the engine a moment to boot
sleep 3

# --------------------------
# Register the Tanaki-Speaks blueprint
# --------------------------
(
  cd /app/packages/tanaki-speaks
  echo "[boot] registering tanaki-speaks blueprint..."
  
  CLI_PATH="/app/opensouls/packages/cli/bin/run.js"
  if [ ! -f "${CLI_PATH}" ]; then
    echo "[boot] ERROR: missing CLI at ${CLI_PATH}"
    ls -la /app/opensouls/packages/cli || true
    exit 1
  fi

  chmod +x "${CLI_PATH}" || true
  # Run local CLI to register blueprint
  "${CLI_PATH}" dev --once --noopen || bun "${CLI_PATH}" dev --once --noopen
)

# --------------------------
# Start Bun frontend server (public)
# --------------------------
cd /app/packages/tanaki-speaks-web
echo "[boot] starting frontend server on port ${PORT}..."
exec PORT="${PORT}" bun run ./bun-server.ts || {
  echo "[error] frontend failed to start"
  # Stop Soul Engine before exiting
  kill "${SOUL_ENGINE_PID}" || true
  exit 1
}

# --------------------------
# Graceful shutdown
# --------------------------
trap "echo '[shutdown] stopping soul-engine...'; kill ${SOUL_ENGINE_PID} || true" SIGINT SIGTERM
