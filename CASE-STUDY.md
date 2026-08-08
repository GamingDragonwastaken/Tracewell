# Tracewell engineering case study

## The engineering question

How can a reviewer see whether a proposed field is backed by evidence, and stop
a document workflow from treating confidence as proof?

Tracewell is a **local, synthetic evidence-workspace prototype**. It resolves
that question with explicit document links, deterministic reconciliation rules,
and a review log. It neither processes real personal documents nor approves a
real-world case.

## The operating model

```text
Typed packet -> packet validation -> source-linked observations
  -> deterministic contradiction/freshness rules -> findings
  -> reviewer action -> append-only log -> redacted export manifest
```

The packet contract requires unique document IDs, non-empty source material,
valid required-field keys, confidence values in range, and observations that
reference an existing document. Invalid packets are rejected before
reconciliation.

## What happens when the evidence is uncertain

| Situation | Behaviour | Why it matters |
| --- | --- | --- |
| Two sources disagree | A finding opens and the case requires review. | The interface does not hide conflict behind one high-confidence value. |
| A reviewer accepts a contradiction | One of the linked sources must be selected explicitly. | The decision has a visible evidence basis. |
| A critical finding is rejected | The case becomes `REJECTED`. | Review decisions change the case state deterministically. |
| A source is expired | The case remains `EXPIRED`. | Stale evidence cannot be accepted into a verified result. |
| Packet evidence is dangling or duplicated | Validation rejects the packet. | Provenance links cannot silently point nowhere. |

## Evidence a reviewer can inspect

- Every field identifies its source document or is marked unresolved.
- Findings record a deterministic rule identifier, severity, state, and the
  source IDs on both sides of a contradiction.
- The decision log records reviewer actions, including refusals to accept stale
  material.
- The export is explicitly synthetic and includes source hashes, a rule-set
  reference, a review status, and default redaction metadata.

## Verification

`npm.cmd test` passed **7/7** on 2026-08-09. The suite covers source selection
for contradictory evidence, rejection, expiry, custom packets, import-time
contradictions, duplicate/dangling evidence, and expired-evidence acceptance.

## Deliberate limits and next steps

Tracewell is not a document-extraction service, a regulatory certification, or
an approval engine. A production implementation would need authenticated
storage, document-retention controls, data-subject protections, access logs,
human operating procedures, and domain-specific validation rules.
