# AGENTS for Malone Integrated Tech website

## Scope
This repository is the local implementation surface for the Malone Integrated Tech website.

## Constraints
- Build locally only in this repository.
- Do not alter DNS, domain control, Google Workspace settings, or production credentials.
- Keep all Vault integrations abstracted behind a local adapter boundary until approved.
- Do not deploy to production during this phase.

## Quality objectives
- Use reusable components and tokenized design values.
- Preserve accessible semantics (keyboard, focus, and reduced-motion support).
- Keep performance lightweight; prefer static rendering and minimal hydration.
- Track verification with evidence (lint/typecheck/build commands and artifact checks).
