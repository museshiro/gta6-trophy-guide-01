// Leonida Trophy Tracker — GTA VI trophy guide and checklist.
// Loads app/data/trophies.json, renders the checklist, saves progress
// in localStorage, and offers export / import / reset. No network at
// runtime beyond the app's own files.

const STORAGE_KEY = "leonida-trophy-tracker-v1";
const DATA_URL = "data/trophies.json";

const STAGES = [
  { n: 1, title: "Play the story", text: "Finish the campaign first: Chapters 1–4, the final mission and every named story mission. Story trophies unlock as you play and cannot be missed. After the credits, free roam stays open for cleanup." },
  { n: 2, title: "Activities and side content", text: "Try every activity, finish the stranger strands, win the races and the shooting range, and meditate at every spot you find. Do the meditation spots as you go — Positive Mental Attitude is the one trophy the guides flag as possibly missable." },
  { n: 3, title: "Collectibles and the world", text: "Cards, WAiNK spots, vehicles, garages and the whole map. Explore region by region and let the vehicle, card and exploration trophies progress together." },
  { n: 4, title: "Combat, driving and chaos", text: "Stunts, robberies, wanted levels and the hidden moment trophies. Bring a fast car, plan the heists, and retry the tricky ones — failing once is part of a couple of them." },
  { n: 5, title: "100% and the platinum", text: "Open Touch Pad, then Progress, then 100% Completion and work the in-game checklist. When it hits 100%, A Long Road pops — and Vice Got a Price! follows with it." },
];

const KIND_LABEL = { story: "Story", collectible: "Collectible", activity: "Activity" };

let trophies = [];
let earned = new Set();
let filter = "all";
let query = "";
let spoilers = false;

const $ = (sel) => document.querySelector(sel);

function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const ids = JSON.parse(raw);
    if (Array.isArray(ids)) earned = new Set(ids.filter((n) => Number.isInteger(n)));
  } catch (_) { earned = new Set(); }
}

function saveEarned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function isSpoilerHidden(t) {
  return spoilers && (t.kind === "story" || t.hidden) && !earned.has(t.id);
}

