#!/bin/sh
# Rewind a consumer group to the start of a topic, so it re-reads every event.
# Stop the group's consumers first: Kafka won't move offsets while they run.
#
#   npm run reset-offsets -- analytics            (topic defaults to "orders")
#   npm run reset-offsets -- email demo
GROUP=${1:-analytics}
TOPIC=${2:-orders}

docker exec day18-kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --group "$GROUP" --topic "$TOPIC" \
  --reset-offsets --to-earliest --execute
