import { BUILTIN_CASES, applyReview, exportBundle, parsePacket, reconcilePacket, validatePacket } from "/src/engine.mjs";

const $ = (selector) => document.querySelector(selector);
const STORAGE_KEY = "tracewell.cases.v2";
const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
let userPackets = loadUserPackets();
let selected = "northline-ownership";
let record = clone(findCase(selected));
let selectedFindingId = null;
let selectedSourceId = record.sources[0]?.id;
let selectedFieldId = record.fields[0]?.id;

function clone(value) { return structuredClone(value); }
function loadUserPackets() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); return Array.isArray(saved) ? saved.filter((packet) => validatePacket(packet).ok) : []; } catch { return []; } }
function allRecords() { return [...BUILTIN_CASES, ...userPackets.map((packet) => reconcilePacket(packet))]; }
function findCase(id) { return allRecords().find((item) => item.id === id) ?? allRecords()[0]; }
function statusClass(status) { return status.toLowerCase().replaceAll("_", "-"); }
function setFeedback(message, tone = "muted") { const node = $("#packet-feedback"); node.textContent = message; node.dataset.tone = tone; }

function renderCases() {
  const records = allRecords();
  $("#case-list").innerHTML = records.map((item) => `
    <button class="case-card ${item.id === selected ? "selected" : ""}" data-case="${escapeHtml(item.id)}" type="button">
      <span class="case-state state-${statusClass(item.status)}"></span><span class="case-copy"><b>${escapeHtml(item.label)}</b><small>${item.sourceCount} sources / ${escapeHtml(item.status.replaceAll("_", " "))}</small></span><span class="case-time">${escapeHtml(item.updated)}</span>
    </button>`).join("");
  $("#case-count").textContent = String(records.length).padStart(2, "0");
  document.querySelectorAll("[data-case]").forEach((button) => button.addEventListener("click", () => { selected = button.dataset.case; record = clone(findCase(selected)); selectedFindingId = record.findings.find((item) => item.state === "open")?.id ?? null; selectedSourceId = record.sources[0]?.id; selectedFieldId = record.fields[0]?.id; render(); }));
}

function renderFields() {
  const findingByField = new Map(record.findings.filter((item) => item.state === "open").map((item) => [item.field, item]));
  $("#field-list").innerHTML = record.fields.map((field) => {
    const finding = findingByField.get(field.id);
    return `<button class="field-row ${field.id === selectedFieldId ? "selected" : ""}" data-field="${escapeHtml(field.id)}" data-source="${escapeHtml(field.sourceId ?? "")}" type="button"><span class="field-status status-${statusClass(field.state)}"></span><span class="field-copy"><b>${escapeHtml(field.label)}</b><small>${escapeHtml(field.value)}</small></span><span class="field-confidence">${Math.round(field.confidence * 100)}%</span>${finding ? `<span class="field-finding">${escapeHtml(finding.severity)}</span>` : ""}</button>`;
  }).join("");
  document.querySelectorAll("#field-list [data-field]").forEach((button) => button.addEventListener("click", () => { const finding = record.findings.find((item) => item.field === button.dataset.field && item.state === "open"); selectedFieldId = button.dataset.field; if (finding) selectedFindingId = finding.id; if (button.dataset.source) selectedSourceId = button.dataset.source; render(); }));
}

function renderGraph() {
  const sources = record.sources;
  const left = sources[0];
  const right = sources[1] ?? sources[0];
  const field = record.fields.find((item) => item.id === selectedFieldId) ?? record.fields[0];
  $("#graph-source-one").innerHTML = `<span class="node-kicker">${escapeHtml(left?.type ?? "SOURCE")} / REV ${left?.revision ?? 1}</span><b>${escapeHtml(left?.label ?? "No source")}</b><small>${escapeHtml(left?.hash ?? "unavailable")}</small>`;
  $("#graph-source-two").innerHTML = `<span class="node-kicker">${escapeHtml(right?.type ?? "SOURCE")} / REV ${right?.revision ?? 1}</span><b>${escapeHtml(right?.label ?? "No source")}</b><small>${escapeHtml(right?.hash ?? "unavailable")}</small>`;
  $("#graph-source-one").dataset.graphSource = left?.id ?? "";
  $("#graph-source-two").dataset.graphSource = right?.id ?? "";
  const finding = record.findings.find((item) => item.id === selectedFindingId) ?? record.findings.find((item) => item.state === "open");
  $("#graph-field").innerHTML = `<span class="node-kicker">FIELD / ${field ? Math.round(field.confidence * 100) : 0}%</span><b>${escapeHtml(field?.label ?? "Required field")}</b><small>${escapeHtml(field?.state ?? "unresolved")}</small>`;
  $("#graph-rule").innerHTML = `<span class="node-kicker">${escapeHtml(finding?.severity?.toUpperCase() ?? "CLEAR")} / ${escapeHtml(finding?.state?.toUpperCase() ?? "NONE")}</span><b>${escapeHtml(finding?.rule ?? "No open finding")}</b><small>${escapeHtml(finding?.explanation ?? "All required paths agree.")}</small>`;
  $("#rule-version").textContent = finding ? `RULE SET ${finding.rule.toUpperCase()}` : "RULE SET all-required-v1";
  document.querySelectorAll("[data-graph-source]").forEach((button) => button.addEventListener("click", () => { selectedSourceId = button.dataset.graphSource; render(); }));
}

