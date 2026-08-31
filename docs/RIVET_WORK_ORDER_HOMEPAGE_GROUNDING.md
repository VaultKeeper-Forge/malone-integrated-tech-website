# RIVET WORK ORDER — Malone Homepage Grounding Pass

Actor: RIVET  
Priority: Start next  
State: READY FOR IMPLEMENTATION  
Repository: `VaultKeeper-Forge/malone-integrated-tech-website`  
Starting branch: `feat/services-homepage-prep-20260831`  
Starting lineage: PR #4 head `bcce78deb071c53e7b55d26c58bb4d6f366a47c2`, plus the prepared local-support and planning checkpoints

## Mission

Implement the **grounded homepage pass only**.

Make the first minute of the Malone Integrated Tech homepage understandable to a homeowner or small-business owner without weakening the existing visual identity or technical credibility.

The homepage must quickly answer:

1. Who Malone helps
2. What Malone can solve
3. Where to see services and starting prices
4. What the smallest next step is

Do not build or market the Client Experience/portal section in this assignment. That section remains blocked behind the portal acceptance gate.

## Mandatory read order

1. `AGENTS.md`
2. `docs/HOMEPAGE_CLIENT_EXPERIENCE_PREP.md`
3. `docs/PORTAL_E2E_ACCEPTANCE_GATE.md`
4. `src/data/serviceData.ts`
5. `src/data/siteData.ts`
6. `src/components/sections/HeroBanner.astro`
7. `src/pages/index.astro`
8. `src/data/lensCopy.ts`
9. Existing homepage and audit tests

The two prep documents are the scope and truth boundary. Do not replace them with assumptions.

## Preserve exactly

- Current Malone visual identity, logo treatment, dark technical atmosphere, typography, navigation, footer, focus behavior, reduced-motion support, and lightweight static architecture
- Malone Lens and synchronized technical/everyday wording
- Current Projects-page placement of Red Barons active client work
- Services catalog changes already present on the starting branch
- Local On-Site IT Support name, price, appointment flow, service-area boundary, and travel approval language
- Systems Troubleshooting Session name and scope
- Existing contact routing behavior
- One public H1 per page
- Public/internal pricing boundary

## Required homepage work

### 1. Ground the hero

Use the approved direction from `HOMEPAGE_CLIENT_EXPERIENCE_PREP.md`:

- Eyebrow: `Technology systems for homes and small businesses`
- H1: `Technology that works together—and keeps the work moving.`
- Lead: `Malone Integrated Tech solves local technology problems and builds connected websites, workflows, and assistant systems for people and small businesses.`
- Support line: `From an on-site support visit to a connected business system, we start with the smallest useful move and expand only when the next layer earns its place.`
- Primary CTA: `See services & starting prices` → `/services`
- Secondary CTA: `Request a fit check` → `/contact`
- Principles: `Clear scope`, `Human approval`, `Accounts you own`

Preserve the existing calibration-mark visual. This is a copy and information-hierarchy change, not a hero redesign.

### 2. Add the immediate service bridge

Place a compact three-path section directly after the hero:

1. Local technology help
2. Find the right first move
3. Build or connect the operation

Use the content and customer meanings in the prep brief.

Important: derive displayed prices from `src/data/serviceData.ts`. Do not copy price strings into a second independent data source. The homepage must not drift when the Services catalog changes.

Include one route to `/services`: `Compare all services and prices`.

### 3. Add the customer-outcome bridge

Heading:

`Less searching. Fewer broken handoffs. Clearer ownership.`

Use the three approved outcomes:

- Keep the work findable
- Make the tools pass information correctly
- Keep people in control

Keep the language concrete. Do not introduce new portal claims.

### 4. Add “How clients work with Malone”

Use the four approved client-perspective steps:

1. Tell us what is not working.
2. See the boundary before work begins.
3. Review visible checkpoints.
4. Own the result.

This must describe the verified engagement method, not an unverified software interface.

### 5. Add a compact Projects route

Do not restore the Red Barons feature or full portfolio grid to the homepage.

Add a restrained bridge:

- Heading: `See current work and honest project status`
- Explain that live client work, pilots, and research are labeled separately.
- CTA: `View projects & proof` → `/projects`

### 6. Reorder existing technical depth

Keep the existing technical process and research content, but place customer-facing value, service routes, and working method ahead of them.

Capture → Context → Tools → Action → Continuity may remain intact below the customer-facing sections.

Research remains visible but should not be the first proof offered to a visitor with an ordinary technology or business problem.

### 7. Synchronize copy and metadata

- Update `src/data/lensCopy.ts` for every changed phrase so technical and everyday modes remain functional.
- Update the homepage title/description only as needed to include local support and concrete small-business outcomes.
- Preserve canonical, Open Graph, X/Twitter, robots, sitemap, and structured-data behavior.

### 8. Align tests

- Preserve the updated 15-offer Services contract.
- Preserve the appointment-specific intake test.
- Preserve the corrected Projects-only Red Barons expectation.
- Add assertions for the new hero copy and both hero routes.
- Add assertions that homepage price previews match the canonical service catalog.
- Add assertions that forbidden portal-production claims are absent.

## Explicitly out of scope

- Portal feature development
- Portal screenshots
- Supabase changes
- Authentication or MFA changes
- Hardware-key/YubiKey setup
- Contact backend deployment
- Services repricing or renaming
- Moving Red Barons back onto the homepage
- DNS, domain, Google Workspace, or production credential changes
- Merging or deploying without a separate owner instruction

## Claims forbidden in this pass

Do not state or imply that:

- The Malone client portal is currently live for clients
- All project messages, files, questionnaires, and deliverables already operate in one production workspace
- The assistant and portal currently share verified tenant-scoped context
- Production client access currently enforces MFA
- Administrative access is currently hardware-key protected
- Any system is completely secure, unhackable, fully autonomous, or guaranteed

## Verification gate

Run against the exact final head:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run verify:services`
5. Updated automated browser suite
6. Desktop visual acceptance at `1440×1000`
7. Mobile visual acceptance at `390×844`

Acceptance requires:

- One H1 per page
- All eight static pages generated
- 15 offers and three care plans
- Homepage prices derived from canonical service data
- Local appointment flow remains functional
- Desktop and mobile navigation remain functional
- No clipping or horizontal overflow
- No broken links or images
- No console errors or framework overlays
- No stale Lens substitutions
- No forbidden portal-production claims
- No internal pricing controls exposed

## Delivery contract

Return:

- Exact final commit SHA
- Changed-file list
- Concise explanation of homepage hierarchy changes
- Lint/build/services receipts
- Browser-test results
- Desktop and mobile screenshots
- Explicit confirmation that nothing was merged, published, deployed, repriced, or connected to production systems

Use a separate Rivet implementation branch based on `feat/services-homepage-prep-20260831`. Do not work directly on `main`.