function visibleTrophies() {
  return trophies.filter((t) => {
    if (filter === "story" && t.kind !== "story") return false;
    if (filter === "missable" && !t.missable) return false;
    if (filter === "collectible" && t.kind !== "collectible") return false;
    if (filter === "activity" && t.kind !== "activity") return false;
    if (filter === "online") return false;
    if (filter === "earned" && !earned.has(t.id)) return false;
    if (filter === "todo" && earned.has(t.id)) return false;
    if (query) {
      const hay = (t.name + " " + t.description + " " + t.guide).toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

function gradeWord(g) {
  return g === "platinum" ? "Platinum" : g === "gold" ? "Gold" : g === "silver" ? "Silver" : "Bronze";
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#progressFill").style.width = pct + "%";
  $("#progressText").textContent = done + " / " + total + " earned · " + pct + "%";
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    totals[t.grade]++;
    if (earned.has(t.id)) counts[t.grade]++;
  }
  $("#gradeCounts").innerHTML = ["platinum", "gold", "silver", "bronze"]
    .map((g) => '<span class="grade-pill">' + gradeWord(g) + " " + counts[g] + "/" + totals[g] + "</span>")
    .join("");
}

function renderStages() {
  $("#stageList").innerHTML = STAGES.map((s) => {
    const members = trophies.filter((t) => t.stage === s.n);
    const done = members.filter((t) => earned.has(t.id)).length;
    const names = members.map((t) => (isSpoilerHidden(t) ? "Hidden trophy" : t.name)).join(", ");
    return '<li class="stage"><div class="stage-head"><span class="stage-num">' + s.n + '</span><h3>' + s.title + '</h3><span class="stage-count">' + done + "/" + members.length + " earned</span></div><p>" + s.text + "</p><ul class=\"stage-trophies\"><li>" + names + "</li></ul></li>";
  }).join("");
}

function sourceHtml(t) {
  if (!t.sources || !t.sources.length) return "";
  const parts = t.sources.map((s) => (s.url ? '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.name + "</a>" : s.name));
  return '<p class="sources">Sources: ' + parts.join(" · ") + "</p>";
}

function renderList() {
  const list = visibleTrophies();
  $("#listCount").textContent = list.length + " shown";
  $("#emptyMsg").hidden = list.length > 0;
  $("#trophyList").innerHTML = list.map((t) => {
    const done = earned.has(t.id);
    const hidden = isSpoilerHidden(t);
    const name = hidden ? "Hidden trophy — earn it to reveal" : t.name;
    const desc = hidden ? "A story trophy. Its name and description stay hidden until you earn it." : t.description;
    const tags = '<span class="tag grade-' + t.grade + '">' + gradeWord(t.grade) + "</span>"
      + '<span class="tag">' + KIND_LABEL[t.kind] + "</span>"
      + (t.missable ? '<span class="tag missable">Missable</span>' : "")
      + (t.hidden ? '<span class="tag hidden-t">Hidden</span>' : "");
    const guide = hidden
      ? '<p>Hidden until earned.</p>'
      : "<p>" + t.guide + "</p>" + sourceHtml(t);
    return '<li class="trophy' + (done ? " earned" : "") + (hidden ? " spoiler-hidden" : "") + '">'
      + '<div class="trophy-top"><input type="checkbox" class="trophy-check" data-id="' + t.id + '"' + (done ? " checked" : "") + ' aria-label="Mark ' + name + ' earned">'
      + '<div class="trophy-main"><h3 class="trophy-name">' + name + "</h3>"
      + '<p class="trophy-desc">' + desc + "</p>"
      + '<div class="trophy-tags">' + tags + "</div>"
      + '<details class="trophy-guide"><summary>Guide &amp; sources</summary>' + guide + "</details>"
      + "</div></div></li>";
  }).join("");
  document.querySelectorAll(".trophy-check").forEach((box) => {
    box.addEventListener("change", () => {
      const id = Number(box.dataset.id);
      if (box.checked) earned.add(id); else earned.delete(id);
      saveEarned();
      renderProgress();
      renderStages();
      renderList();
    });
  });
}

function renderAll() {
  renderProgress();
  renderStages();
  renderList();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ app: "leonida-trophy-tracker", earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gta6-trophies-progress.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const ids = Array.isArray(data) ? data : data.earned;
      if (!Array.isArray(ids)) throw new Error("no earned list");
      earned = new Set(ids.filter((n) => Number.isInteger(n) && trophies.some((t) => t.id === n)));
      saveEarned();
      renderAll();
    } catch (_) {
      alert("That file is not a valid progress export.");
    }
  };
  reader.readAsText(file);
}

function applyShotMode() {
  const params = new URLSearchParams(location.search);
  const shot = params.get("shot");
  if (!shot) return;
  if (shot === "roadmap") {
    document.getElementById("roadmap").scrollIntoView();
  } else if (shot === "guide") {
    const t = trophies.find((x) => x.id === 28) || trophies[0];
    const details = document.querySelector('[data-id="28"]')?.closest(".trophy")?.querySelector("details");
    if (details) { details.open = true; details.scrollIntoView({ block: "center" }); }
  } else if (shot === "progress") {
    document.getElementById("progressWrap").scrollIntoView();
  }
  window.__shotReady = true;
}

async function main() {
  const res = await fetch(DATA_URL);
  const data = await res.json();
  trophies = data.trophies || data;
  loadEarned();
  document.getElementById("searchBox").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    renderList();
  });
  document.getElementById("filterChips").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    filter = btn.dataset.filter;
    document.querySelectorAll("#filterChips .chip").forEach((c) => c.classList.toggle("active", c === btn));
    renderList();
  });
  document.getElementById("spoilerToggle").addEventListener("change", (e) => {
    spoilers = e.target.checked;
    renderStages();
    renderList();
  });
  document.getElementById("exportBtn").addEventListener("click", exportProgress);
  document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile").addEventListener("change", (e) => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = "";
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Clear all earned trophies?")) { earned = new Set(); saveEarned(); renderAll(); }
  });
  renderAll();
  applyShotMode();
  window.__shotReady = true;
}

main();