function selectSource(sourceId) {
  const source = record.sources.find((item) => item.id === sourceId) ?? record.sources[0];
  if (!source) return;
  selectedSourceId = source.id;
  $("#source-title").textContent = source.label;
  const excerpt = source.excerpt.split("\n").map((line) => `<p>${escapeHtml(line).replace(/(M\. Alvarez|M\. Alvarado|R\. Chen|S\. Okafor)/g, "<mark>$1</mark>")}</p>`).join("");
  $("#source-copy").innerHTML = `<span class="redact-label">REDACTED FIXTURE EXCERPT</span>${excerpt}<div class="document-rule"></div><small>Source span / fixture locator / redacted by default</small>`;
  $(".source-meta").innerHTML = `<span>${escapeHtml(source.type)} / REVISION ${source.revision ?? 1}</span><span class="mono">${escapeHtml(source.hash)}</span>`;
}

function render() {
  renderCases();
  renderFields();
  renderGraph();
  const counts = summarize(record);
  $("#case-title").textContent = record.label;
  $("#case-subtitle").textContent = record.status === "VERIFIED" ? "All required fields have an explicit accepted evidence path." : record.status === "EXPIRED" ? "A required source is outside its validity window; verification is blocked." : "Review source spans, resolve findings, and keep the decision path inspectable.";
  $("#verified-count").textContent = counts.verified;
  $("#unresolved-count").textContent = counts.unresolved;
  $("#contradicted-count").textContent = counts.contradicted;
  $("#expired-count").textContent = counts.expired;
  $("#case-status").textContent = record.status.replaceAll("_", " ");
  $("#case-status").className = `state state-${statusClass(record.status)}`;
  $("#case-updated").textContent = `updated ${record.updated}`;
  $("#finding-count").textContent = `${record.findings.filter((item) => item.state === "open").length} OPEN`;
  $("#decision-log").innerHTML = record.log.map((item) => `<div class="log-row"><span class="log-time mono">${escapeHtml(item.at)}</span><span class="log-actor">${escapeHtml(item.actor)}</span><b>${escapeHtml(item.action)}</b><span>${escapeHtml(item.detail)}</span></div>`).join("");
  const finding = record.findings.find((item) => item.id === selectedFindingId) ?? record.findings.find((item) => item.state === "open");
  selectedFindingId = finding?.id ?? null;
  $("#decision-copy").textContent = finding?.state === "open" ? finding.explanation : finding ? `Finding is ${finding.state}; the decision remains in the append-only log.` : "No open findings. The case has no pending reviewer action.";
  document.querySelectorAll("[data-action]").forEach((button) => { button.disabled = !finding || finding.state !== "open"; });
  selectSource(selectedSourceId);
}

function summarize(item) {
  return { verified: item.fields.filter((field) => field.state === "accepted").length, unresolved: item.fields.filter((field) => field.state === "unresolved" || field.state === "proposed").length, contradicted: item.findings.filter((finding) => finding.state === "open" && (finding.rule.includes("consistency") || finding.rule.includes("identifier"))).length, expired: item.findings.filter((finding) => finding.state === "open" && finding.rule.includes("freshness")).length };
}

document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => { record = applyReview(record, button.dataset.action, selectedFindingId, selectedSourceId); render(); }));
$("#export-button").addEventListener("click", () => { const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([JSON.stringify(exportBundle(record), null, 2)], { type: "application/json" })); link.download = `${record.id}-evidence-bundle.json`; link.click(); URL.revokeObjectURL(link.href); });
$("#load-sample").addEventListener("click", async () => { const response = await fetch("/fixtures/custom-case.json"); $("#packet-json").value = await response.text(); setFeedback("Sample packet loaded. Validate it before saving.", "cyan"); });
$("#packet-file").addEventListener("change", async (event) => { const file = event.target.files?.[0]; if (!file) return; $("#packet-json").value = await file.text(); setFeedback(`${file.name} loaded. Validate it before saving.`, "cyan"); });
$("#validate-packet").addEventListener("click", () => { try { const packet = parsePacket($("#packet-json").value); setFeedback(`Valid packet: ${packet.documents.length} documents / ${packet.observations.length} observations.`, "mint"); } catch (error) { setFeedback(error.message, "coral"); } });
$("#save-packet").addEventListener("click", () => { try { const packet = parsePacket($("#packet-json").value); userPackets = [...userPackets.filter((item) => item.id !== packet.id), packet]; localStorage.setItem(STORAGE_KEY, JSON.stringify(userPackets)); selected = packet.id; record = reconcilePacket(packet); selectedFindingId = record.findings.find((item) => item.state === "open")?.id ?? null; selectedSourceId = record.sources[0]?.id; selectedFieldId = record.fields[0]?.id; setFeedback(`${packet.label} reconciled and saved locally.`, "mint"); render(); } catch (error) { setFeedback(error.message, "coral"); } });
$("#clear-cases").addEventListener("click", () => { userPackets = []; localStorage.removeItem(STORAGE_KEY); selected = "northline-ownership"; record = clone(findCase(selected)); selectedFindingId = record.findings[0]?.id ?? null; selectedSourceId = record.sources[0]?.id; selectedFieldId = record.fields[0]?.id; setFeedback("User-authored packets cleared. Seeded cases remain available.", "muted"); render(); });

render();
