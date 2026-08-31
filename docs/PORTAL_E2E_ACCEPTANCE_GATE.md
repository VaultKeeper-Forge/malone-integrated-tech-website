# Malone Client Portal End-to-End Acceptance Gate

Status: required before public Client Experience claims  
Prepared: 2026-08-31

## Purpose

Prove that the client-facing operating environment is reliable, tenant-isolated, understandable, and recoverable before the public website describes it as a live Malone client experience.

Passing component tests, schema checks, or owner-only authentication is necessary but not sufficient. This gate follows synthetic clients through the whole journey.

## Test population

Use two required synthetic organizations and one optional edge-case organization:

- **Client A:** normal project lifecycle
- **Client B:** simultaneous second tenant used to prove isolation
- **Client C:** incomplete invitation, revoked membership, missing-data, and recovery scenarios

Use controlled test email accounts and synthetic files only. Do not use real client data.

## Evidence contract

Every test run records:

- Exact source revision
- Exact environment and deployment identifier
- Test timestamp
- Synthetic account and tenant labels
- Expected result
- Actual result
- Pass, fail, or blocked status
- Non-secret screenshot or log receipt
- Defect reference when a step fails

A retry does not erase the first failure. The original failure and the successful remediation both remain in the report.

## Acceptance matrix

### 1. Provisioning and identity

- [ ] Owner can create or activate exactly one synthetic organization and project without duplicate records.
- [ ] Client invitation binds to the intended email and intended tenant.
- [ ] Invitation reuse, expiration, and invalid-recipient behavior are explicit and safe.
- [ ] Client can complete first sign-in and return through sign-out/re-login.
- [ ] Owner authentication reaches the required assurance level in the tested environment.
- [ ] Client and owner sessions expose only the navigation and actions allowed to their roles.
- [ ] Membership revocation removes access on the next enforced authorization check.

### 2. Tenant isolation

- [ ] Client A cannot enumerate, open, search, infer, or download Client B records.
- [ ] Client B cannot enumerate, open, search, infer, or download Client A records.
- [ ] Direct URLs, identifiers, API calls, filters, and stale browser state do not bypass tenant boundaries.
- [ ] Owner views preserve the active tenant/project boundary and clearly label context switches.
- [ ] Storage paths and signed download URLs enforce the same membership rules as database records.

Any cross-tenant exposure is a release-blocking failure.

### 3. Project lifecycle

- [ ] Client sees the correct project title, status, milestones, owners, and dates.
- [ ] Owner status changes appear to the intended client and nowhere else.
- [ ] Invalid transitions are rejected with a useful message.
- [ ] Empty projects and projects without milestones render an understandable state.
- [ ] Completed and archived states preserve the agreed read/download behavior.

### 4. Questionnaires, requests, and communication

- [ ] Client can open, save, resume, and submit a questionnaire or structured request.
- [ ] Required fields and validation failures preserve the client's work.
- [ ] Owner receives the submission in the correct project context.
- [ ] Client can distinguish drafts, submitted items, replies, and completed requests.
- [ ] Duplicate submission and interrupted-network behavior do not create silent conflicts.

### 5. Files and deliverables

- [ ] Allowed synthetic file types upload to the correct tenant and project.
- [ ] Disallowed size/type cases fail clearly without partial orphan records.
- [ ] Client can download an authorized deliverable and verify its name and contents.
- [ ] Client cannot replace, delete, or access files beyond the granted role.
- [ ] Revoked and expired download paths stop working as designed.
- [ ] Missing-file behavior does not expose storage internals or another tenant's information.

### 6. Assistant and structured context

This section must pass before the website says the assistant and portal use the same structured client context.

- [ ] Assistant retrieval is scoped to the active synthetic organization and project.
- [ ] Client A prompts cannot retrieve or infer Client B content.
- [ ] Project status, approved documents, and current questionnaire data agree across the portal and assistant surfaces.
- [ ] Missing, conflicting, superseded, and unapproved information produce visible uncertainty rather than invented certainty.
- [ ] Consequential actions require the intended approval and authorization boundary.
- [ ] The run records which source records supported each tested response or action.

### 7. Security posture

- [ ] Production-equivalent authentication requirements are verified for each role being marketed.
- [ ] MFA statements match what is actually enforced, not merely available.
- [ ] Hardware-key language is blocked until registration, recovery, and enforcement are tested on the applicable administrative accounts.
- [ ] Authorization failures do not reveal sensitive record existence or internal details.
- [ ] Sensitive values, credentials, tokens, recovery codes, and secrets do not appear in screenshots or logs.
- [ ] Session expiry, revoked sessions, and privilege changes behave predictably.

### 8. Failure and recovery

- [ ] Refreshing during each primary workflow does not lose committed state.
- [ ] Network interruption produces a visible retry/recovery path.
- [ ] Duplicate clicks and repeated requests are idempotent where duplication would be harmful.
- [ ] Missing records, malformed identifiers, and unavailable services render safe error states.
- [ ] A failed write does not display a false success state.
- [ ] Recovery steps preserve an audit trail rather than silently rewriting history.

### 9. Accessibility and device coverage

- [ ] Primary client and owner flows work with keyboard navigation.
- [ ] Focus order, visible focus, labels, validation messages, and status announcements are usable.
- [ ] Mobile layouts preserve project status, actions, forms, and downloads without horizontal overflow.
- [ ] Reduced-motion behavior remains usable.
- [ ] Supported browsers complete the same primary journey.

### 10. Exit, retention, and records

- [ ] Client access after project completion matches the written policy.
- [ ] Export/download behavior is clear before access is removed.
- [ ] Revocation and deletion actions preserve required business/security records without retaining unnecessary client access.
- [ ] The tested behavior agrees with the published privacy policy and client agreement language.

## Severity rules

| Severity | Meaning | Release effect |
|---|---|---|
| Critical | Cross-tenant exposure, authentication bypass, secret exposure, destructive corruption, or false authorization | Immediate stop; no public portal claim |
| High | Primary client workflow cannot complete, wrong project state, inaccessible deliverable, or unsafe failure behavior | Blocks release |
| Medium | Material confusion or workaround in a non-critical path | Must be resolved or explicitly accepted before launch |
| Low | Cosmetic or minor wording defect with no workflow, access, or data impact | May be scheduled with a documented owner |

## Gate decision

The Client Experience section may move from provisional to public only when:

- All critical and high-severity tests pass.
- No cross-tenant or authorization defect remains open.
- At least two synthetic organizations complete the primary journey.
- The exact production claims are written from test evidence.
- Synthetic screenshots are captured after the passing run.
- Legal/privacy wording matches the behavior tested.
- The final report identifies the exact verified revision and deployment.

## Public claims unlocked by a passing gate

Only the capabilities demonstrated by the passing evidence may be published. Examples may include:

- Clients can follow project status and milestones in a private workspace.
- Clients can complete requests, exchange approved files, and download deliverables in the correct project context.
- Role-based access keeps each client workspace separated.
- The assistant uses approved, tenant-scoped project context, if section 6 passes completely.
- MFA protects the named roles, if section 7 confirms enforcement in the production environment.

Hardware-key protection remains a separate claim until its own registration, enforcement, and recovery evidence exists.
