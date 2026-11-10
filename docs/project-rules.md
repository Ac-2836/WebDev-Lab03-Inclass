# project-rules.md

My working contract with AI for Lab 03 (In-class sprints and homeworks, one repo). The AI must read and follow this file in full before starting any task. Sections 1-4 are my standing way of working with AI (copied from the master rules); section 5 holds the Lab 03 global rules; section 6 holds the rules specific to the In-class sprints; section 7 holds the rules shared by all homeworks; sections 8-10 hold the rules specific to Homework 1-3.

---

## 1. Mandatory Workflow Contract

### Pipeline: who owns which stage

1. **Functional Slicing** (me): break requirements into small, isolated subtasks in `TASK_DECOMPOSITION.md`.
2. **Contract-First** (me): define interfaces, types, or JSDoc before asking AI to generate code.
3. **Atomic Generation** (AI): generate exactly one function or module for exactly one subtask.
4. **Independent Verification** (me): verify the output with tests, debugging tools, and `git diff`.

### Before generating

- Read `project-rules.md` first. Work only on the subtask named in the prompt; never pick up other subtasks.
- If the task is ambiguous or conflicts with these rules, stop and ask. Do not guess.
- Never change a contract I have provided.

### While generating

- Return only the requested function or module. No extra files, features, dependencies, optimizations, or refactors outside the scope.
- Do not modify code from earlier verified subtasks unless I ask.
- Follow the Code Conventions and Banned Patterns below.
- Never invent APIs. If unsure an API exists, say so explicitly.

### After generating

- Never claim the code is "tested" or "verified". Only I decide a subtask is done.
- No commit until verification is complete.
- If the output is wrong, I log it in `AI_FAILURE_AUDIT.md` first. Then the AI fixes only that subtask, based on the failure evidence I provide.

---

## 2. Roles

### AI

- Primary code generator. Follows my rules and assigned tasks strictly, with no overstepping.
- Joins project planning and documentation/specification discussions only when I ask.

### Me

- Author of the technical contracts that control AI behavior.
- Verifier and tester of everything the AI produces.
- Owner of the ideas and direction of the project: I lead, control, and confirm.

---

## 3. Code Conventions (stack-specific, adjust per project)

Current stack: React 19 + Vite + JavaScript (JSX, ES2024), following the Google JS Style Guide.

| Item | Rule |
|---|---|
| Variables, functions, methods, properties | `camelCase` |
| React components, component files | `PascalCase` (`DeveloperCard.jsx`, `DeveloperCard.module.css`) |
| Custom hooks | `camelCase` with `use` prefix (`useDrumKeyboard`) |
| Module/global constants | `UPPER_SNAKE_CASE` |
| Other files, directories | `kebab-case` |
| Indentation | 2 spaces, no tabs |
| Line length | 80 characters max |
| Semicolons | Required |
| Strings | Single quotes `'...'`; template literals only for interpolation |
| Variable declarations | `const` by default, `let` only when reassigning |
| Exports | Named exports (`export function App()`) |
| DOM | Render text through JSX `{value}` only; never `dangerouslySetInnerHTML` |

### Banned patterns

| Banned | Use instead |
|---|---|
| `var`, implicit globals | `const`, `let` |
| `keypress`, `e.keyCode` | `keydown`, `e.key` / `e.code` |
| Raw `innerHTML` / `dangerouslySetInnerHTML` | JSX text interpolation |
| Inline HTML handlers (`onclick="..."`), manual `addEventListener` on JSX elements | React event props (`onClick`, `onChange`) |

---

## 4. Git Commit Convention

### Format

```
<type>(<scope>): <description>

[optional body: explain why]
```

### Types

| Type | Use when |
|---|---|
| `feat` | Adding a new feature or function |
| `fix` | Fixing a bug |
| `refactor` | Restructuring code without changing behavior |
| `test` | Adding or changing tests or assertions |
| `docs` | Documentation-only changes |
| `style` | Formatting only, no logic change |
| `perf` | Performance improvement |
| `chore` | Maintenance tasks (config, cleanup) |
| `build` | Build system or dependency changes |
| `revert` | Reverting a previous commit |

### Scope

The module or feature area the change touches (for example `auth`, `api`, `ui`). Keep a consistent set per project. Use `docs` for documentation files.

### Writing rules

- Subject line in imperative mood ("implement", not "implemented" or "implements").
- Lowercase, no trailing period, 72 characters max (aim for under 50).
- One subtask per commit, and only after it is verified.
- Never bundle unrelated changes into one commit.
- If a project or course mandates exact commit messages, use them verbatim.
- Write commits in English.

