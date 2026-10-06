#!/usr/bin/env bash
# Before the lecture: create the dev + prod servers, then give GitHub what it needs to deploy.
# Run from anywhere inside the repo whose Actions should deploy (gh uses its git remote).
# Needs: terraform, the AWS CLI logged in (aws configure), and gh logged in (gh auth login).
set -euo pipefail
cd "$(dirname "$0")"

terraform init -input=false
terraform apply -auto-approve

DEV_HOST="$(terraform output -raw dev_host)"
PROD_HOST="$(terraform output -raw prod_host)"

echo "▶ Saving the server addresses and SSH key as GitHub secrets"
terraform output -raw ssh_private_key | gh secret set DAY22_SSH_KEY
gh secret set DAY22_DEV_HOST --body "$DEV_HOST"
gh secret set DAY22_PROD_HOST --body "$PROD_HOST"
gh variable set DAY22_CD_ENABLED --body true # turns on the deploy jobs in the workflows

echo "▶ Waiting for Docker to finish installing on both servers (1–3 minutes)"
key="$(mktemp)"
trap 'rm -f "$key"' EXIT
terraform output -raw ssh_private_key > "$key"
chmod 600 "$key"
for host in "$DEV_HOST" "$PROD_HOST"; do
  until ssh -i "$key" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR \
    -o ConnectTimeout=5 "ec2-user@$host" docker info > /dev/null 2>&1; do
    sleep 5
  done
  echo "  ✓ $host ready"
done

cat <<EOF

Done. Nothing is deployed yet: push a change to main (or Actions → Day 22 CI/CD → Run workflow).
  dev:  http://$DEV_HOST
  prod: http://$PROD_HOST
After the lecture: ./down.sh
EOF
