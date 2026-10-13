# Malone Integrated Tech Website

## Stack
- Astro
- TypeScript
- Tailwind CSS
- JavaScript for lightweight interaction

## Run
- `npm run dev` - local dev server
- `npm run lint` - static type + content diagnostics
- `npm run typecheck` - alias to `astro check`
- `npm run build` - static production build

## Structure
- `src/pages` - routes: `/`, `/projects`, `/research`, `/services`, `/contact`
- `src/components` - reusable UI primitives and sections
- `src/lib` - analytics stub + Vault adapter stub
- `src/data/siteData.ts` - copy and structured content source
- `contact-backend` - source and tests for the separately deployed contact backend

## Architecture notes
- The production contact form uses a separately deployed Google Apps Script backend for validated inquiries and owner notifications. Endpoint configuration or a browser receipt alone does not prove delivery to an inbox.
- The website's Vault adapter in `src/lib/vault.ts` remains unconnected and returns local data and a stubbed contact envelope. It is distinct from the deployed contact backend.
- Meeting requests remain disabled in the frontend and default to disabled in the backend. Enabling them requires a separately approved release.
- Motion system is scroll-reveal based with reduced-motion support.

## Releases

The GitHub Pages workflow publishes pushes to `main`, including documentation-only merges. It also supports manual dispatch from `main`. Obtain explicit owner approval for the concrete release before merging or dispatching; a branch push or pull request does not publish the site.

GitHub Pages publishes the static frontend only. Apps Script source requires a separate, explicitly approved backend deployment. See [contact-backend/README.md](contact-backend/README.md) for the public backend overview. Keep deployment configuration, acceptance records, and rollback instructions in private owner documentation.
