# AGENTS for Malone Integrated Tech website

## Scope
This repository contains the static Malone Integrated Tech website and source for its separately deployed contact backend.

## Constraints
- Prepare and verify changes in an isolated checkout or worktree of this repository; preserve unrelated pending work.
- Do not alter DNS, domain control, Google Workspace settings, or production credentials.
- Keep all Vault integrations abstracted behind a local adapter boundary until approved.
- Obtain explicit owner approval for the concrete production release before merging to `main` or manually dispatching the Pages workflow. Every push to `main`, including a documentation-only merge, triggers static-site deployment.
- A branch push or pull request is preparation, not production-release approval. Approval applies only to its stated scope; do not infer approval for unrelated releases.
- Apps Script deployment requires separate explicit owner approval; the Pages workflow does not publish backend source. Verify frontend and backend releases independently.
- Keep meeting requests disabled unless a separately approved release covers the required code, configuration, and acceptance checks.
- Keep operational configuration, recipient details, acceptance records, and rollback instructions in private owner documentation. Do not commit private backups, credentials, or authorization material.

## Quality objectives
- Use reusable components and tokenized design values.
- Preserve accessible semantics (keyboard, focus, and reduced-motion support).
- Keep performance lightweight; prefer static rendering and minimal hydration.
- Track verification with evidence (lint/typecheck/build commands and artifact checks).
