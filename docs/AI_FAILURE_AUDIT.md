# AI Failure Audit

This report records failures observed while implementing and verifying the
Lab 03 In-class sprints. Each entry is logged before the AI is asked to fix
the subtask. Screenshots listed as verification evidence show the corrected
UI; they are not presented as screenshots of the original failure.

<!--
Copy this template for each failure (number entries 01, 02, 03, ...):

## AI Failure NN: <short title>

- **AI Prompt:** <the prompt / subtask given to the AI>
- **AI Generated Code:** <what the AI produced and why it is wrong>
- **Risk:** <impact if shipped: crash, XSS, leak, a11y, wrong state, ...>
- **Detection Method / DevTools Proof:** <console error, panel, snapshot,
  test, or git diff that exposed it>
- **Engineering Refactor / Manual Fix:** <the fix applied>
- **Verification Evidence:** <how the fix was verified; evidence/*.png>
-->

## AI Failure 01: scaffold page logs a 404 console error (favicon)

- **AI Prompt:** Task 0.1 Scaffold project: React 19 + Vite,
  `createRoot` + `StrictMode`, no extra deps; `package.json`,
  `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`,
  `src/index.css`, `.gitignore`, `README.md`.
- **AI Generated Code:** `index.html` (commit `c2d5517`) has no
  `<link rel="icon">`, so Chrome requests `/favicon.ico`, which the Vite dev
  server answers with 404. The baseline page already logs one console error.
- **Risk:** The live defense Step 2 requires zero Console warnings, and
  Lighthouse "Best Practices" fails the "No browser errors logged to the
  console" audit. The error would also pollute every later console check.
- **Detection Method / DevTools Proof:** Found during Task 1.1 verification.
  Playwright on Chrome loading `http://localhost:5173/` captured console
  message `[ERROR] Failed to load resource: the server responded with a
  status of 404 (Not Found) @ http://localhost:5173/favicon.ico`;
  `curl -I http://localhost:5173/favicon.ico` returns 404.
  Evidence: `evidence/0.1-console-before-fix.txt`,
  `evidence/0.1-favicon-curl-before-fix.txt` (captured logs, not DevTools
  panel screenshots).
- **Engineering Refactor / Manual Fix:** Added an inline empty icon to
  `index.html` head: `<link rel="icon" href="data:," />`. The browser no
  longer requests `/favicon.ico`, and no extra file is added.
- **Verification Evidence:** After the fix, reloaded on :5173; the same
  Playwright/Chrome check shows `Errors: 0, Warnings: 0` and no
  `favicon` entry in `performance.getEntriesByType('resource')`;
  `npm run build` passes. `evidence/0.1-console-after-fix.txt` (captured
  log, not a DevTools panel screenshot).

## AI Failure 02: SUCCESS panel taller than the 220px skeleton (layout shift)

- **AI Prompt:** Task 3.2 Skeleton and retry alert: 220px `aria-busy`
  skeleton (0.00 CLS); `<section role="alert">` + Retry; no
  `window.alert()`.
- **AI Generated Code:** `PubgMatchTelemetry.module.css` gave the skeleton a
  fixed `height: 220px`, but `.panel` only had `min-height: 220px` with
  `padding: var(--gap)` and `.panel h3 { margin: 0 0 0.75rem; }`. The
  SUCCESS view (heading + 6 `dt`/`dd` rows) rendered 236px tall, so every
  LOADING -> SUCCESS transition grew the panel by 16px.
- **Risk:** Content below the radar is pushed down on each load, breaking the
  slide's 0.00 CLS contract for the skeleton. The measured CLS was 0 only
  because nothing sits below Exercise 3 yet; any later sibling (or the live
  defense polling mutation) would shift.
- **Detection Method / DevTools Proof:** Found during Task 3.2 verification
  (code not yet committed). Playwright on Chrome with CDP throttling
  (2000 ms latency, 50 KB/s) measured the panel with
  `getBoundingClientRect()`: skeleton 220px, ERROR 220px, SUCCESS 236px at
  both 375px and 1440px. Evidence: `evidence/3.2-verify.json` (`note`
  records the first-run 236px reading; captured data, not a DevTools panel
  screenshot).
- **Engineering Refactor / Manual Fix:** Tightened the panel so every state
  fits 220px: `.panel` padding `0.75rem var(--gap)`, `.panel h3`
  `margin: 0 0 0.25rem; font-size: 1.125rem;`, `.stats` gap
  `0.125rem 1rem`, plus a one-line comment stating the 220px invariant.
  Shipped in the Task 3.2 commit `3aa6512`.
- **Verification Evidence:** Re-ran the same throttled Playwright script:
  skeleton, SUCCESS and ERROR are all 220px at 375px and 1440px, and
  `PerformanceObserver` (`layout-shift`) reports CLS 0 across LOADING ->
  SUCCESS -> ERROR -> Retry -> SUCCESS. `evidence/3.2-verify.json`,
  `evidence/3.2-skeleton-1440px.png`, `evidence/3.2-after-retry-375px.png`.

## AI Failure 03: Min IQ input cannot be cleared (forced "0", shows "0180")

- **AI Prompt:** Task 2.2 Search, filter, sort: derived during render, zero
  `useEffect`; `<label htmlFor>` + `useId()`; `valueAsNumber`; `toSorted()`.
- **AI Generated Code:** `ScientistDirectory.jsx` handled the Min IQ input
  with `setMinIq(Number.isNaN(value) ? 0 : value)` and bound
  `value={minIq}`. An empty field gives `valueAsNumber === NaN`, so state
  becomes `0` and React writes `0` back into the controlled input. The field
  can never be empty, and typing after clearing appends to the forced zero.
- **Risk:** Keyboard and mouse users cannot clear the field to type a new
  threshold; the input shows "0180" while the filter uses 180, so what is on
  screen no longer matches the applied value. Screen readers announce the
  stray leading zero. Breaks the "type-safe numeric filtering" intent of the
  slide contract.
- **Detection Method / DevTools Proof:** Found during the In-class re-audit.
  Playwright keyboard on Chrome 156: focus Min IQ (160), Ctrl+A, Backspace,
  then type 1, 8, 0. `inputValue` sequence: "0", "01", "018", "0180".
  Evidence: `evidence/2.2-minIq-before-fix.json`,
  `evidence/2.2-minIq-0180-before-fix.png` (real screenshot of the form).
- **Engineering Refactor / Manual Fix:** `handleMinIq` now stores `''` when
  `valueAsNumber` is `NaN`, so the controlled input can stay empty; the
  render derives `minIqValue = minIq === '' ? 0 : minIq` for the filter, so
  an empty field still means "no minimum". `valueAsNumber` is still the only
  parser and no `useEffect` was added.
- **Verification Evidence:** Same Playwright sequence (Ctrl+A, Backspace,
  type 2, 0, 0): `inputValue` "", "2", "20", "200"; status "Found 6
  pioneers" while empty and "Found 3 pioneers" at 200 (Goethe, Einstein,
  Sidis); each keystroke still causes exactly 1 React commit; console has 0
  errors and 0 warnings; `npm run build` passes.
  `evidence/2.2-minIq-after-fix.json`, `evidence/2.2-minIq-200-after-fix.png`.
