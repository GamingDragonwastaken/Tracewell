# Tracewell - Data Schema

## Entities

- Case: a bounded packet of synthetic documents and required fields.
- Document: a content-addressed source artifact.
- Field: an extracted value with a typed source span.
- EvidenceLink: relationship between a field and a document span.
- Rule: deterministic contradiction, expiry, or completeness rule.
- Finding: a rule result requiring no action, review, or rejection.
- Review: a human decision over a finding or field.
- DecisionLog: append-only record of reviewer actions and case state transitions.

## Case

- id: text primary key.
- profile_id: text not null.
- status: INGESTED, EXTRACTED, RECONCILING, REVIEW_REQUIRED, VERIFIED, REJECTED, EXPIRED, or ERROR.
- synthetic_label: boolean not null default true.
- required_fields_json: text not null.
- created_at, updated_at: timestamps not null.
- verified_at: timestamp nullable.

## Document

- id: text primary key.
- case_id: text not null, references cases.
- kind: text not null.
- source_label: text not null.
- revision: integer not null.
- content_hash: text not null.
- storage_path: text not null.
- issued_at: timestamp nullable.
- expires_at: timestamp nullable.
- created_at: timestamp not null.
- unique(case_id, source_label, revision).

## Field

- id: text primary key.
- case_id: text not null, references cases.
- key: text not null.
- normalized_value_json: text not null.
- display_value: text not null.
- extractor: text not null.
- extractor_version: text not null.
- confidence: real nullable between 0 and 1.
- state: proposed, accepted, rejected, unresolved.
- created_at, updated_at: timestamps not null.

## EvidenceLink

- id: text primary key.
- field_id: text not null, references fields.
- document_id: text not null, references documents.
- locator_json: text not null.
- excerpt_redacted: text not null.
- content_hash: text not null.
- created_at: timestamp not null.

## Finding

- id: text primary key.
- case_id: text not null, references cases.
- rule_id: text not null.
- severity: info, warning, high, or critical.
- state: open, accepted, rejected, deferred.
- field_ids_json: text not null.
- explanation: text not null.
- created_at, resolved_at: timestamps.

## Review and DecisionLog

- Review: id, case_id, finding_id nullable, field_id nullable, action, reason, reviewer_label, created_at.
- DecisionLog: id, case_id, from_state, to_state, review_id nullable, evidence_ids_json, created_at.

## Permission model

V1 is a local single-user lab. No hosted identity or multi-tenant data boundary is claimed. Case exports are local files and default to redacted excerpts.

