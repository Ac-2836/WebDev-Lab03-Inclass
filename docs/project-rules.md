# project-rules.md

My working contract with AI for Lab 03 In-class. The AI must read and follow this file in full before starting any task. Sections 1-4 are my standing way of working with AI (copied from the master rules); section 5 holds the Lab 03 global rules; section 6 holds the rules specific to the In-class sprints.

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
