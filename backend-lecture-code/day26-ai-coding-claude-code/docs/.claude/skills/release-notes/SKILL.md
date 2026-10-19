---
name: release-notes
description: Draft release notes from the git history since the last tag.
---

# Release notes

1. Find the range: `git describe --tags --abbrev=0`, or use the last 20 commits if there is no tag.
2. Run `git log <range> --oneline`.
3. Group commits under Features, Fixes, and Other. Skip merge commits and chores.
4. Write each item as one plain sentence a customer could understand.
5. Output markdown only.
