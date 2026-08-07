# Tracewell - Non-Functional Requirements

## Reliability

- Missing or unparseable extraction is unresolved, never accepted by default.
- Contradiction rules are deterministic and versioned.
- Every finding references the fields and source links that caused it.
- A case cannot reach VERIFIED while a required field is unresolved or a critical finding is open.
- Export validates the manifest before reporting success.

## Security

- Synthetic data only, with synthetic-data banners in the UI and exports.
- No upload endpoint in v1; fixtures are local and checked into the test harness.
- Path traversal and oversized fixture names are rejected.
- Exported excerpts are redacted by default.
- Optional provider adapters are off by default and cannot mutate case state without a typed result.

## Privacy

- Default local retention: 30 days.
- Clear-case operation removes source artifacts, fields, findings, reviews, logs, and exports.
- No analytics or remote fonts in the operator workspace.

## Accessibility

- WCAG AA contrast and visible focus.
- Keyboard review actions and predictable tab order.
- Screen-reader labels for graph links and status.
- Reduced-motion mode.

## Observability

- Structured logs with case ID, field ID, finding ID, and rule version.
- Decision log is append-only.
- Export manifest includes schema version and rule-set version.

## Performance

- Seeded case opens in under two seconds.
- Reconciliation under one second for 1,000 fields and 100 rules.
- Graph remains usable at 500 nodes through clustering and focus mode.
- Export under five seconds for a seeded case.

