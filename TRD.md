# Tracewell - Technical Requirements

## Frontend

- Framework: React 19 with Vite.
- Styling: CSS Modules and semantic design tokens.
- Components: custom evidence workspace components; Lucide icons.
- State: TanStack Query for server state; local UI state with React state.
- Routing: React Router.
- Build: Vite.

## Backend

- Runtime: Node.js 22 LTS.
- Framework: Fastify.
- Validation: Zod.
- Extraction: deterministic fixture extractor by default; optional adapter interface for OCR/LLM extraction.
- Document parsing: plain text and fixture JSON in P0; PDF parser adapter only when it can run without weakening the demo.

## Storage

- SQLite for cases, documents, fields, contradictions, reviews, and decisions.
- Content-addressed local fixture store for synthetic source artifacts.
- JSON export bundle with a manifest and SHA-256 hashes.

## API surface

- GET /api/health
- GET /api/cases
- GET /api/cases/:caseId
- GET /api/cases/:caseId/evidence
- GET /api/cases/:caseId/reviews
- POST /api/cases/:caseId/reviews
- POST /api/cases/:caseId/reconcile
- GET /api/cases/:caseId/export

All mutation inputs are typed and state-transition checked. The local API is not represented as a hosted security boundary.

## Local development

- Node 22 LTS.
- Package manager: pnpm.
- Start: pnpm install, pnpm dev.
- Test: pnpm test.

## Performance budget

- Case workspace ready within two seconds for the seeded packet.
- Contradiction scan under one second for 1,000 extracted fields.
- Evidence graph interaction remains responsive at 500 nodes.
- Initial JavaScript under 250 KB gzipped.

## Browser support

Current Chrome, Edge, Firefox, and Safari releases; responsive baseline from 320px.

## Cost ceiling

Zero required monthly cost. Optional extraction providers are disabled by default and never required to run the seeded case.

