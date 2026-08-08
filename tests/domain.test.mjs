import test from "node:test";
import assert from "node:assert/strict";
import { applyReview, findCase, parsePacket, reconcilePacket, summarizeCase, validatePacket } from "../src/domain.mjs";

test("conflicting owner evidence requires an explicit source selection", () => {
  const record = findCase("northline-ownership");
  assert.equal(record.status, "REVIEW_REQUIRED");
  assert.equal(summarizeCase(record).contradicted, 1);
  assert.equal(applyReview(record, "accept").status, "REVIEW_REQUIRED");
  const resolved = applyReview(record, "accept", "f-conflict-beneficial_owner", "registry");
  assert.equal(resolved.status, "VERIFIED");
  assert.equal(resolved.fields.find((field) => field.id === "beneficial_owner").value, "M. Alvarez");
});

test("rejecting a critical finding rejects the case", () => {
  const record = findCase("northline-ownership");
  const next = applyReview(record, "reject");
  assert.equal(next.status, "REJECTED");
  assert.equal(next.findings[0].state, "rejected");
});

test("expired evidence cannot be presented as verified", () => {
  const record = findCase("apex-expired");
  assert.equal(record.status, "EXPIRED");
  assert.equal(summarizeCase(record).expired, 1);
  assert.notEqual(applyReview(record, "request").status, "VERIFIED");
});

test("user-authored packet is reconciled from documents and observations", () => {
  const packet = parsePacket(JSON.stringify({
    id: "custom-packet",
    label: "Custom packet",
    requiredFields: ["owner"],
    documents: [{ id: "doc-a", label: "Source A", type: "TXT", excerpt: "Owner: Example", hash: "sha256:a" }],
    observations: [{ key: "owner", value: "Example", sourceId: "doc-a", confidence: 0.99, extractor: "fixture" }]
  }));
  assert.equal(validatePacket(packet).ok, true);
  assert.equal(reconcilePacket(packet).status, "VERIFIED");
});

test("imported contradictory observations require review", () => {
  const packet = {
    id: "conflict-packet",
    label: "Conflict packet",
    requiredFields: ["owner"],
    documents: [
      { id: "doc-a", label: "Source A", type: "TXT", excerpt: "Owner: A", hash: "sha256:a" },
      { id: "doc-b", label: "Source B", type: "TXT", excerpt: "Owner: B", hash: "sha256:b" }
    ],
    observations: [
      { key: "owner", value: "A", sourceId: "doc-a", confidence: 0.99, extractor: "fixture" },
      { key: "owner", value: "B", sourceId: "doc-b", confidence: 0.99, extractor: "fixture" }
    ]
  };
  const record = reconcilePacket(packet);
  assert.equal(record.status, "REVIEW_REQUIRED");
  assert.equal(record.findings.length, 1);
});

test("packet validation rejects duplicate documents and dangling evidence", () => {
  const result = validatePacket({
    id: "invalid-packet",
    label: "Invalid packet",
    requiredFields: ["owner", "owner"],
    documents: [
      { id: "doc-a", label: "Source A", type: "TXT", excerpt: "Owner: A", hash: "sha256:a" },
      { id: "doc-a", label: "Source B", type: "TXT", excerpt: "Owner: B", hash: "sha256:b" }
    ],
    observations: [{ key: "owner", value: "A", sourceId: "missing", confidence: 1 }]
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => error.includes("unique")));
  assert.ok(result.errors.some((error) => error.includes("must reference")));
});

test("expired evidence cannot be accepted as a route to verification", () => {
  const record = findCase("apex-expired");
  const next = applyReview(record, "accept", "f-expiry-certificate", "certificate");
  assert.equal(next.status, "EXPIRED");
  assert.equal(next.findings.find((finding) => finding.id === "f-expiry-certificate").state, "open");
});
