# Tracewell - Application Flow

## Sitemap

- / - case inbox
- /cases/:caseId - case overview and review queue
- /cases/:caseId/evidence - evidence graph and source panel
- /cases/:caseId/documents - document inventory and revision view
- /cases/:caseId/decision-log - reviewer decisions and timeline
- /policies - case profile and contradiction rules
- /about - methodology, limitations, and synthetic-data notice

## First-time journey

1. Open the inbox.
2. Select the seeded conflict case.
3. Review the case status and unresolved count.
4. Open a contradiction row.
5. Inspect the two source spans side by side.
6. Accept one field, reject one, and request-more-evidence on one.
7. View the updated case summary and decision log.
8. Export the evidence bundle and verify its manifest.

## Case states

- INGESTED: documents loaded, extraction pending.
- EXTRACTED: fields have typed source links.
- RECONCILING: contradiction rules running.
- REVIEW_REQUIRED: unresolved or contradictory evidence exists.
- VERIFIED: all required fields have an explicit accepted evidence path.
- REJECTED: reviewer rejected the case or a required rule failed.
- EXPIRED: required evidence passed its validity window.
- ERROR: extraction or storage contract failed; never shown as verified.

## Per-screen requirements

### Inbox

- Empty: no cases -> synthetic seed action and explanation.
- Loading: stable skeleton rows.
- Error: data-source error with retry and case-store health.
- Primary CTA: open the highest-risk review case, not a generic Create button.

### Case overview

- Header: case identity, synthetic-data badge, overall state, last updated.
- Summary: verified, unresolved, contradicted, expired counts.
- Review queue: ordered by risk and due state.
- Empty review queue: explicit verified state with evidence coverage.

### Evidence workspace

- Left: field and contradiction list.
- Center: source-linked evidence graph.
- Right: selected document span and reviewer action.
- Every field shows extractor version, confidence, source, and timestamp.

### Documents

- Inventory with checksum, type, revision, source label, and retention status.
- Side-by-side revision compare.
- Missing source state shows a broken link and blocks verification.

### Decision log

- Append-only reviewer actions with actor label, reason, and evidence references.
- Export status and manifest verification result.

## Global behavior

- Deep links preserve case and selected field.
- Reviewer actions are disabled when a case is VERIFIED or REJECTED unless an explicit reopen action exists.
- Network failure preserves the selected field and form state.
- Status colors always have text labels and icons.

