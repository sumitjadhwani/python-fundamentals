// Python Fundamentals — shared page behaviour (no build step, no framework)
(function () {
  "use strict";

  const STORE_KEY = "pyfund:learned";

  function readLearned() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function writeLearned(map) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(map)); } catch (e) { /* storage blocked */ }
  }

  // ---------- Theme ----------
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem("pyfund:theme");
    if (saved) root.dataset.theme = saved;
  } catch (e) {}

  function currentTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function syncThemeIcon(btn) { btn.textContent = currentTheme() === "dark" ? "☀" : "☾"; }

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    syncThemeIcon(btn);
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("pyfund:theme", next); } catch (e) {}
      syncThemeIcon(btn);
    });
  });

  // ---------- Mobile menu ----------
  const menuBtn = document.querySelector("[data-menu-toggle]");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    document.addEventListener("click", (e) => {
      if (e.target.closest(".sidebar a")) document.body.classList.remove("nav-open");
    });
  }

  // ---------- Code blocks: label + copy + highlight ----------
  document.querySelectorAll("pre > code[class*='language-']").forEach((code) => {
    const pre = code.parentElement;
    if (pre.parentElement.classList.contains("code")) return;
    const wrap = document.createElement("div");
    wrap.className = "code";
    const label = document.createElement("div");
    label.className = "code-label";
    label.innerHTML = `<span>${pre.dataset.label || "python"}</span>`;
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "copy";
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(code.innerText).then(() => {
        btn.textContent = "copied ✓";
        setTimeout(() => (btn.textContent = "copy"), 1400);
      });
    });
    label.appendChild(btn);
    pre.replaceWith(wrap);
    wrap.append(label, pre);
    if (window.hljs) window.hljs.highlightElement(code);
  });

  // ---------- Flashcards ----------
  document.querySelectorAll(".flashcard").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });

  // ---------- Sidebar built from module sections ----------
  const sidebarList = document.querySelector("[data-sidebar-modules]");
  const modules = Array.from(document.querySelectorAll("section.module"));
  const learned = readLearned();

  if (sidebarList && modules.length) {
    modules.forEach((sec) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + sec.id;
      a.dataset.target = sec.id;
      const dot = document.createElement("span");
      dot.className = "done-dot" + (learned[sec.id] ? " on" : "");
      dot.dataset.dotFor = sec.id;
      a.append(dot, document.createTextNode(sec.dataset.title || sec.id));
      li.appendChild(a);
      sidebarList.appendChild(li);
    });
  }

  // ---------- "Mark as learned" ----------
  document.querySelectorAll(".learn-btn").forEach((btn) => {
    const id = btn.closest("section.module").id;
    const paint = () => {
      const on = !!readLearned()[id];
      btn.classList.toggle("on", on);
      btn.textContent = on ? "✓ Learned" : "Mark as learned";
      document.querySelectorAll(`[data-dot-for="${id}"]`).forEach((d) => d.classList.toggle("on", on));
    };
    paint();
    btn.addEventListener("click", () => {
      const map = readLearned();
      if (map[id]) delete map[id]; else map[id] = true;
      writeLearned(map);
      paint();
    });
  });

  // ---------- Scroll spy ----------
  const spyTargets = Array.from(document.querySelectorAll("section.module, section.spy"));
  const links = Array.from(document.querySelectorAll(".sidebar a[data-target]"));
  if (spyTargets.length && links.length && "IntersectionObserver" in window) {
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting ? en.boundingClientRect.top : null));
      let best = null, bestTop = Infinity;
      visible.forEach((top, id) => {
        if (top !== null && Math.abs(top) < bestTop) { bestTop = Math.abs(top); best = id; }
      });
      if (best) links.forEach((l) => l.classList.toggle("active", l.dataset.target === best));
    }, { rootMargin: "-60px 0px -55% 0px" });
    spyTargets.forEach((s) => io.observe(s));
  }

  // ---------- Home page progress ----------
  document.querySelectorAll("[data-progress]").forEach((el) => {
    const ids = el.dataset.progress.split(",");
    const map = readLearned();
    const done = ids.filter((id) => map[id]).length;
    const bar = el.querySelector(".progress-bar span");
    const label = el.querySelector("[data-progress-label]");
    if (bar) bar.style.width = (done / ids.length) * 100 + "%";
    if (label) label.textContent = `${done} / ${ids.length} modules learned`;
  });
})();
