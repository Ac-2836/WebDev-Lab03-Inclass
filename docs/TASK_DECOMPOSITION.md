# TASK_DECOMPOSITION.md: Lab 03 In-class Sprints

Work Breakdown Structure. One row = one atomic subtask = one AI prompt = one
verified commit. Tick a task only after I have verified it.

**Level:** Core = must master and implement myself; Awareness = understand
for debugging/lookup (Lab 03 3-tier taxonomy). **Commit** messages are used
verbatim.

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [x] 0.1 Scaffold project | Awareness | build | React 19 + Vite; `createRoot` + `StrictMode`; no extra deps | `chore: init react19 vite & rules` | `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `.gitignore`, `README.md` |
| - [x] 0.2 Spec documents | Core | docs | WBS, AI rules, and audit template before any code | `docs(spec): task decomposition, project rules & failure audit initialization` | `docs/TASK_DECOMPOSITION.md`, `docs/project-rules.md`, `docs/AI_FAILURE_AUDIT.md` |
| - [ ] 1.1 Semantic profile card | Core | ex1 | Zero `<div>`; `<article>` + `<header>`/`<hgroup>` + `<dl>` via `Object.entries` + `<Fragment key>`; `<ul>` skills with stable keys; HTTPS avatar, explicit size, fallback initials; ES6 default props | `feat(ex1): implement semantic DeveloperCard and SkillBadge` | `src/components/DeveloperCard.jsx`, `src/components/SkillBadge.jsx` |
| - [ ] 1.2 Responsive card styles | Core | ex1 | CSS Module + Custom Properties; no inline style; zero horizontal scroll at 375px | `style(ex1): add responsive 375px CSS module` | `src/components/DeveloperCard.module.css` |
| - [ ] 2.1 Normalize dataset | Core | ex2 | `SMART_PEOPLE` with stable ids (`sp-1` ...); render list with `key={p.id}` | `feat(ex2): normalize smartPeople schema with stable IDs` | `src/components/ScientistDirectory.jsx` (dataset + list) |
| - [ ] 2.2 Search, filter, sort | Core | ex2 | Derived during render, zero `useEffect`; `<label htmlFor>` + `useId()`; `valueAsNumber`; `toSorted()` | `feat(ex2): add search, IQ filter & toSorted` | search, Min-IQ, sort controls |
| - [ ] 2.3 Delete, reset, live status | Core | ex2 | Immutable `filter` delete; reset to snapshot; `<output role="status" aria-live="polite">` count | `feat(ex2): add delete/reset & live status` | delete/reset buttons, live counter |
| - [ ] 3.1 Telemetry state machine | Core | ex3 | `'IDLE' \| 'LOADING' \| 'SUCCESS' \| 'ERROR'`; simulated 35% packet loss; `AbortController` cleanup; ignore `AbortError` | `feat(ex3): implement PUBG VN 4-state telemetry & AbortController` | `src/components/PubgMatchTelemetry.jsx`, `PUBG_VN_SQUADS`, mock fetch |
| - [ ] 3.2 Skeleton and retry alert | Core | ex3 | 220px `aria-busy` skeleton (0.00 CLS); `<section role="alert">` + Retry; no `window.alert()` | `feat(ex3): add skeleton UI & retry alert` | skeleton styles, retry button |
