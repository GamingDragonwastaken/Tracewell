# Tracewell - Edge Cases

## Ingestion and extraction

- Empty fixture: case remains INGESTED with a clear missing-document state.
- Unsupported document type: finding states unsupported source and blocks verification.
- Duplicate document: content hash groups it as a duplicate; no double counting.
- Extractor timeout: field is unresolved and extractor status is visible.
- Malformed extractor JSON: contract error recorded with no field mutation.
- Low confidence field: review required even if no contradiction exists.

## Reconciliation

- Dates differ by timezone or format: normalize before comparing and retain originals.
- Amounts differ by currency or rounding: require compatible units; otherwise unresolved.
- Names vary in punctuation: normalized comparison may pass but source values remain visible.
- Identifier mismatch: critical finding; never auto-resolve.
- Document expires after extraction: case transitions to EXPIRED when freshness is evaluated.
- Contradiction rule version changes: preserve the original finding version and re-run explicitly.

## Review

- Double-click decision: idempotency key returns one review.
- Two reviewers act on the same finding: second action reports stale state and preserves both attempts.
- Reviewer rejects without reason: require a concise reason for high/critical findings.
- Case is closed while a review is pending: action is disabled and state is explained.

## Export

- Source artifact missing: export fails validation and points to the broken hash.
- Redaction removes all excerpt text: retain locator and explain redaction.
- Manifest hash mismatch: display invalid bundle, never verified.

