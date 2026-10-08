#!/usr/bin/env bash
# Deploy one image to one server, then check it's really running.
# Called by the GitHub Actions workflows. Dev and prod use this exact same script; only
# the server address and the APP_ENV label differ.
#
#   deploy.sh <environment> <image> <version>
#   e.g. deploy.sh dev ghcr.io/someone/day22-ci-cd:a1b2c3d a1b2c3d
#
# Expects these environment variables (the workflow sets them from GitHub secrets):
#   HOST        the server's IP address
#   SSH_KEY     the private key that lets us log in to it
#   GHCR_USER   + GHCR_TOKEN   credentials to pull the image from GitHub's container registry
set -euo pipefail

ENV_NAME="$1"
IMAGE="$2"
VERSION="$3"

key="$(mktemp)"
trap 'rm -f "$key"' EXIT
printf '%s\n' "$SSH_KEY" > "$key"
chmod 600 "$key"

echo "▶ Deploying $IMAGE to $ENV_NAME ($HOST)"

# Everything between the EOFs runs ON THE SERVER. The EOF is unquoted on purpose: $IMAGE,
# $VERSION etc. are filled in HERE, on the GitHub runner, before the script is sent over.
# shellcheck disable=SC2087
ssh -i "$key" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 "ec2-user@$HOST" bash -s <<EOF
set -euo pipefail
echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
docker pull "$IMAGE"

# Stop the old version, start the new one. Between these two lines the site is down for a
# second or two: zero-downtime strategies (rolling, blue/green) exist to remove that gap.
docker rm -f app 2>/dev/null || true
docker run -d --name app --restart unless-stopped -p 80:3022 \
  -e APP_ENV="$ENV_NAME" -e APP_VERSION="$VERSION" "$IMAGE"

docker logout ghcr.io
docker image prune -f > /dev/null   # remove old images so the disk doesn't fill up
EOF

# Smoke test: is the server up, and is it running the version we just deployed?
echo "▶ Smoke test: http://$HOST/version should report $VERSION"
for _ in $(seq 1 20); do
  if body="$(curl -fsS "http://$HOST/version" 2>/dev/null)"; then
    echo "  $body"
    if [[ "$body" == *"\"$VERSION\""* ]]; then
      echo "✓ $ENV_NAME is live at http://$HOST, running $VERSION"
      exit 0
    fi
  fi
  sleep 3
done

echo "✗ Smoke test failed: $ENV_NAME is not serving $VERSION"
exit 1
