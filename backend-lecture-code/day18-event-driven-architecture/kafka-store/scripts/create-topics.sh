#!/bin/sh
# Topics are infrastructure: created once, on purpose, with a partition count
# chosen up front. Runs as part of `npm run infra:up`.
docker exec day18-kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create --if-not-exists --topic orders --partitions 3 --replication-factor 1
