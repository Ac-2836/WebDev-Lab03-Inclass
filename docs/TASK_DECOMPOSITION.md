# TASK_DECOMPOSITION.md: Lab 03

Work Breakdown Structure. One row = one atomic subtask = one AI prompt = one
verified commit. Tick a task only after I have verified it.

**Level:** Core = must master and implement myself; Awareness = understand
for debugging/lookup (Lab 03 3-tier taxonomy). **Commit** messages are used
verbatim. Task IDs: `0.x`-`3.x` In-class, `H1.x` / `H2.x` / `H3.x`
Homework 1-3, `B.x` Bonus (part of the homework).

## In-class Sprints

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

## Homework 1: Production Studio Drum Kit

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] H1.1 Pad contract and tab | Core | hw1 | 7 pads keyed by `e.code` (`KeyW` ... `KeyL`) in a `Map`; HW 1 tab in `App.jsx` | `feat(hw1): define drum pad map and mount tab` | `src/homeworks/DrumMachine/drum-pads.js`, `src/homeworks/DrumMachine/DrumMachine.jsx` (shell), `src/App.jsx` |
| - [ ] H1.2 Semantic pad grid | Core | hw1 | `<button type="button" aria-pressed>` pads with key hint; mouse, touch, Enter/Space | `feat(hw1): render accessible drum pad grid` | `src/homeworks/DrumMachine/DrumMachine.jsx` |
| - [ ] H1.3 Keyboard hook | Core | hw1 | Slide `useDrumKeyboard(padMap, onTriggerPad, isEnabled)`; `keydown`/`keyup` + `e.code`; `e.repeat` guard; ignore INPUT/TEXTAREA/SELECT; cleanup | `feat(hw1): add useDrumKeyboard hook with repeat guard` | `src/homeworks/DrumMachine/useDrumKeyboard.js` |
| - [ ] H1.4 Synth drum voices | Awareness | hw1 | Web Audio synthesized voices, no sample files; `AudioContext` after a user gesture; closed on unmount | `feat(hw1): synthesize drum voices with web audio` | `src/homeworks/DrumMachine/drum-audio.js` |
| - [ ] H1.5 Visual hit feedback | Core | hw1 | Slide "Deaf / Hard-of-Hearing Visual Hit Log": hit history in `<output aria-live="polite">` (latest N, stable keys) and an `AnalyserNode` level meter; rAF loop cancelled on unmount | `feat(hw1): add live hit log and decibel meter` | hit log + meter in `src/homeworks/DrumMachine/` |
| - [ ] H1.6 Accessible theme | Core | hw1 | CSS Module; contrast >= 4.5:1; `:focus-visible`; zero horizontal scroll at 375px | `style(hw1): add accessible responsive drum theme` | `src/homeworks/DrumMachine/DrumMachine.module.css` |
| - [ ] H1.7 Lighthouse audit | Core | hw1 | Lighthouse Accessibility 100; fix every finding | `docs(hw1): record lighthouse audit` | `docs/VERIFICATION.md` (HW 1 section; screenshots stay in git-ignored `evidence/`) |

## Homework 2: 88-Key Polyphonic Piano & FIFO Sequencer

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] H2.1 Key generation | Core | hw2 | Pure generator over MIDI 21-108, `f = 440 * 2 ** ((midi - 69) / 12)`; 52 white + 36 black asserted; no hardcoded keys; HW 2 tab | `feat(hw2): generate 88 piano keys mathematically` | `src/homeworks/GrandPiano88/piano-keys.js`, `src/App.jsx` |
| - [ ] H2.2 Polyphonic synth | Awareness | hw2 | Slide `PolyphonicSynth`; 8 voices in a `Map`; FIFO steal on the 9th; 0.04s exponential release before `stop()` | `feat(hw2): add polyphonic synth with fifo voice stealing` | `src/homeworks/GrandPiano88/PolyphonicSynth.js` |
| - [ ] H2.3 Memoized keyboard | Awareness | hw2 | Slide `PianoKey` with `memo`; `aria-pressed`; stable callbacks so only the pressed key re-renders | `feat(hw2): render memoized 88-key keyboard` | `src/homeworks/GrandPiano88/PianoKey.jsx`, `src/homeworks/GrandPiano88/GrandPiano88.jsx` |
| - [ ] H2.4 Pointer and keyboard play | Core | hw2 | `onPointerDown`/`Up`/`Leave` plus Enter/Space on focused key; notes always released | `feat(hw2): wire pointer and keyboard note input` | `src/homeworks/GrandPiano88/GrandPiano88.jsx` |
| - [ ] H2.5 FIFO recorder | Core | hw2 | Record `{ midi, freqHz, durationMs, deltaMs }` in FIFO order | `feat(hw2): record note events in fifo order` | recorder in `src/homeworks/GrandPiano88/` |
| - [ ] H2.6 Abortable replay | Core | hw2 | Async replay at 0.5x / 1.0x / 2.0x; 'Stop Sequence' aborts via `AbortController` and silences voices; cleanup on unmount | `feat(hw2): add abortable variable-speed replay` | replay controls in `src/homeworks/GrandPiano88/` |
| - [ ] H2.7 Responsive theme | Core | hw2 | CSS Module; key strip scrolls in a labelled region; page has zero horizontal scroll at 375px; focus visible | `style(hw2): add responsive piano theme` | `src/homeworks/GrandPiano88/GrandPiano88.module.css` |
| - [ ] H2.8 Render and audio audit | Core | hw2 | Profiler: 1 key press re-renders 1 key; no orphan oscillators after stop/unmount; Lighthouse Accessibility 100 | `docs(hw2): record render isolation and audio audit` | `docs/VERIFICATION.md` (HW 2 section; screenshots stay in git-ignored `evidence/`) |

