# Tracewell - Implementation Plan

## Phase 0 - scaffold

- Create the Vite/Fastify workspace.
- Add strict TypeScript, linting, formatting, and test runner.
- Add a blank inbox and health endpoint.
- Checkpoint: clean install, typecheck, test, and dev start.

## Phase 1 - fixture corpus

- Add three synthetic cases: clean, contradictory, and expired.
- Add deterministic text/table fixture documents and redacted excerpts.
- Add fixture reset command.
- Checkpoint: fixture loader validates hashes and required fields.

## Phase 2 - evidence kernel

- Implement Case, Document, Field, EvidenceLink, Finding, Review, and DecisionLog modules.
- Add typed field values and source locators.
- Checkpoint: schema and state-transition tests pass.

## Phase 3 - reconciliation

- Implement versioned rules for required fields, dates, amounts, identifiers, names, and expiry.
- Add deterministic finding generation and resolution guards.
- Checkpoint: seeded cases produce expected findings and no false VERIFIED state.

## Phase 4 - review workspace

- Build inbox, case header, coverage strip, conflict list, source viewer, evidence graph, and decision bar.
- Add loading, empty, error, stale-state, keyboard, mobile, and reduced-motion states.
- Checkpoint: browser tests cover clean, contradiction, expired, and review actions.

## Phase 5 - export and trust

- Implement redacted JSON/Markdown bundle.
- Add manifest and hash verification command.
- Add methodology and limitations panel.
- Checkpoint: invalid manifests fail visibly and valid manifests verify deterministically.

## Phase 6 - optional extraction adapter

- Define the adapter interface.
- Add a disabled provider stub that returns typed extraction or unavailable.
- Ensure provider failures leave case state unchanged.
- Checkpoint: deterministic fixture path remains the default and all tests remain green.

## Phase 7 - release

- Write README and architecture diagram.
- Capture a short reviewer path.
- Run security, dependency, type, unit, integration, and browser checks.
- Audit every README claim against fixture output.

