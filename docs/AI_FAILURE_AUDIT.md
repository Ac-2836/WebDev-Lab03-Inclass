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
