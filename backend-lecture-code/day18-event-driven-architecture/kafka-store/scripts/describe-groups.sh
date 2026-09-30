#!/bin/sh
# Every consumer group's position in every partition, from the terminal.
# CURRENT-OFFSET = the group's bookmark, LOG-END-OFFSET = the newest message,
# LAG = how far behind the group is.
#
#   npm run groups
docker exec day18-kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 \
  --describe --all-groups 2>/dev/null |
  awk 'NF && $1 != "Consumer" { print $1, $2, $3, $4, $5, $6 }' | column -t
