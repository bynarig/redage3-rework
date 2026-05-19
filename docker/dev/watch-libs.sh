#!/bin/sh
# Used by docker-compose.dev.yml `libs-watcher` service.
# Walks the project-reference graph starting from the gateway (which transitively
# references every lib + services/shared). Keeps writing fresh dist/ files into
# the bind-mounted folders so service containers see changes immediately.
set -e
cd /app
exec pnpm exec tsc -b \
  src/backend/libs/contracts \
  src/backend/libs/logger \
  src/backend/libs/service-runtime \
  src/backend/libs/kafka \
  src/backend/services/shared \
  src/backend/server/gateway \
  src/backend/services/auth \
  src/backend/services/player \
  --watch --preserveWatchOutput
