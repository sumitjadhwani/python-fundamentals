# Python Fundamentals

A small static website for learning Python fundamentals — short notes, runnable examples, memory tricks, "predict the output" checks, flashcards and gotcha checklists.

## Contents

| Page | Modules | Status |
|------|---------|--------|
| `phase-1-foundation.html` | M1–M5: Object Model, Variables & Memory, Data Structures, Strings & Unicode, Functions & Scoping | ✅ |
| `phase-2-mechanics.html` | M6–M10: Iterators & Generators, Decorators, OOP & Dunders, Errors & Context Managers, Comprehensions & Functional Tools | ✅ |
| `phase-3-internals.html` | M11–M13: Compilation & Bytecode, Memory Management, The GIL | ✅ |
| `phase-4-concurrency.html` | M14–M16: Threading, Multiprocessing, Asyncio | ✅ |
| `phase-5-production.html` | M17–M20: Modules & Imports, Type Hints, Testing, Performance | ✅ |
| `phase-6-design.html` | M21–M22: Design Patterns, System Design, plus an all-phases revision sheet | ✅ |

## Run locally

No build step — plain HTML, CSS and JS.

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Structure

```
index.html                 # home / roadmap + progress
phase-1-foundation.html
phase-2-mechanics.html
phase-3-internals.html
phase-4-concurrency.html
phase-5-production.html
phase-6-design.html
assets/css/style.css       # shared styles (light + dark theme)
assets/js/app.js           # sidebar, copy buttons, flashcards, progress, theme
```

## Adding a phase

1. Copy an existing phase page and keep the `<section class="module" id="mN" data-title="...">` structure — the sidebar and "mark as learned" buttons are built from those sections automatically.
2. In `assets/js/app.js`, set `ready: true` on the phase in the `PHASES` list. The top-bar phase menu, the home page cards and the progress bar all read from it.
