# Tracewell - UI/UX Brief

## Brand

Tracewell should feel like a calm evidence room: high trust, precise detail, and enough visual warmth to make review work sustainable. It is not a filing cabinet and not a surveillance dashboard.

## Palette

- canvas: #080B18
- panel: #11182A
- panel-raised: #17233A
- line: #2A3B5C
- text: #F6F8FF
- muted: #9AA8C2
- provenance-violet: #A78BFA
- linked-cyan: #58D5E6
- verified-mint: #8DE1B0
- contradiction-amber: #F7B955
- unresolved-coral: #FF7A78
- expired-bluegray: #7F91AA

## Type

- Display: Sora or equivalent for short case headings.
- Body: Inter or system sans.
- Evidence IDs and confidence: IBM Plex Mono or ui-monospace.
- Scale: 11, 12, 14, 16, 20, 28, 40, 52.

## Layout

- 8px base spacing.
- 1280px maximum evidence workspace.
- Three-region desktop layout: queue 28%, graph 42%, source/review 30%.
- Stack queue above source on mobile; selected field remains visible.
- Use sticky context header, not floating cards inside cards.

## Components

- CaseHeader: state, synthetic notice, freshness, and action.
- CoverageStrip: verified, unresolved, contradicted, expired.
- EvidenceGraph: source-to-field-to-rule links.
- ConflictRow: two values, rule, source references, and severity.
- SourceViewer: selected span with context and checksum.
- ReviewDecisionBar: accept, reject, request-more-evidence, defer.
- ProvenanceBadge: extractor, version, timestamp, confidence.
- ExportManifest: bundle contents, hashes, and verification result.

## Motion

- 150ms selection feedback.
- 300ms graph focus transition.
- One-time link draw when a field is selected.
- Contradiction pulse happens once on discovery, never loops.
- Reduced motion removes graph drawing and pulse effects.

## Imagery

Synthetic document snippets, redacted fields, and evidence links are the product imagery. No stock photography and no real identity documents.

## Anti-patterns

- No confidence meter without source coverage.
- No rainbow graph where every edge has a different color.
- No unreadable tiny evidence text.
- No nested cards for every field.
- No “AI verified” label without an explicit rule and source path.

