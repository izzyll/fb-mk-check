(() => {
  "use strict";
  if (window.__fmvLoaded) return;
  window.__fmvLoaded = true;

  const ITEM_SELECTOR = 'a[href*="/marketplace/item/"]';
  const ITEM_RE = /\/marketplace\/item\/(\d+)/;
  const KEY_PREFIX = "s:"; // cada aviso visto se guarda como "s:<id>" => { t, title, price, img }
  const MODES = ["dim", "hide", "off"];
  const MODE_LABEL = { dim: "Atenuar", hide: "Ocultar", off: "Normal" };

  const seen = new Set();
  const meta = new Map(); // id -> { t, title, price, img }
  let settings = { mode: "dim", autoMarkOnOpen: true, showToolbar: true };
  let lastUrl = "";
  let scheduled = false;

  console.log("[Marketplace Visto] cargado");

  // ---------- Storage ----------

  async function loadAll() {
    try {
      const data = await chrome.storage.local.get(null);
      for (const [k, v] of Object.entries(data)) {
        if (!k.startsWith(KEY_PREFIX)) continue;
        const id = k.slice(KEY_PREFIX.length);
        seen.add(id);
        meta.set(id, normalize(v));
      }
      if (data.settings) settings = { ...settings, ...data.settings };
    } catch (e) {
      console.warn("[Marketplace Visto] error leyendo storage", e);
    }
  }

  // Formato viejo: número (timestamp). Formato nuevo: objeto con datos del aviso.
  function normalize(v) {
    if (typeof v === "number") return { t: v };
    return v && typeof v === "object" ? v : { t: Date.now() };
  }

  const INFO_KEYS = ["title", "price", "img"];

  function markSeen(id, info = {}) {
    if (!id) return;
    if (seen.has(id)) return enrich(id, info);
    seen.add(id);
    const m = { t: Date.now() };
    for (const k of INFO_KEYS) if (info[k]) m[k] = info[k];
    meta.set(id, m);
    chrome.storage.local.set({ [KEY_PREFIX + id]: m });
    schedule();
  }

  // Completa datos faltantes (título, precio, imagen) de un aviso ya visto.
  function enrich(id, info = {}) {
    if (!seen.has(id)) return;
    const m = { ...(meta.get(id) || { t: Date.now() }) };
    let changed = false;
    for (const k of INFO_KEYS) {
      if (info[k] && !m[k]) {
        m[k] = info[k];
        changed = true;
      }
    }
    if (!changed) return;
    meta.set(id, m);
    chrome.storage.local.set({ [KEY_PREFIX + id]: m });
  }

  // Extrae precio/título/imagen de la tarjeta del aviso.
  const BADGE_RE = /^(just listed|recién publicad[oa]|nuevo|new|visto|marcar visto|✓)$/i;
  // "CLP8,000,000", "$ 150.000", "US$200", "ARS 50.000", "1.500 €", "Gratis"
  const isPrice = (s) =>
    /^(gratis|free)$/i.test(s) ||
    /^(\p{Sc}|[A-Z]{1,3}\s?\p{Sc}?)?\s?\d[\d.,\s]*(\p{Sc}|\s?[A-Z]{3})?$/u.test(s);

  function cardInfo(a) {
    if (!a) return {};
    const lines = (a.innerText || "")
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s && !BADGE_RE.test(s));
    const info = {};
    let i = 0;
    if (lines[0] && isPrice(lines[0])) info.price = lines[i++];
    while (i < lines.length && isPrice(lines[i])) i++; // precio anterior tachado
    if (lines[i]) info.title = lines[i].slice(0, 200);
    const img = a.querySelector("img")?.src;
    if (img && img.startsWith("https://")) info.img = img;
    return info;
  }

  // Título desde la página del aviso: "Marketplace - 2015 Audi A3 | Facebook"
  function titleFromDoc() {
    const m = document.title.match(/Marketplace\s*[-–]\s*(.+?)\s*\|\s*Facebook\s*$/);
    return m ? m[1].trim() : null;
  }

  function unmarkSeen(id) {
    seen.delete(id);
    meta.delete(id);
    chrome.storage.local.remove(KEY_PREFIX + id);
    schedule();
  }

  function saveSettings() {
    chrome.storage.local.set({ settings });
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    for (const [k, { newValue }] of Object.entries(changes)) {
      if (k === "settings") {
        settings = { ...settings, ...(newValue || {}) };
      } else if (k.startsWith(KEY_PREFIX)) {
        const id = k.slice(KEY_PREFIX.length);
        if (newValue === undefined) {
          seen.delete(id);
          meta.delete(id);
        } else {
          seen.add(id);
          meta.set(id, normalize(newValue));
        }
      }
    }
    schedule();
  });

  // ---------- Helpers ----------

  const isMarketplace = () => location.pathname.startsWith("/marketplace");

  function getId(a) {
    const m = (a.getAttribute("href") || "").match(ITEM_RE);
    return m ? m[1] : null;
  }

  function hasOtherItem(el, id) {
    for (const a of el.querySelectorAll(ITEM_SELECTOR)) {
      const other = getId(a);
      if (other && other !== id) return true;
    }
    return false;
  }

  // Sube desde el link hasta justo antes del contenedor que agrupa varios avisos:
  // ese elemento es la "celda" de la grilla.
  function getCell(a, id) {
    let el = a;
    for (let i = 0; i < 20; i++) {
      const p = el.parentElement;
      if (!p || p === document.body) return a.parentElement || a;
      if (hasOtherItem(p, id)) return el === a ? a.parentElement || a : el;
      el = p;
    }
    return a.parentElement || a;
  }

  // ---------- Check en cada aviso ----------

  function ensureCheck(cell, id) {
    let btn = cell.querySelector(":scope > .fmv-check");
    if (!btn) {
      btn = document.createElement("div");
      btn.className = "fmv-check";
      btn.setAttribute("role", "checkbox");
      btn.innerHTML = '<span class="fmv-box"></span><span class="fmv-label"></span>';
      cell.appendChild(btn);
    }
    btn.dataset.id = id;
    const isSeen = seen.has(id);
    btn.classList.toggle("fmv-checked", isSeen);
    btn.setAttribute("aria-checked", String(isSeen));
    btn.querySelector(".fmv-box").textContent = isSeen ? "✓" : "";
    btn.querySelector(".fmv-label").textContent = isSeen ? "Visto" : "Marcar visto";
    btn.title = isSeen ? "Click para desmarcar" : "Marcar como visto";
  }

  // Bloquear TODOS los eventos del check en fase de captura a nivel window,
  // antes de que Facebook los reciba (si no, abre el aviso).
  const BLOCK = ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend", "auxclick", "dblclick"];
  for (const t of BLOCK) {
    window.addEventListener(
      t,
      (e) => {
        if (e.target.closest?.(".fmv-check")) {
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
      },
      true
    );
  }
  window.addEventListener(
    "click",
    (e) => {
      const chk = e.target.closest?.(".fmv-check");
      if (chk) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        const id = chk.dataset.id;
        if (seen.has(id)) unmarkSeen(id);
        else markSeen(id, cardInfo(chk.parentElement?.querySelector(ITEM_SELECTOR)));
        return;
      }
      // Click en un aviso => marcar como visto
      if (!settings.autoMarkOnOpen || e.target.closest?.("#fmv-toolbar")) return;
      const a = e.target.closest?.(ITEM_SELECTOR);
      if (a) markSeen(getId(a), cardInfo(a));
    },
    true
  );
  // Click del medio (abrir en pestaña nueva)
  window.addEventListener(
    "auxclick",
    (e) => {
      if (e.button !== 1 || !settings.autoMarkOnOpen) return;
      const a = e.target.closest?.(ITEM_SELECTOR);
      if (a) markSeen(getId(a), cardInfo(a));
    },
    true
  );

  // ---------- Barra flotante ----------

  function ensureToolbar() {
    let bar = document.getElementById("fmv-toolbar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "fmv-toolbar";
      bar.innerHTML = `
        <span class="fmv-stat"></span>
        <button type="button" data-act="mode" title="Cambiar qué hacer con los vistos"></button>
        <button type="button" data-act="all" title="Marcar como vistos todos los avisos cargados">Marcar todos</button>`;
      bar.addEventListener("click", (e) => {
        const act = e.target?.dataset?.act;
        if (act === "mode") {
          settings.mode = MODES[(MODES.indexOf(settings.mode) + 1) % MODES.length];
          saveSettings();
          schedule();
        } else if (act === "all") {
          const ids = new Map(); // id -> anchor
          document.querySelectorAll(ITEM_SELECTOR).forEach((a) => {
            const id = getId(a);
            if (id && !seen.has(id) && !ids.has(id)) ids.set(id, a);
          });
          if (!ids.size) return;
          if (!confirm(`¿Marcar ${ids.size} avisos cargados como vistos?`)) return;
          const batch = {};
          const now = Date.now();
          ids.forEach((a, id) => {
            const m = { t: now, ...cardInfo(a) };
            seen.add(id);
            meta.set(id, m);
            batch[KEY_PREFIX + id] = m;
          });
          chrome.storage.local.set(batch);
          schedule();
        }
      });
      document.body.appendChild(bar);
    }
    return bar;
  }

  function updateToolbar(seenOnPage, totalOnPage) {
    const existing = document.getElementById("fmv-toolbar");
    if (!isMarketplace() || !settings.showToolbar) {
      existing?.remove();
      return;
    }
    const bar = ensureToolbar();
    bar.querySelector(".fmv-stat").textContent = `👁 ${seenOnPage}/${totalOnPage} vistos`;
    bar.querySelector('[data-act="mode"]').textContent = `Vistos: ${MODE_LABEL[settings.mode]}`;
  }

  // ---------- Proceso principal ----------

  function process() {
    scheduled = false;

    // Si entraste a un aviso (página o ventana emergente), marcarlo.
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      const m = location.pathname.match(ITEM_RE);
      if (m && settings.autoMarkOnOpen) markSeen(m[1]);
    }

    // En la página del aviso: completar el título si falta (el <title> carga con demora).
    const cur = location.pathname.match(ITEM_RE);
    if (cur && seen.has(cur[1]) && !meta.get(cur[1])?.title) {
      const title = titleFromDoc();
      if (title) enrich(cur[1], { title });
    }

    if (!isMarketplace()) {
      updateToolbar(0, 0);
      return;
    }

    const cells = new Map(); // cell -> { id, a }
    for (const a of document.querySelectorAll(ITEM_SELECTOR)) {
      if (a.closest("#fmv-toolbar")) continue;
      const id = getId(a);
      if (!id) continue;
      const cell = getCell(a, id);
      if (!cells.has(cell)) cells.set(cell, { id, a });
    }

    let seenCount = 0;
    for (const [cell, { id, a }] of cells) {
      const isSeen = seen.has(id);
      if (isSeen) seenCount++;
      // Completar datos de avisos vistos que no los tienen (p.ej. marcados con la versión anterior).
      if (isSeen && !cell.classList.contains("fmv-hide")) {
        const m = meta.get(id);
        if (!m?.title || !m?.price || !m?.img) enrich(id, cardInfo(a));
      }
      cell.classList.add("fmv-cell");
      cell.classList.toggle("fmv-dim", isSeen && settings.mode === "dim");
      cell.classList.toggle("fmv-hide", isSeen && settings.mode === "hide");
      ensureCheck(cell, id);
    }

    updateToolbar(seenCount, cells.size);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(process, 200);
  }

  // ---------- Init ----------

  loadAll().then(() => {
    process();
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
    // Facebook es una SPA: chequeo periódico por cambios de URL.
    setInterval(() => {
      if (location.href !== lastUrl) schedule();
    }, 700);
  });
})();
