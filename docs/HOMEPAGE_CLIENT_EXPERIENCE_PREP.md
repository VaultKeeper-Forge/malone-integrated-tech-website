# Malone Homepage and Client Experience Prep

Status: prepared for review; no production publication authorized  
Prepared: 2026-08-31  
Website baseline: `bcce78deb071c53e7b55d26c58bb4d6f366a47c2`

## Objective

Make Malone Integrated Tech's real value understandable to a careful homeowner or small-business owner during the first minute, without presenting staging, planned, or partially tested portal capabilities as production facts.

The work is split into two release lanes:

1. **Ground the public site now.** Use plain customer outcomes, visible pricing, and the verified engagement process.
2. **Reveal the client operating environment after acceptance.** Publish portal language and synthetic screenshots only after the client workflow passes the gate in `PORTAL_E2E_ACCEPTANCE_GATE.md`.

## Verified baseline

- The live Services page at the PR #4 baseline publishes 14 primary offers and three care plans.
- The current unpublished Services draft adds **Local On-Site IT Support**, changes the total to 15 offers, and replaces **Rescue Session** with **Systems Troubleshooting Session**.
- The local support draft uses `$125 first hour`, `$60 per additional 30 minutes`, an appointment request flow, and a service-area/travel confirmation boundary.
- The homepage currently leads with integrated-assistant and systems-architecture language.
- Concrete Red Barons work is intentionally presented on the Projects page rather than the homepage.
- Staging owner authentication and authorization have verified foundations, but a complete multi-tenant client journey has not yet passed end-to-end acceptance.
- Supabase-to-assistant shared client context, complete client workflows, production MFA posture, and hardware-key administration must not be described as live until separately verified.

## Public claim ledger

### Approved now

- Malone publishes starting prices and bounded service scopes.
- Work begins from a written scope and uses visible checkpoints.
- Clients retain ownership of their accounts, domains, data, and approved final deliverables.
- Malone offers local, appointment-based on-site support in Amador County, Calaveras County, and nearby foothill communities.
- Malone builds websites, connected workflows, assistant systems, and private client-workspace solutions.
- Red Barons is active client work and a live work in progress, with its current public surface described precisely.

### Hold until the portal acceptance gate passes

- Malone clients currently use a live portal.
- All project messages, files, questionnaires, status, and deliverables already live in one production workspace.
- The client portal and assistant currently operate from the same verified tenant-scoped context.
- Production client access always enforces MFA.
- Administrative access is currently protected by a hardware security key.
- Portal screenshots represent a production-ready client journey.

### Do not use

- Completely secure, unhackable, foolproof, or zero-risk.
- Fully automated without human review.
- The assistant always remembers everything.
- Guaranteed outcome language not backed by a written client agreement.
- Any screenshot containing a real client's private data, credentials, addresses, messages, filenames, or identifiers.

## Homepage content direction

### First viewport

The first viewport should answer four questions immediately:

1. Who is this for?
2. What does Malone solve?
3. Can I see the services and prices?
4. What is the smallest next step?

Recommended copy:

**Eyebrow**  
Technology systems for homes and small businesses

**H1**  
Technology that works together—and keeps the work moving.

**Lead**  
Malone Integrated Tech solves local technology problems and builds connected websites, workflows, and assistant systems for people and small businesses.

**Support line**  
From an on-site support visit to a connected business system, we start with the smallest useful move and expand only when the next layer earns its place.

**Primary CTA**  
See services & starting prices → `/services`

**Secondary CTA**  
Request a fit check → `/contact`

**Principles**

- Clear scope
- Human approval
- Accounts you own

### Immediate service bridge

Place a compact three-path service bridge directly after the hero. Prices must be derived from `src/data/serviceData.ts` rather than duplicated in a second data source.

| Path | Public starting point | Customer meaning |
|---|---:|---|
| Local technology help | `$125 first hour` | Hands-on help for computers, printers, Wi-Fi, devices, accounts, backups, and setup. |
| Find the right first move | `Free` or `$250 Systems Map` | Define the problem before buying a larger build. |
| Build or connect the operation | `From $1,250` | Websites, forms, workflows, assistants, portals, and connected operating systems. |

CTA: **Compare all services and prices** → `/services`

### Customer-outcome section

Recommended heading:

**Less searching. Fewer broken handoffs. Clearer ownership.**

