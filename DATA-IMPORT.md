# Tracewell data import

Tracewell accepts local JSON case packets. The packet is validated, reconciled against deterministic contradiction and freshness rules, and stored in the browser profile. No upload or remote extraction service is involved.

Required fields:

- `id`, `label`, and one or more `documents`.
- Each document needs `id`, `label`, `type`, `excerpt`, and `hash`.
- `observations` need `key`, `value`, `sourceId`, and a confidence from `0` to `1`.
- `requiredFields` is recommended for completeness checks.

Two observations with different normalized values create a visible finding. A document with an `expiresAt` earlier than the reconciliation date creates an expiry finding. Neither state can silently become verified.

`fixtures/custom-case.json` is a working import example. Exports are redacted JSON bundles with a manifest and rule-set version.