---

## 5. Lab 03 Global Rules (apply to every Lab 03 exercise and homework)

Source: Lab 03 slides (Production React 19, KRAFTON PUBG VN & 'Hẹn Hò Nhưng
Không Yêu' State Machine).

### Tooling

- React 19 + Vite + ES2024. Mount with `createRoot` from `react-dom/client`
  inside `<StrictMode>`.
- Mandatory artifacts in `docs/`: `project-rules.md`,
  `TASK_DECOMPOSITION.md` (WBS), `AI_FAILURE_AUDIT.md`.
- Never prompt the AI with a whole Exercise or Homework (one-shot prompting
  scores 0% on the 15% Git & Audit rubric). One subtask per prompt.
- Out of scope for Lab 03 (Tier 3, later labs): global state managers
  (Zustand, Redux Toolkit), routers (TanStack Router, Next.js), React Server
  Components.

### Banned legacy APIs

| Banned | Use instead |
|---|---|
| `ReactDOM.render()` | `createRoot(el).render()` |
| `class extends React.Component` | Pure function components |
| `Component.defaultProps` | ES6 default parameters in destructuring |
| `import * as React` | Named imports (`import { useState } from 'react'`) |
| `antd/dist/antd.css`, `http://` URLs | Scoped CSS Modules, HTTPS only |
| `setTimeout` in a constructor / render body | `useEffect` with cleanup |
| `window.alert()` | `role="alert"` / `role="status"` regions |
| `keypress`, `keyCode` | `keydown` + `e.code` |

### Markup and accessibility

- Semantic JSX only (`<main>`, `<section>`, `<article>`, `<header>`,
  `<hgroup>`, `<dl>`, `<dt>`, `<dd>`, `<figure>`, `<output>`). Div-soup is
  banned. Exactly one top-level `<main>` containing `<section>` / `<article>`.
- Group siblings with `<Fragment>` / `<>...</>`, not wrapper `<div>`s.
- Key-value data uses `<dl>` / `<dt>` / `<dd>`, never repeated headings.
- Every `<input>` / `<select>` is paired with `<label htmlFor={id}>` where
  `id` comes from `useId()`.
- Number inputs read `e.target.valueAsNumber` with a `Number.isNaN` fallback.
- Every action `<button>` has `type="button"`.
- Images: HTTPS, explicit `width` / `height` (zero CLS), meaningful `alt`.
- Responsive from 375px to 1440px with zero horizontal scroll; WCAG 2.2 AA;
  Lighthouse Accessibility 100.

### State and rendering

- Components are pure: `UI = f(props, state)`.
- List items use a stable, unique entity id as `key`. `key={index}` and
  raw string values as keys are banned. Map objects with
  `Object.entries()`; use `<Fragment key>` for `<dt>`/`<dd>` pairs.
- Immutable updates only (`[...prev, x]`, `filter`, `map`, `toSorted`).
  `push`, `splice`, and in-place `sort` on state are banned.
- Derived data (filter, sort, counts) is computed during render. Syncing
  derived state through `useState` + `useEffect` is banned.
- Async UI uses an explicit finite state machine
  (`'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'` or a stricter domain-specific
  variant). No boolean flag soup.
- Optimize only after profiling (React DevTools Profiler). No premature
  `memo` / `useMemo` / `useCallback`.

### Effects and memory safety

- Every timer, listener, subscription, or fetch inside `useEffect` returns a
  cleanup (`clearTimeout`, `removeEventListener`, `controller.abort()`).
- Fetches use `AbortController`; an `AbortError` never sets the `ERROR`
  state.
- Dependency arrays are honest: every reactive value read in the effect is
  listed (no stale closures).

### Evaluation (keep the repo defensible at all times)

- Live defense (25% of the lab grade): AI tools closed; the instructor
  checks `git log`, DevTools (zero console warnings, 375px layout), then
  mutates one requirement, and I must refactor and verify within 60-180 s.
  Code I cannot explain or verify scores zero.
- AI failure audit (15% of the lab grade, with Git): at least 3 AI defects
  logged in `docs/AI_FAILURE_AUDIT.md` with DevTools proof and the manual fix;
  at least 6-8 atomic commits matching `TASK_DECOMPOSITION.md`.

---

## 6. In-class Rules: Sprints 1-3 (180-minute session)

Commit messages for each sprint are mandated by the slides and used verbatim.

### Exercise 1: Semantic Engineer & Pro-Gamer Profile Card (35 min)

- Build `<DeveloperCard />` and `<SkillBadge />`.
- ZERO `<div>` inside `DeveloperCard.jsx`.
- Metrics rendered as `<dl>` via `Object.entries()` + `<Fragment key>`;
  skills as `<ul aria-label>` with `key={skill.id}`.
- Styles in `DeveloperCard.module.css` with CSS Custom Properties; no inline
  `style={{...}}`.
- Avatar: HTTPS only, explicit `width` / `height`, fallback initials.
- Checkpoint 1: `grep -n '<div'` and `grep -n 'http://'` on
  `DeveloperCard.jsx` return 0 matches; Accessibility Tree shows
  `article -> header + dl + list`; zero horizontal scroll at 375px.

### Exercise 2: Interactive Scientist & Pioneer Directory (45 min)

- `SMART_PEOPLE` dataset with stable ids (`sp-1` ...).
- Features: case-insensitive name search, Min-IQ filter
  (`valueAsNumber`), sort by IQ / Age with `toSorted()`, delete and reset.
- Only raw inputs live in `useState` (`people`, `query`, `minIq`, `sortBy`);
  the visible list is derived during render. Zero `useEffect` for filtering
  or sorting.
- Every control bound with `<label htmlFor>` + `useId()`; result count in
  `<output role="status" aria-live="polite">`.
- Checkpoint 2: typing one character causes exactly one render pass
  (React Profiler); deleting a row keeps focus and remaining keys stable.

### Exercise 3: KRAFTON PUBG VN Live Match Telemetry (35 min)

- `<PubgMatchTelemetry />` for squads CES, TE, GE (`PUBG_VN_SQUADS`).
- 4-state machine `'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'`.
- Simulated 35% packet loss; switching squads aborts the stale request via
  `AbortController`; `AbortError` is ignored.
- `LOADING` shows a 220px pulsing skeleton with `aria-busy="true"` (0.00 CLS).
- Errors render in `<section role="alert">` with a
  'Reconnect Satellite (Retry)' button that bumps a retry counter.
- Checkpoint 3: Slow 3G shows 0.00 CLS; rapid CES -> TE -> GE clicks show
  canceled requests in the Network panel.

---

## 7. Homework Common Rules (apply to sections 8-10)

- Deadline window: 1 week per homework. Same repo as the In-class sprints;
  the submitted In-class state is frozen at tag `inclass-submission`.
- Each homework lives in its own folder under `src/homeworks/`
  (`DrumMachine/`, `GrandPiano88/`, `KraftonPubgVnArena/`) and is mounted as
  its own tab in `App.jsx`. Homework code never edits In-class components.
- Commit scope is the homework id (`hw1`, `hw2`, `hw3`); the slides mandate
  no exact messages for homeworks, so `TASK_DECOMPOSITION.md` is the source.
- No new runtime dependencies. Audio is synthesized with the Web Audio API
  (no downloaded sample files); data is local mock data.
- Every homework logs its own AI defects in `docs/AI_FAILURE_AUDIT.md`,
  continuing the shared numbering and naming the homework in the title,
  e.g. `## AI Failure 04 (HW 1): ...`. HW 3 requires at least 3 entries.

---

## 8. HW 1 Rules: Production Studio Drum Kit (WCAG 2.2 AA, Lighthouse 100)

### Scope

- Modernize the legacy drum kit (keys W, A, S, D, J, K, L) into a studio app
  in `src/homeworks/DrumMachine/`.
- Follow the slide hook contract; do not change it without my approval:

```js
export function useDrumKeyboard(padMap, onTriggerPad, isEnabled = true);
// padMap: Map<KeyboardEvent.code, { id, label, ... }>
```

### Hard constraints

- Listen on `window` `keydown` / `keyup` and match `e.code` (`'KeyW'`,
  `'KeyA'`, `'KeyS'`, `'KeyD'`, `'KeyJ'`, `'KeyK'`, `'KeyL'`), never
  `keyCode` / `e.key`, so Vietnamese IME (UniKey) never breaks triggers.
- Anti-repeat guard: `if (e.repeat) return;`. Ignore shortcuts while focus is
  in `INPUT`, `TEXTAREA`, or `SELECT`. `preventDefault()` only on a matched
  pad. Listeners removed in the effect cleanup.
- Pads are `<button type="button" aria-pressed={isActive}>` with a visible
  key hint; pads also work by mouse, touch, and Enter/Space.
- Deaf / hard-of-hearing support: a hit history in
  `<output aria-live="polite">` and a visual level (decibel) meter beside
  the pads; no information conveyed by sound alone.
- `AudioContext` created only after a user gesture; closed, and every
  animation frame / node released, on unmount.
- WCAG 2.2 AA: contrast >= 4.5:1, visible `:focus-visible`, accessible name
  on every control, 375px with zero horizontal scroll. Lighthouse
  Accessibility 100 verified and kept as evidence.

---

## 9. HW 2 Rules: 88-Key Polyphonic Piano & Concurrent FIFO Sequencer

### Scope

- 88-key piano (A0 to C8) with polyphony, recording, and replay in
  `src/homeworks/GrandPiano88/`, combining Lab 2's `shallowEqual` memo and
  FIFO `AudioTaskQueue` ideas.
- Follow the slide contracts; do not change them without my approval:

```js
export const PianoKey = memo(function PianoKey({
  midi, noteName, isBlack, isPressed, onNoteOn, onNoteOff,
}) { /* <button type="button" aria-pressed={isPressed}> */ });

export class PolyphonicSynth {
  constructor(maxVoices = 8);   // voices: Map<midi, { osc, gain }> (FIFO)
  noteOn(midi, freqHz);
  noteOff(midi);
}
```

- A plain JavaScript class is allowed for the audio engine (slide
  contract); React components stay pure functions.

### Hard constraints

- Keys generated by a pure function over MIDI 21-108 with
  `f = 440 * 2 ** ((midi - 69) / 12)`; exactly 52 white and 36 black keys.
  Hardcoding 88 key tags is banned.
- Polyphony capped at 8 voices; the 9th concurrent note steals the oldest
  voice in FIFO order (`voices.keys().next().value`).
- Click-free release: `gain.exponentialRampToValueAtTime(0.0001,
  ctx.currentTime + 0.04)` before `osc.stop()`; nodes disconnected after.
- `React.memo` render isolation: pressing one key re-renders only that key,
  verified in the React Profiler (or an equivalent commit count). Callbacks
  passed to keys must be referentially stable.
- Recorder stores `{ midi, freqHz, durationMs, deltaMs }` in FIFO order;
  replay runs asynchronously at 0.5x, 1.0x, or 2.0x.
- 'Stop Sequence' aborts replay via `AbortController`: pending timers
  cancelled, active oscillators silenced. Same cleanup on unmount.
- The 88-key strip scrolls inside a labelled region; the page itself has
  zero horizontal scroll at 375px.

---

## 10. HW 3 Rules: KRAFTON x PUBG Vietnam Championship & Airdrop Arena

### Scope

- PVS Finals Ticket & G-Coin Crate Arena in
  `src/homeworks/KraftonPubgVnArena/`, evolving Lab 2 HW 3's
  `createAntiDriftTimer` and the Slide 22 virtual scroller.
- Follow the slide contracts; do not change them without my approval:

```ts
export type DropPhase = 'WARMUP' | 'AIRDROP_LIVE' | 'LOOTED_OUT' | 'EXPIRED';
export interface PubgCrateDrop {
  readonly id: string;
  readonly title: string;          // 'PVS Finals VIP Pass + 5,000 G-Coin'
  readonly priceVnd: number;       // Intl.NumberFormat('vi-VN')
  readonly remainingStock: number;
  readonly dropEpochMs: number;
}
export interface PubgVnSquadStanding {
  readonly squadId: string;        // 'te' | 'ces' | 'ge' | 'agg'
  readonly squadName: string;
  readonly wwcdCount: number;
  readonly placementPts: number;
  readonly killPts: number;
}
export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0);
// returns { remainingMs, isLive }
```

### Hard constraints

- Zero-drift countdown: remaining time is always
  `Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs))`, recomputed on
  each interval tick and immediately on `visibilitychange` to visible.
  `setInterval((s) => s - 1)` style counters are banned. Interval and
  listener removed in cleanup.
- Optimistic claim: an in-flight `claimId` lock blocks duplicate clicks;
  stock is decremented optimistically and rolled back when the mock server
  answers `409 Looted Out`. The mock server is local, async, and abortable.
- Prices formatted with `Intl.NumberFormat('vi-VN', { style: 'currency',
  currency: 'VND' })`.
- Leaderboard filter and sort (WWCD, placement points, kill points) are
  derived during render with `toSorted()`; zero `useEffect` for them.
- The kill feed renders through a windowed (virtual) list: only visible rows
  plus a small overscan are in the DOM.
- Claim results and phase changes are announced through `role="status"`;
  failures through `role="alert"`. No `window.alert()`.
- `docs/AI_FAILURE_AUDIT.md` gains at least 3 verified HW 3 entries.
