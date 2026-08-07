# Tracewell - Glossary

- case: a bounded packet of synthetic documents and required fields.
- document: a source artifact with identity, revision, checksum, and freshness.
- field: a normalized value extracted from one or more documents.
- source span: the location in a document supporting a field.
- evidence link: typed relationship between a field and a source span.
- finding: a rule result about contradiction, expiry, completeness, or quality.
- contradiction: two compatible fields whose values cannot both be accepted.
- expiry: state in which required evidence is outside its valid date window.
- unresolved: state where evidence is missing, ambiguous, or below confidence floor.
- review: explicit human action over a finding or field.
- decision log: append-only case state and reviewer history.
- rule version: immutable identifier for the deterministic logic that produced a finding.
- manifest: export index containing bundle contents, schema version, and hashes.

Avoid calling an extracted field a fact until a reviewer has accepted its evidence path.

