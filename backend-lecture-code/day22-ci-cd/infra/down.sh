#!/usr/bin/env bash
# After the lecture: delete everything up.sh created, on AWS and in GitHub.
set -euo pipefail
cd "$(dirname "$0")"

terraform destroy -auto-approve

echo "▶ Removing the GitHub secrets and turning the deploy jobs off"
gh variable delete DAY22_CD_ENABLED || true
for name in DAY22_SSH_KEY DAY22_DEV_HOST DAY22_PROD_HOST; do
  gh secret delete "$name" || true
done

cat <<'EOF'

Done. The servers are gone; pushes will run CI only.
The Docker images stay in GitHub's registry (your profile → Packages → day22-ci-cd).
Delete that package there if you want the storage back.
EOF
