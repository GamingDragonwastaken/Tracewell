const DEFAULT_NOW = "2026-08-07T00:00:00.000Z";

const rawBuiltins = [
  {
    id: "northline-ownership",
    label: "Northline Systems / ownership packet",
    profile: "vendor-onboarding",
    documents: [
      { id: "registry", label: "Corporate registry extract", type: "PDF", revision: 2, excerpt: "Registered owner: M. Alvarez\nJurisdiction: Canada\nRegistry reference: NL-2048", hash: "sha256:7d9e...2c4a" },
      { id: "declaration", label: "Signed ownership declaration", type: "FORM", revision: 1, excerpt: "Beneficial owner: M. Alvarado\nDeclared on: 2026-08-01\nSignature: redacted", hash: "sha256:98ae...1140" },
      { id: "certificate", label: "Incorporation certificate", type: "PDF", revision: 1, excerpt: "Incorporated: Canada\nRenewal date: 2027-04-18", hash: "sha256:bd31...e210" }
    ],
    requiredFields: ["beneficial_owner", "incorporation_country", "renewal_date"],
    observations: [
      { key: "beneficial_owner", label: "Beneficial owner", value: "M. Alvarez", sourceId: "registry", confidence: 0.71, extractor: "fixture-extractor 0.4" },
      { key: "beneficial_owner", label: "Beneficial owner", value: "M. Alvarado", sourceId: "declaration", confidence: 0.72, extractor: "fixture-extractor 0.4" },
      { key: "incorporation_country", label: "Incorporation country", value: "Canada", sourceId: "registry", confidence: 0.99, extractor: "fixture-extractor 0.4" },
      { key: "renewal_date", label: "Renewal date", value: "2027-04-18", sourceId: "certificate", confidence: 0.95, extractor: "fixture-extractor 0.4" }
    ],
    log: [{ at: "08:42", actor: "extractor", action: "Fields proposed", detail: "3 fields / 4 evidence links" }, { at: "08:42", actor: "rule-engine", action: "Critical finding opened", detail: "identifier-exact-v2" }]
  },
  {
    id: "harbor-supply",
    label: "Harbor Supply / clean packet",
    profile: "vendor-onboarding",
    documents: [
      { id: "registry", label: "Corporate registry extract", type: "PDF", revision: 1, excerpt: "Registered owner: R. Chen\nJurisdiction: Singapore", hash: "sha256:0a81...9c22" },
      { id: "certificate", label: "Incorporation certificate", type: "PDF", revision: 1, excerpt: "Renewal date: 2027-09-02", hash: "sha256:3c10...f77a" }
    ],
    requiredFields: ["beneficial_owner", "incorporation_country", "renewal_date"],
    observations: [
      { key: "beneficial_owner", label: "Beneficial owner", value: "R. Chen", sourceId: "registry", confidence: 0.98, extractor: "fixture-extractor 0.4" },
      { key: "incorporation_country", label: "Incorporation country", value: "Singapore", sourceId: "registry", confidence: 0.99, extractor: "fixture-extractor 0.4" },
      { key: "renewal_date", label: "Renewal date", value: "2027-09-02", sourceId: "certificate", confidence: 0.97, extractor: "fixture-extractor 0.4" }
    ],
    log: [{ at: "08:19", actor: "rule-engine", action: "Case verified", detail: "All required evidence paths accepted" }]
  },
  {
    id: "apex-expired",
    label: "Apex Fieldworks / expired certificate",
    profile: "vendor-onboarding",
    documents: [
      { id: "registry", label: "Corporate registry extract", type: "PDF", revision: 1, excerpt: "Registered owner: S. Okafor\nJurisdiction: Ghana", hash: "sha256:dd91...aa21" },
      { id: "certificate", label: "Incorporation certificate", type: "PDF", revision: 1, excerpt: "Renewal date: 2026-06-11\nValidity: expired at review time", hash: "sha256:912e...10bc", expiresAt: "2026-06-11T00:00:00.000Z" }
    ],
    requiredFields: ["beneficial_owner", "incorporation_country", "renewal_date"],
    observations: [
      { key: "beneficial_owner", label: "Beneficial owner", value: "S. Okafor", sourceId: "registry", confidence: 0.93, extractor: "fixture-extractor 0.4" },
      { key: "incorporation_country", label: "Incorporation country", value: "Ghana", sourceId: "registry", confidence: 0.99, extractor: "fixture-extractor 0.4" },
      { key: "renewal_date", label: "Renewal date", value: "2026-06-11", sourceId: "certificate", confidence: 0.96, extractor: "fixture-extractor 0.4" }
    ],
    log: [{ at: "07:58", actor: "rule-engine", action: "Freshness finding opened", detail: "freshness-window-v1" }]
  }
];