## Homework 3: KRAFTON x PUBG Vietnam Championship & Airdrop Arena

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] H3.1 Domain contract and data | Core | hw3 | Slide `DropPhase`, `PubgCrateDrop`, `PubgVnSquadStanding` as JSDoc; mock drops (VND) and standings (TE, CES, Roy Esports, AGG); HW 3 tab | `feat(hw3): define pvs arena domain contract and data` | `src/homeworks/KraftonPubgVnArena/arena-data.js`, `src/App.jsx` |
| - [ ] H3.2 Anti-drift airdrop timer | Awareness | hw3 | Slide `usePubgAirdropTimer`; remaining from target epoch; 200 ms tick + `visibilitychange` resync; cleanup | `feat(hw3): add zero-drift usePubgAirdropTimer hook` | `src/homeworks/KraftonPubgVnArena/usePubgAirdropTimer.js` |
| - [ ] H3.3 Drop phase and countdown UI | Core | hw3 | Phase derived from timer + stock (`WARMUP` -> `AIRDROP_LIVE` -> `LOOTED_OUT` / `EXPIRED`); `Intl.NumberFormat('vi-VN')` prices; phase changes in `role="status"` | `feat(hw3): render crate drops with phase countdown` | `src/homeworks/KraftonPubgVnArena/CrateDropCard.jsx` |
| - [ ] H3.4 Mock claim server | Core | hw3 | Local async, abortable claim API; answers `409 Looted Out` when stock is gone | `feat(hw3): add mock claim server with 409 conflicts` | `src/homeworks/KraftonPubgVnArena/claim-server.js` |
| - [ ] H3.5 Optimistic claim and rollback | Core | hw3 | In-flight `claimId` lock blocks duplicates; optimistic stock decrement; rollback on 409; result in `role="status"` / `role="alert"` | `feat(hw3): add optimistic claim with 409 rollback` | claim flow in `src/homeworks/KraftonPubgVnArena/` |
| - [ ] H3.6 Leaderboard filter and sort | Core | hw3 | Filter + sort by WWCD, placement, kill points derived in render with `toSorted()`; `useId` labels; live count | `feat(hw3): add pvs leaderboard filter and sort` | `src/homeworks/KraftonPubgVnArena/Leaderboard.jsx` |
| - [ ] H3.7 Virtual kill feed | Awareness | hw3 | Windowed list: only visible rows + overscan in the DOM; labelled scroll region | `feat(hw3): add virtualized kill feed` | `src/homeworks/KraftonPubgVnArena/KillFeed.jsx` |
| - [ ] H3.8 Accessible arena theme | Core | hw3 | CSS Module; contrast >= 4.5:1; `:focus-visible`; zero horizontal scroll at 375px | `style(hw3): add accessible responsive arena theme` | `src/homeworks/KraftonPubgVnArena/KraftonPubgVnArena.module.css` |
| - [ ] H3.9 Audit and AI failures | Core | hw3 | Lighthouse Accessibility 100; >= 3 verified HW 3 entries in `AI_FAILURE_AUDIT.md` | `docs(hw3): record arena audit and ai failures` | `docs/VERIFICATION.md` (HW 3 section), `docs/AI_FAILURE_AUDIT.md` |

## Bonus: 'Hẹn Hò Nhưng Không Yêu' State Machine

| Task | Level | Scope | Constraint | Commit | Deliverables |
|---|---|---|---|---|---|
| - [ ] B.1 Relationship FSM | Core | fsm | Slide `RelationshipPhase`; pure reducer with valid transitions only; no boolean flags; Bonus tab | `feat(fsm): model HenHoKhongYeu state machine` | `src/homeworks/SituationshipAnalyzer/situationship-machine.js`, `src/homeworks/SituationshipAnalyzer/SituationshipAnalyzer.jsx` (shell), `src/App.jsx` |
| - [ ] B.2 Immutable effort log | Core | bonus | Slide `EffortSignal`; append-only `[...prev, signal]` with `crypto.randomUUID()`; `useId` labelled inputs | `feat(bonus): add immutable effort signal log` | effort controls in `src/homeworks/SituationshipAnalyzer/SituationshipAnalyzer.jsx` |
| - [ ] B.3 Red-flag meter and ghosting | Core | ui | `emScore`, `rivalScore`, red flag derived in render; red flag in `<output role="status" aria-live="polite">`; 5 s reply timer with `AbortController` + `clearTimeout` cleanup | `feat(ui): add derived red-flag meter & ghosting cleanup` | meter + ghosting effect in `src/homeworks/SituationshipAnalyzer/` |
| - [ ] B.4 Accessible theme | Core | bonus | CSS Module; contrast >= 4.5:1; `:focus-visible`; zero horizontal scroll at 375px | `style(bonus): add accessible responsive analyzer theme` | `src/homeworks/SituationshipAnalyzer/SituationshipAnalyzer.module.css` |
| - [ ] B.5 Verification | Core | bonus | Timer cleanup on 'Dừng Lại' / actor switch / unmount (no late state update); Lighthouse Accessibility 100 | `docs(bonus): record analyzer verification` | `docs/VERIFICATION.md` (Bonus section; screenshots stay in git-ignored `evidence/`) |
