const KEY_PREFIX = "s:";
const DEFAULTS = { mode: "dim", autoMarkOnOpen: true, showToolbar: true };
const LIST_LIMIT = 300;
const $ = (id) => document.getElementById(id);
let settings = { ...DEFAULTS };
let entries = []; // [{ id, t, title, price, img }]

function msg(text) {
  $("msg").textContent = text;
  setTimeout(() => ($("msg").textContent = ""), 3000);
}

const normalize = (v) => (typeof v === "number" ? { t: v } : v && typeof v === "object" ? v : {});

async function getSeen() {
  const all = await chrome.storage.local.get(null);
  const seen = {};
  for (const [k, v] of Object.entries(all)) {
    if (k.startsWith(KEY_PREFIX)) seen[k.slice(KEY_PREFIX.length)] = normalize(v);
  }
  return { seen, all };
}

function fmtDate(t) {
  if (!t) return "";
  const d = new Date(t);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  return sameDay
    ? "hoy " + d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("es", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function renderList() {
  const q = $("search").value.trim().toLowerCase();
  const list = $("list");
  list.textContent = "";
  const filtered = q
    ? entries.filter((e) => `${e.title || ""} ${e.price || ""} ${e.id}`.toLowerCase().includes(q))
    : entries;

  if (!filtered.length) {
    const div = document.createElement("div");
    div.className = "empty";
    div.textContent = entries.length ? "Sin resultados." : "Todavía no marcaste avisos.";
    list.appendChild(div);
    return;
  }

  for (const e of filtered.slice(0, LIST_LIMIT)) {
    const url = `https://www.facebook.com/marketplace/item/${e.id}/`;
    const item = document.createElement("div");
    item.className = "item";

    const img = document.createElement("img");
    img.className = "thumb";
    img.alt = "";
    if (e.img) img.src = e.img;
    img.onerror = () => (img.style.visibility = "hidden"); // las imágenes de FB vencen
    item.appendChild(img);

    const info = document.createElement("div");
    info.className = "info";
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.title = url;
    a.textContent = e.title || `Aviso ${e.id}`;
    info.appendChild(a);
    const sub = document.createElement("div");
    sub.className = "sub";
    if (e.price) {
      const p = document.createElement("span");
      p.className = "price";
      p.textContent = e.price;
      sub.appendChild(p);
      sub.append(" · ");
    }
    sub.append(fmtDate(e.t));
    info.appendChild(sub);
    item.appendChild(info);

    const del = document.createElement("button");
    del.className = "del";
    del.title = "Quitar de vistos";
    del.textContent = "✕";
    del.addEventListener("click", async () => {
      await chrome.storage.local.remove(KEY_PREFIX + e.id);
      refresh();
    });
    item.appendChild(del);

    list.appendChild(item);
  }

  if (filtered.length > LIST_LIMIT) {
    const div = document.createElement("div");
    div.className = "empty";
    div.textContent = `Mostrando ${LIST_LIMIT} de ${filtered.length}. Usá el buscador para filtrar.`;
    list.appendChild(div);
  }
}

async function refresh() {
  const { seen, all } = await getSeen();
  settings = { ...DEFAULTS, ...(all.settings || {}) };
  entries = Object.entries(seen)
    .map(([id, m]) => ({ id, ...m }))
    .sort((a, b) => (b.t || 0) - (a.t || 0));
  $("count").textContent = entries.length.toLocaleString("es");
  document.querySelector(`input[name="mode"][value="${settings.mode}"]`).checked = true;
  $("autoMarkOnOpen").checked = settings.autoMarkOnOpen;
  $("showToolbar").checked = settings.showToolbar;
  renderList();
}

function save() {
  chrome.storage.local.set({ settings });
}

$("search").addEventListener("input", renderList);

document.querySelectorAll('input[name="mode"]').forEach((r) =>
  r.addEventListener("change", () => {
    settings.mode = r.value;
    save();
  })
);
["autoMarkOnOpen", "showToolbar"].forEach((id) =>
  $(id).addEventListener("change", () => {
    settings[id] = $(id).checked;
    save();
  })
);

$("export").addEventListener("click", async () => {
  const { seen } = await getSeen();
  const blob = new Blob([JSON.stringify({ version: 2, seen }, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `marketplace-vistos-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$("import").addEventListener("click", () => $("file").click());
$("file").addEventListener("change", async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const data = JSON.parse(await f.text());
    const { seen: current } = await getSeen();
    const batch = {};
    for (const [id, v] of Object.entries(data.seen || {})) {
      if (!/^\d+$/.test(id)) continue;
      const m = normalize(v);
      batch[KEY_PREFIX + id] = { ...m, ...(current[id] || {}), t: m.t || current[id]?.t || Date.now() };
    }
    await chrome.storage.local.set(batch);
    msg(`Importados ${Object.keys(batch).length} avisos.`);
    refresh();
  } catch {
    msg("Archivo inválido.");
  }
  e.target.value = "";
});

$("clear").addEventListener("click", async () => {
  const keys = entries.map((e) => KEY_PREFIX + e.id);
  if (!keys.length) return;
  if (!confirm(`¿Borrar ${keys.length} avisos vistos? No se puede deshacer (exportá antes si querés).`)) return;
  await chrome.storage.local.remove(keys);
  msg("Listo, lista vaciada.");
  refresh();
});

refresh();