const keyLabel = (key) => key.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
const normalize = (value) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const validId = (id) => /^[a-z0-9][a-z0-9-]{2,48}$/.test(String(id ?? ""));
const validFieldKey = (key) => /^[a-z][a-z0-9_]{1,64}$/.test(String(key ?? ""));

export function validatePacket(input) {
  const errors = [];
  if (!input || typeof input !== "object") errors.push("Case packet must be an object.");
  if (!validId(input?.id)) errors.push("id must use lowercase letters, numbers, and hyphens.");
  if (!String(input?.label ?? "").trim()) errors.push("label is required.");
  if (!Array.isArray(input?.documents) || input.documents.length === 0) errors.push("at least one document is required.");
  if (!Array.isArray(input?.observations) || input.observations.length === 0) errors.push("at least one extracted observation is required.");
  if (input?.requiredFields !== undefined && (!Array.isArray(input.requiredFields) || input.requiredFields.length === 0)) errors.push("requiredFields must be a non-empty list when provided.");
  const documentIds = new Set();
  for (const [index, document] of (input?.documents ?? []).entries()) {
    if (!validId(document?.id)) errors.push(`documents[${index}].id must use lowercase letters, numbers, and hyphens.`);
    else if (documentIds.has(document.id)) errors.push(`documents[${index}].id must be unique.`);
    else documentIds.add(document.id);
    if (!String(document?.label ?? "").trim()) errors.push(`documents[${index}].label is required.`);
    if (!String(document?.type ?? "").trim()) errors.push(`documents[${index}].type is required.`);
    if (!String(document?.excerpt ?? "").trim()) errors.push(`documents[${index}].excerpt is required.`);
    if (!String(document?.hash ?? "").trim()) errors.push(`documents[${index}].hash is required.`);
    if (document?.expiresAt && Number.isNaN(new Date(document.expiresAt).getTime())) errors.push(`documents[${index}].expiresAt must be an ISO-compatible date.`);
  }
  const fieldKeys = new Set();
  for (const [index, key] of (input?.requiredFields ?? []).entries()) {
    if (!validFieldKey(key)) errors.push(`requiredFields[${index}] must use lowercase letters, numbers, and underscores.`);
    else if (fieldKeys.has(key)) errors.push(`requiredFields[${index}] must be unique.`);
    else fieldKeys.add(key);
  }
  for (const [index, observation] of (input?.observations ?? []).entries()) {
    if (!validFieldKey(observation?.key)) errors.push(`observations[${index}].key must use lowercase letters, numbers, and underscores.`);
    if (!String(observation?.value ?? "").trim()) errors.push(`observations[${index}].value is required.`);
    if (!documentIds.has(observation?.sourceId)) errors.push(`observations[${index}].sourceId must reference a document.`);
    if (!Number.isFinite(Number(observation?.confidence)) || Number(observation?.confidence) < 0 || Number(observation?.confidence) > 1) errors.push(`observations[${index}].confidence must be between 0 and 1.`);
  }
  return { ok: errors.length === 0, errors };
}

export function parsePacket(text) {
  let parsed;
  try { parsed = JSON.parse(text); } catch (error) { throw new Error(`Invalid JSON: ${error.message}`); }
  const result = validatePacket(parsed);
  if (!result.ok) throw new Error(result.errors.join(" "));
  return structuredClone(parsed);
}

export function reconcilePacket(packet, { now = DEFAULT_NOW } = {}) {
  const result = validatePacket(packet);
  if (!result.ok) throw new Error(result.errors.join(" "));
  const documents = packet.documents.map((document) => ({ ...document, sourceLabel: document.label }));
  const groups = new Map();
  for (const observation of packet.observations) {
    if (!groups.has(observation.key)) groups.set(observation.key, []);
    groups.get(observation.key).push(observation);
  }
  const fields = [];
  const findings = [];
  for (const key of [...new Set([...(packet.requiredFields ?? []), ...groups.keys()])]) {
    const values = groups.get(key) ?? [];
    const unique = [...new Set(values.map((item) => normalize(item.value)).filter(Boolean))];
    const primary = values[0];
    fields.push({ id: key, key, label: primary?.label ?? keyLabel(key), value: primary?.value ?? "Missing", state: values.length === 1 && Number(primary.confidence) >= 0.9 ? "accepted" : "unresolved", confidence: primary?.confidence ?? 0, extractor: primary?.extractor ?? "unavailable", sourceId: primary?.sourceId ?? null, values: values.map((item) => ({ value: item.value, sourceId: item.sourceId, confidence: item.confidence })) });
    if (values.length === 0 && (packet.requiredFields ?? []).includes(key)) findings.push({ id: `f-missing-${key}`, field: key, rule: "required-field-v1", severity: "critical", state: "open", explanation: `Required field ${keyLabel(key)} has no extracted evidence.`, left: null, right: null });
    if (unique.length > 1) {
      const highRisk = key.includes("identifier") || key.includes("owner") || key.includes("account");
      findings.push({ id: `f-conflict-${key}`, field: key, rule: highRisk ? "identifier-exact-v2" : "value-consistency-v1", severity: highRisk ? "critical" : "warning", state: "open", explanation: `Two source spans disagree on ${keyLabel(key)}.`, left: values[0]?.sourceId ?? null, right: values[1]?.sourceId ?? null });
    }
  }
  for (const document of documents) {
    if (document.expiresAt && new Date(document.expiresAt) < new Date(now)) {
      const field = packet.observations.find((item) => item.sourceId === document.id)?.key ?? "document";
      findings.push({ id: `f-expiry-${document.id}`, field, rule: "freshness-window-v1", severity: "high", state: "open", explanation: `${document.label} is outside its validity window.`, left: document.id, right: document.id });
    }
  }
  const hasExpiry = findings.some((item) => item.rule === "freshness-window-v1" && item.state === "open");
  const status = findings.length ? (hasExpiry ? "EXPIRED" : "REVIEW_REQUIRED") : "VERIFIED";
  return { id: packet.id, label: packet.label, profile: packet.profile ?? "custom", status, updated: "just now", sourceCount: documents.length, requiredFields: packet.requiredFields ?? [...groups.keys()], documents, sources: documents, fields, findings, log: packet.log ?? [{ at: "now", actor: "rule-engine", action: "Case reconciled", detail: `${fields.length} fields / ${findings.length} findings` }], packet };
}

