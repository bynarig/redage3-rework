#!/usr/bin/env bash
# Idempotent topic provisioning. Run after `pnpm infra:up`.
# Topics are also auto-created on gateway start; this script is for ops/CI.
set -euo pipefail

BROKER="${KAFKA_BROKER:-localhost:9092}"
CONTAINER="${KAFKA_CONTAINER:-redage-kafka}"

declare -a TOPICS=(
  "game.events.player:12"
  "game.events.vehicle:12"
  "game.events.inventory:12"
  "game.events.economy:6"
  "game.events.world:6"
  "game.commands.auth:6"
  "game.commands.player:12"
  "game.commands.inventory:12"
  "game.commands.economy:6"
  "game.replies.gateway:6"
)

for entry in "${TOPICS[@]}"; do
  topic="${entry%%:*}"
  parts="${entry##*:}"
  echo "ensuring $topic (partitions=$parts)"
  docker exec "$CONTAINER" /opt/kafka/bin/kafka-topics.sh \
    --bootstrap-server "$BROKER" \
    --create --if-not-exists \
    --topic "$topic" \
    --partitions "$parts" \
    --replication-factor 1
done

echo "done."
