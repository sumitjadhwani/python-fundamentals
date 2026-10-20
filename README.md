# Python Fundamentals

A small static website for learning Python fundamentals — short notes, runnable examples, memory tricks, "predict the output" checks, flashcards and gotcha checklists.

## Contents

| Page | Modules | Status |
|------|---------|--------|
| `phase-1-foundation.html` | M1–M5: Object Model, Variables & Memory, Data Structures, Strings & Unicode, Functions & Scoping | ✅ |
| `phase-2-mechanics.html` | M6–M10: Iterators & Generators, Decorators, OOP & Dunders, Errors & Context Managers, Comprehensions & Functional Tools | ✅ |
| Phases 3–6 | Internals, Concurrency, Production, Design | Coming soon |

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
assets/css/style.css       # shared styles (light + dark theme)
assets/js/app.js           # sidebar, copy buttons, flashcards, progress, theme
```

## Adding a phase

1. Copy an existing phase page and keep the `<section class="module" id="mN" data-title="...">` structure — the sidebar and "mark as learned" buttons are built from those sections automatically.
2. In `assets/js/app.js`, set `ready: true` on the phase in the `PHASES` list. The top-bar phase menu, the home page cards and the progress bar all read from it.