export function summarizeCase(record) {
  return {
    verified: record.fields.filter((field) => field.state === "accepted").length,
    unresolved: record.fields.filter((field) => field.state === "unresolved" || field.state === "proposed").length,
    contradicted: record.findings.filter((item) => item.state === "open" && (item.rule.includes("consistency") || item.rule.includes("identifier"))).length,
    expired: record.findings.filter((item) => item.rule.includes("freshness") && item.state === "open").length
  };
}

function refreshStatus(record) {
  if (record.findings.some((item) => item.state === "rejected")) return "REJECTED";
  if (record.findings.some((item) => item.rule === "freshness-window-v1" && ["open", "deferred", "accepted"].includes(item.state))) return "EXPIRED";
  if (record.findings.some((item) => item.state === "open")) return "REVIEW_REQUIRED";
  const allRequiredAccepted = record.fields
    .filter((item) => record.requiredFields.includes(item.key))
    .every((item) => item.state === "accepted");
  return allRequiredAccepted ? "VERIFIED" : "REVIEW_REQUIRED";
}

export function applyReview(record, action, findingId = record.findings.find((item) => item.state === "open")?.id, sourceId = "") {
  const next = structuredClone(record);
  const target = next.findings.find((item) => item.id === findingId);
  if (!target || target.state !== "open" || !["accept", "reject", "request", "defer"].includes(action)) return next;
  const field = next.fields.find((item) => item.id === target.field);
  const isConflict = target.rule === "identifier-exact-v2" || target.rule === "value-consistency-v1";

  if (action === "accept" && target.rule === "freshness-window-v1") {
    next.log.push({ at: "now", actor: "reviewer", action: "Acceptance refused", detail: `${target.rule} requires refreshed evidence before verification.` });
    return next;
  }
  if (action === "accept" && isConflict) {
    const permittedSources = [target.left, target.right].filter(Boolean);
    if (!permittedSources.includes(sourceId)) {
      next.log.push({ at: "now", actor: "reviewer", action: "Source selection required", detail: `${target.rule} cannot be accepted without selecting one linked source.` });
      return next;
    }
    target.resolutionSourceId = sourceId;
    if (field) {
      const selectedValue = field.values.find((value) => value.sourceId === sourceId);
      field.state = "accepted";
      field.sourceId = sourceId;
      field.value = selectedValue?.value ?? field.value;
      field.confidence = selectedValue?.confidence ?? field.confidence;
    }
  }

  target.state = { accept: "accepted", reject: "rejected", request: "deferred", defer: "deferred" }[action];
  if (field && action === "accept" && !isConflict) field.state = "accepted";
  if (field && action === "reject") field.state = "rejected";
  next.status = refreshStatus(next);
  const detail = action === "accept" && isConflict ? `${target.rule} / selected source ${sourceId}` : `${target.rule} / evidence retained`;
  next.log.push({ at: "now", actor: "reviewer", action: `${action} decision recorded`, detail });
  return next;
}

export function exportBundle(record) {
  return { schemaVersion: "0.3", synthetic: true, case: record, manifest: { files: record.sources.map((source) => source.hash), redaction: "default", ruleSet: "identifier-exact-v2 / freshness-window-v1", reviewStatus: record.status } };
}

export const BUILTIN_CASES = rawBuiltins.map((packet) => reconcilePacket(packet));
export const findCaseById = (id) => BUILTIN_CASES.find((item) => item.id === id) ?? BUILTIN_CASES[0];
