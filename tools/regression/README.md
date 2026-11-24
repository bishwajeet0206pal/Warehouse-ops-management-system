# Interaction regression check

Clicks every clickable element on each screen state in headless Chrome and records a DOM hash after each click
(fresh page load per click; `Date` and `Math.random` frozen). Use it to prove a refactor changes no behavior.

```bash
tools/regression/run.sh
```

- Compares **committed `HEAD`** (baseline) against the **working tree**. Commit or stash intentional behavior
  changes first, otherwise they show up as mismatches.
- Needs Node 22+ and Chrome (`CHROME=/path/to/chrome` if not at the macOS default). Takes about 20 minutes.
- Mismatches are re-run once in isolation; only lines starting with `PERSISTENT` are real differences.
- Also fails on any uncaught JS error or hung click.
- Limits: one click from a fresh load of each screen. It does not cover multi-step flows, typing, hover or drag.
