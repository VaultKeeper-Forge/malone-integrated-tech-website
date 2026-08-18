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

## Architecture notes
- Contact form is currently a local/abstracted capture surface with a stubbed Vault envelope.
- Vault integration is intentionally not connected yet; payload helpers are provided for later adapter wiring.
- Motion system is scroll-reveal based with reduced-motion support.
