# Tracewell - Product Requirements

## Product vision

Tracewell is a local evidence consistency engine for consequential applications. It turns synthetic documents and extracted fields into a source-linked evidence graph, detects contradictions and expiry, and routes uncertainty to a human review queue instead of hiding it behind a confidence score.

## Primary persona

Jon is an operations lead reviewing vendor onboarding packets. He receives PDFs, spreadsheets, and forms from different sources and needs to know which facts agree, which are stale, and exactly where each conclusion came from. Today he compares files manually and cannot reconstruct why a case was accepted.

## Problem

Extraction alone is not trust. A field can be accurate in one document and contradicted by another, valid at upload but expired at decision time, or copied without a source trail. Reviewers need a compact, inspectable case record rather than a pile of files and a model-generated summary.

## Success metrics

- A reviewer can open a seeded case and identify every contradiction and expired item in under two minutes.
- Every extracted field shown in the UI links to at least one source span or is labelled unresolved.
- The seeded conflict scenarios route to REVIEW_REQUIRED and cannot be marked verified without an explicit reviewer decision.

Kill metric: if the system displays a high confidence result without a visible evidence path, it has failed.

## P0

- Synthetic case packet with PDF/text/table fixture documents.
- Document inventory with type, source, checksum, and retention state.
- Typed extraction contract for fields, spans, confidence, and extractor version.
- Evidence graph linking fields to source spans and related fields.
- Deterministic contradiction rules for dates, amounts, names, identifiers, and expiry.
- Review queue with accept, reject, request-more-evidence, and defer actions.
- Case summary showing verified, unresolved, contradicted, and expired counts.
- Exportable evidence bundle with provenance and decision log.

## P1

- Pluggable OCR/document extraction adapter.
- Policy profiles for different case types.
- Reviewer assignment, due dates, and service-level status.
- Compare revisions of a document and show changed evidence.
- Signed bundle manifest and verification command.
- Field-level comments and reviewer notes.

## P2

- Hosted multi-tenant case workspace.
- Connector ingestion from cloud drives and email.
- Human-in-the-loop queue routing and workload analytics.
- Active learning from reviewer corrections.
- External API and webhook integrations.

## Out of scope

- Real passports, identity documents, bank statements, or customer data.
- Automated approval of legal, financial, medical, immigration, or credit outcomes.
- A generic document management system.
- Sending data to a hosted model by default.
- Any claim of regulatory compliance without a separate assessment.

## Constraints

- Synthetic data only.
- Local-first, zero required paid API.
- Documents must be deliberately redacted or fictional.
- Two focused development cycles with a complete review vertical slice before extensions.
- UI must present provenance and uncertainty as first-class information.

## Open questions

- Should the demo domain be vendor onboarding, grant applications, or insurance claims?
- Which extraction adapter is optional enough to keep the deterministic showcase stable?
- Should contradiction rules be JSON policy files or TypeScript modules in v1?

