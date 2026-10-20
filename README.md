# Python Fundamentals

A small static website for learning Python fundamentals — short notes, runnable examples, memory tricks, "predict the output" checks, flashcards and gotcha checklists.

Content is adapted from [HrushiMakode/Notes · Python](https://github.com/HrushiMakode/Notes/tree/master/Python).

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

Copy an existing phase page, keep the `<section class="module" id="mN" data-title="...">` structure — the sidebar and "mark as learned" progress are built from those sections automatically. Add the new module ids to `data-progress` on `index.html`.
