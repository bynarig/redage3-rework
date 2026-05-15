#!/bin/sh
# Used by docker-compose.dev.yml `libs-watcher` service.
# Walks the project-reference graph starting from the gateway (which transitively
# references every lib + services/shared). Keeps writing fresh dist/ files into
# the bind-mounted folders so service containers see changes immediately.
set -e
cd /app
exec pnpm exec tsc -b \
  libs/contracts \
  libs/logger \
  libs/service-runtime \
  libs/kafka \
  services/shared \
  server/gateway \
  services/auth \
  services/player \
  --watch --preserveWatchOutput
