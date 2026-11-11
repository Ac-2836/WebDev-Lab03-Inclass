# AI Failure Audit

This report records failures observed while implementing and verifying
Lab 03 (In-class sprints, Homework 1-3 and the Bonus exercise). Entries
01-03 belong to the In-class sprints; homework and Bonus entries continue
the same numbering and name the part in the title. Each entry is logged
before the AI is asked to fix the subtask. Screenshots listed as
verification evidence show the corrected UI; they are not presented as
screenshots of the original failure.

<!--
Copy this template for each failure (number entries 01, 02, 03, ...;
homework entries add the part, e.g. "AI Failure 04 (HW 1): ..."):

## AI Failure NN (<part>): <short title>

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

## AI Failure 04 (HW 1): Ctrl+A triggers the Kick pad and blocks Select All

- **AI Prompt:** Task H1.3 Keyboard hook: slide contract
  `useDrumKeyboard(padMap, onTriggerPad, isEnabled)`; `keydown` + `e.code`;
  `e.repeat` guard; ignore INPUT/TEXTAREA/SELECT; cleanup.
- **AI Generated Code:** `useDrumKeyboard.js` follows the slide handler:
  after the `e.repeat` and text-field guards it looks up `padMap.get(e.code)`
  and, for a pad, calls `e.preventDefault()` and `onTriggerPad(pad.id)`.
  Nothing checks `e.ctrlKey`, `e.metaKey`, or `e.altKey`, so browser and OS
  shortcuts that share a pad's physical key are treated as drum hits.
- **Risk:** Ctrl+A (Select All), Ctrl+S, Ctrl+W, Alt+key accessibility and
  assistive-technology shortcuts fire a drum hit and, because of
  `preventDefault()`, the shortcut itself stops working (WCAG 2.1.4 Character
  Key Shortcuts: shortcuts must not hijack modified keys). Screen reader and
  keyboard-only users lose standard commands while the drum tab is open.
- **Detection Method / DevTools Proof:** Found while verifying task H1.3.
  Playwright on Chrome, focus on body, `Control+KeyA`: the window `keydown`
  log shows `Ctrl+KeyA:prevented=true` and the "A Kick" pad reports
  `aria-pressed="true"`. Evidence: `evidence/h1.3-ctrlA-before-fix.json`
  (captured events, not a DevTools panel screenshot).
- **Engineering Refactor / Manual Fix:** Added one guard in the `keydown`
  handler of `useDrumKeyboard.js`, right after the `e.repeat` check:
  `if (e.ctrlKey || e.metaKey || e.altKey) return;`. Shift is deliberately
  allowed (Caps/Shift must not silence a pad). The hook signature is
  unchanged. Shipped in the task H1.3 commit.
- **Verification Evidence:** Same Playwright check after the fix:
  `Control+KeyA`, `Control+KeyS`, `Alt+KeyW` and `Meta+KeyD` trigger no pad
  and `defaultPrevented` is false; Select All still selects the page text;
  plain `A` still hits Kick and `Shift+W` still hits Crash; `npm run build`
  passes. `evidence/h1.3-verify.json`.

## AI Failure 05 (HW 1): chords of pads clip the audio output

- **AI Prompt:** Task H1.4 Synth drum voices: Web Audio synthesized voices,
  no sample files; `AudioContext` after a user gesture; closed on unmount.
- **AI Generated Code:** `drum-audio.js` sums every voice into one fixed
  master `GainNode` (`MASTER_LEVEL = 0.6`) wired straight to
  `ctx.destination`. Each voice peaks near 1.0 on its own (kick 0.96, snare
  1.09), so the fixed gain only protects a single hit; simultaneous pads add
  up with nothing limiting the sum.
- **Risk:** Hard clipping at the destination: kick + snare, the most common
  drum combination, and any chord of pads play distorted. The slide asks for
  polyphony without clipping in the same spirit as HW 2 (8 voices).
- **Detection Method / DevTools Proof:** Found while verifying task H1.4.
  Real `playVoice()` voices rendered offline in Chrome through the 0.6
  master gain and the samples above 1.0 counted: snare alone peak 0.724 (0
  over); kick + snare peak 1.253 (7 samples over); kick + snare + tom + crash
  1.789 (98 over); all seven pads 2.235 (109 over). Evidence:
  `evidence/h1.4-chord-clipping-before-fix.json` (measured data, not a
  DevTools panel screenshot).
- **Engineering Refactor / Manual Fix:** Replaced the fixed master gain
  with `createMasterBus(ctx)` in `drum-audio.js`: all voices feed a
  `DynamicsCompressorNode` used as a limiter (threshold -18 dB, knee 0,
  ratio 20, attack 1 ms, release 0.12 s) followed by an output gain of 1.4
  chosen from the offline measurements. `createDrumAudio()` and the tests use
  the same function. Shipped in the task H1.4 commit.
