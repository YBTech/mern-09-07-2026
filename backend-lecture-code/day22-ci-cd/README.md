# Day 22: CI/CD demo

## 0. One time only: install the workflows

GitHub only runs workflows from the repo root. From the repo root:

```bash
mkdir -p .github/workflows
cp backend-lecture-code/day22-ci-cd/.github/workflows/*.yml .github/workflows/
git add .github && git commit -m "Add day 22 workflows" && git push
```

## 1. Create the servers (before class)

Needs `aws configure` and `gh auth login` done once.

```bash
backend-lecture-code/day22-ci-cd/infra/up.sh
```

Creates a **dev** and a **prod** server on AWS (~3 min) and prints both URLs.

## 2. Push code → CI

Push any change under `backend-lecture-code/day22-ci-cd/` on a branch.

→ **Actions** tab: tests and builds run. Nothing is deployed from a branch.

## 3. Merge to `main` → deploys to dev automatically

→ Actions: tests → build Docker image → **deploy to dev**.

Open the dev URL. The footer shows the version it is running (the first 7 characters of the commit ID).

## 4. Release to prod (the "approve" step)

Open the finished dev run: its summary has a **Release to prod** link and the version to use.
Or: **Actions** → **Day 22 Release to prod** (left sidebar) → **Run workflow** → enter the version
**from the dev footer** (not an example value: it must be a version dev actually built) → **Run workflow**.

→ The same image goes to prod. Open the prod URL to check.

**Rollback:** do the same with an older version.

## 5. Tear down (after class)

```bash
backend-lecture-code/day22-ci-cd/infra/down.sh
```

Deletes both servers and the GitHub secrets. Pushes go back to CI only.
