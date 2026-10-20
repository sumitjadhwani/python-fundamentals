// Python Fundamentals — shared page behaviour (no build step, no framework)
(function () {
  "use strict";

  const STORE_KEY = "pyfund:learned";

  // Single source of truth for the roadmap: nav menu, home cards and progress all read this.
  const PHASES = [
    { n: 1, file: "phase-1-foundation.html", title: "The Foundation", range: "M1–M5", ready: true,
      modules: ["m1", "m2", "m3", "m4", "m5"],
      topics: ["Object model — identity, type, value", "Variables, references & copying", "list, dict, set, tuple internals", "Strings, bytes & Unicode", "Functions, LEGB & closures"] },
    { n: 2, file: "phase-2-mechanics.html", title: "The Mechanics", range: "M6–M10", ready: true,
      modules: ["m6", "m7", "m8", "m9", "m10"],
      topics: ["Iterators & generators", "Decorators & factories", "OOP, MRO & dunder methods", "Exceptions & context managers", "Comprehensions, functools, itertools"] },
    { n: 3, file: "phase-3-internals.html", title: "CPython Internals", range: "M11–M13", ready: true,
      modules: ["m11", "m12", "m13"],
      topics: ["Compilation & bytecode", "Memory management & GC", "The GIL"] },
    { n: 4, file: "phase-4-concurrency.html", title: "Concurrency & Parallelism", range: "M14–M16", ready: true,
      modules: ["m14", "m15", "m16"],
      topics: ["Threading", "Multiprocessing", "Asyncio"] },
    { n: 5, file: "phase-5-production.html", title: "Production Python", range: "M17–M20", ready: false,
      modules: ["m17", "m18", "m19", "m20"],
      topics: ["Modules, packages & imports", "Type hints", "Testing with pytest", "Performance & profiling"] },
    { n: 6, file: "phase-6-design.html", title: "Design & Architecture", range: "M21–M22", ready: false,
      modules: ["m21", "m22"],
      topics: ["Pythonic design patterns", "Python in system design"] },
  ];
  const currentFile = location.pathname.split("/").pop() || "index.html";

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

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

  // ---------- Phase menu (top bar) ----------
  document.querySelectorAll("[data-phase-menu]").forEach((slot) => {
    const current = PHASES.find((p) => p.file === currentFile);
    const items = PHASES.map((p) => {
      const cls = (p === current ? "active" : "") + (p.ready ? "" : " soon");
      const inner = `<span class="num">${p.n}</span><span>${esc(p.title)}</span>${p.ready ? "" : '<small>soon</small>'}`;
      return p.ready ? `<a class="${cls}" href="${p.file}">${inner}</a>` : `<span class="${cls}">${inner}</span>`;
    }).join("");
    slot.innerHTML = `<details class="phase-menu"><summary>${current ? "Phase " + current.n : "Phases"} ▾</summary><div class="phase-menu-list">${items}</div></details>`;
  });
  document.addEventListener("click", (e) => {
    document.querySelectorAll("details.phase-menu[open]").forEach((d) => {
      if (!d.contains(e.target)) d.removeAttribute("open");
    });
  });

  // ---------- Home: phase cards ----------
  document.querySelectorAll("[data-phase-grid]").forEach((grid) => {
    grid.innerHTML = PHASES.map((p) => {
      const topics = p.topics.map((t) => `<li>${esc(t)}</li>`).join("");
      const head = `<span class="phase-num">PHASE ${p.n} · ${p.range}</span><h3>${esc(p.title)}</h3><ul>${topics}</ul>`;
      if (!p.ready) return `<div class="phase-card locked">${head}<div class="status">Coming soon</div></div>`;
      return `<a class="phase-card" href="${p.file}">${head}<div class="status"><span class="ready" data-phase-done="${p.n}">● Ready</span><span>Start →</span></div></a>`;
    }).join("");
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
  const progressMap = readLearned();
  PHASES.filter((p) => p.ready).forEach((p) => {
    const done = p.modules.filter((id) => progressMap[id]).length;
    document.querySelectorAll(`[data-phase-done="${p.n}"]`).forEach((el) => {
      el.textContent = done ? `● ${done} / ${p.modules.length} learned` : "● Ready";
    });
  });

  document.querySelectorAll("[data-progress]").forEach((el) => {
    const ids = el.dataset.progress
      ? el.dataset.progress.split(",")
      : PHASES.filter((p) => p.ready).flatMap((p) => p.modules);
    const map = readLearned();
    const done = ids.filter((id) => map[id]).length;
    const bar = el.querySelector(".progress-bar span");
    const label = el.querySelector("[data-progress-label]");
    if (bar) bar.style.width = (done / ids.length) * 100 + "%";
    if (label) label.textContent = `${done} / ${ids.length} modules learned`;
  });
})();