Recommended outcomes:

1. **Keep the work findable**  
   Organize the files, decisions, requests, and operating notes the work depends on.

2. **Make the tools pass information correctly**  
   Connect forms, calendars, email, websites, and approved automations around the workflow already in use.

3. **Keep people in control**  
   Use clear ownership, review points, and recovery paths instead of invisible automation.

These statements describe Malone's delivery method without claiming that the production portal is already live.

### How clients work with Malone

Use the client's point of view rather than architecture terminology.

1. **Tell us what is not working.**  
   Start with the immediate problem, the tools involved, and the useful outcome.

2. **See the boundary before work begins.**  
   Malone confirms the scope, starting price, responsibilities, and known third-party costs in writing.

3. **Review visible checkpoints.**  
   Consequential changes and scope expansion require clear review and approval.

4. **Own the result.**  
   Receive the approved deliverables, account ownership, and practical operating notes needed for handoff.

### Existing technical process

Keep Capture → Context → Tools → Action → Continuity, but place it after the customer-facing sections. Technical copy may remain available through the Malone Lens; the default first-minute journey should not require the visitor to translate terms such as versioned context or deterministic handoffs.

### Projects and proof

Do not restore the entire portfolio grid to the homepage. Add a compact proof route instead:

- Plain heading: **See current work and honest project status**
- One sentence explaining that live client work, pilots, and research are labeled separately.
- CTA: **View projects & proof** → `/projects`

The current Red Barons feature remains on the Projects page with its live-work-in-progress boundary intact.

### Research placement

Keep research visible, but place it after services, customer outcomes, working method, and proof. Research demonstrates depth; it should not be the visitor's first evidence that Malone can solve an ordinary business problem.

## Implementation map

| Surface | Intended work |
|---|---|
| `src/data/siteData.ts` | Replace default hero and capability wording with the approved customer-facing copy. Add structured homepage-path data only if needed. |
| `src/components/sections/HeroBanner.astro` | Route the primary CTA to Services and the secondary CTA to the fit-check intake. Preserve the existing visual system and accessibility. |
| `src/pages/index.astro` | Add the service bridge, customer outcomes, client working method, and compact Projects route in the agreed order. |
| `src/data/lensCopy.ts` | Keep technical/everyday variants synchronized with every changed public phrase. Do not leave stale source strings. |
| `src/styles/global.css` | Extend existing tokens and responsive rules; do not introduce a second visual language. |
| `tests/site.audit.spec.mjs` | Update the Services count to 15 and assert the new homepage CTA/copy contract. |
| `tests/active-client.spec.mjs` | Correct the stale homepage expectation because active client work now belongs on `/projects`. |
| Metadata and structured data | Update the homepage description to include local support and concrete small-business outcomes without claiming a live portal. |

## Phase-two client experience section

This section remains blocked until the portal acceptance gate passes.

Provisional heading:

**A clear place to follow the work.**

Provisional body:

Your project status, requests, decisions, files, and completed deliverables stay together in a controlled client workspace instead of being scattered across email threads and shared drives.

Required evidence before publication:

- Synthetic login screen
- Synthetic project/status view
- Synthetic questionnaire or request view
- Synthetic upload/download or deliverables view
- Verified role and tenant boundaries
- Verified production authentication statement
- Exact qualification for any assistant-context connection

All screenshots must use synthetic organizations, synthetic people, and synthetic files. Blur is not a substitute for removing real private data from the source capture.

## Release sequence

1. Review and approve the current Services wording and rate.
2. Publish the Services update as its own coherent change.
3. Implement and verify the grounded homepage pass without portal claims.
4. Complete the synthetic portal acceptance gate.
5. Write the final Client Experience copy from the evidence produced by that gate.
6. Add synthetic screenshots and publish the client-experience milestone.

## Definition of done for the homepage pass

- The first viewport states audience, concrete value, and service/pricing route.
- A visitor can reach Services, local appointment intake, Projects, and Contact without ambiguity.
- Homepage pricing comes from the canonical service catalog.
- Default copy is understandable without using the Malone Lens.
- Technical language remains available without dominating the first-minute journey.
- No staging or planned portal capability is phrased as a current production fact.
- Desktop and mobile builds have one H1, no overflow, no broken links, no broken images, and no console errors.
- Lint, static build, services verification, and the browser audit pass against the exact reviewed head.