- **Verification Evidence:** The same offline renders through
  `createMasterBus`: snare alone 0.59, kick alone 0.483, kick + snare 0.75,
  kick + snare + tom + crash 0.904, all seven pads 0.894, with 0 samples over
  1.0 in every case. On a fresh page the first gesture creates one running
  `AudioContext`, all 12 sources end and are disconnected, and leaving the tab
  closes the context. `evidence/h1.4-verify.json`.

## AI Failure 06 (HW 3): countdown hook re-renders cards 35 times a second

- **AI Prompt:** Task H3.2 Anti-drift airdrop timer: slide contract
  `usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0)` returning
  `{ remainingMs, isLive }`; 200 ms tick + `visibilitychange` resync; cleanup.
- **AI Generated Code:** `usePubgAirdropTimer.js` calls
  `setRemainingMs(remainingMsAt(...))` on every 200 ms tick. The value
  changes every tick, so every tick commits a render, although the countdown
  is shown in whole seconds (`mm:ss`). `CrateDropCard` (H3.3) uses two of
  these hooks (drop time and expiry time), so each card has two timers.
- **Risk:** With 4 cards (8 timers) the arena renders about 35 commits per
  second while nothing changes on screen, 5 to 8 times more than needed,
  wasting CPU and battery on the page users keep open for hours waiting for
  a drop.
- **Detection Method / DevTools Proof:** Found while verifying task H3.6
  (a per-keystroke commit count read 1, 3, 4 instead of 1). Playwright on
  Chrome with a React commit hook, HW 3 tab idle for 3 s: 105 commits and 91
  `CrateDropCard` renders, while the four visible countdowns changed only
  once per second (about 12 text changes in total). Evidence: counts above
  (measured, not a DevTools panel screenshot).
- **Engineering Refactor / Manual Fix:** In `usePubgAirdropTimer.js` the
  tick now calls `setRemainingMs((prev) => ...)` and returns `prev` when
  `Math.ceil(prev / 1000) === Math.ceil(next / 1000)`, so React bails out of
  the render unless the displayed second changes (or the countdown reaches
  zero). The hook signature and the wall-clock calculation are unchanged;
  `remainingMs` is now refreshed once per displayed second.
- **Verification Evidence:** Same measurement, HW 3 tab idle for 3 s: 30
  commits and 18 `CrateDropCard` renders (was 105 and 91). A keystroke in the
  leaderboard filter is exactly 1 commit each (was 1, 3, 4). With the fake
  clock paused at a fixed time and advanced in 100 ms steps, the first card
  shows 00:20, 00:19, ..., 00:01 (20 values, each exactly 1 s apart) and then
  changes to "Airdrop live" with the 05:00 claim window; a 60 s throttled jump
  and a `visibilitychange` still show the exact remaining time.

## AI Failure 07 (HW 3): virtual window starts past the end of the list

- **AI Prompt:** Task H3.7 Virtual kill feed: windowed list, only visible rows
  plus overscan in the DOM; labelled scroll region.
- **AI Generated Code:** `getVisibleWindow` in `kill-feed.js` clamps `end` to
  `total` but not `start`:
  `start = Math.max(0, firstVisible - overscan)`. When the scroll offset is
  larger than the list (`scrollTop` beyond `total * rowHeight`), `start`
  lands past `total` and `events.slice(start, end)` is empty.
- **Risk:** A scroll position that is stale for a moment (the list shrinks
  while the user is scrolled down, or an overscroll/zoom jump) renders an
  empty feed with a full-height scrollbar until the next scroll event.
  Latent today: browsers clamp `scrollTop`, so the current UI cannot reach it,
  but any later filter on the feed would.
- **Detection Method / DevTools Proof:** Found while verifying task H3.7 with
  an edge-case check of the pure function in Chrome:
  `getVisibleWindow({ scrollTop: 999999, viewportHeight: 320, rowHeight: 40,
  total: 5000 })` returned `{ start: 24995, end: 24995 }` (start greater than
  total, zero rows). Evidence: that return value (measured, not a DevTools
  panel screenshot).
- **Engineering Refactor / Manual Fix:** `getVisibleWindow` now clamps both
  `firstVisible` and `lastVisible` to `total` before applying the overscan,
  so `0 <= start <= end <= total` always holds. Shipped in the task H3.7
  commit.
- **Verification Evidence:** Same call after the fix returns
  `{ start: 4996, end: 5000 }` (the last rows); a list that shrinks to 100
  rows while scrolled to row 3000 returns `{ start: 96, end: 100 }`; a sweep of
  261 offsets from -100 to 260000 px produced no window with `start` below 0,
  `end` above `total`, or `start` above `end`. In the page the virtual list
  keeps 12 to 16 of 5000 rows in the DOM, `aria-posinset` runs 1 to 5000, and
  jumping to 8 scroll offsets never left blank space.
