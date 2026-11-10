# VERIFICATION.md

Measured results per homework. Screenshots stay in the local, git-ignored
`evidence/` folder.

## Homework 1: Production Studio Drum Kit

Tool: Lighthouse (snapshot mode on the HW 1 tab of the production build
served by `vite preview`), Chrome headless, 3 runs per form factor.

| Form factor | Run 1 | Run 2 | Run 3 | Failed audits |
|---|---|---|---|---|
| Mobile (375 px) | 100 | 100 | 100 | none |
| Desktop (1350 px) | 100 | 100 | 100 | none |

Values are the Lighthouse Accessibility score. Snapshot mode scores the
accessibility category only; Best Practices needs a page navigation and the
HW 1 tab is reached by a click, so it is not part of this audit.

Other measured checks (Playwright on Chrome):

| Check | Result |
|---|---|
| Contrast of text (heading, keycap, meter label, hit log) | 6.18:1 to 16.74:1 (threshold 4.5:1) |
| Focus ring | 3 px solid, offset 3 px, color 16.74:1 against the panel |
| Pad target size | 143 x 81 px (WCAG 2.5.8 minimum 24 px) |
| Horizontal scroll | none at 375 px and 320 px |
| Pad accessible names | "W Crash", "A Kick", "S Snare", "D Hi-hat", "J Tom", "K Clap", "L Ride" |
| Output peak, any pad combination | below 1.0 (0.904 for kick + snare + tom + crash) |

## Homework 2: 88-Key Polyphonic Piano & FIFO Sequencer

Lighthouse (snapshot mode on the HW 2 tab of the production build,
Chrome headless, 3 runs per form factor):

| Form factor | Run 1 | Run 2 | Run 3 | Failed audits |
|---|---|---|---|---|
| Mobile (375 px) | 100 | 100 | 100 | none |
| Desktop (1350 px) | 100 | 100 | 100 | none |

Render isolation and audio audit (Playwright on Chrome; React commit hook
counts the `PianoKey` fibers that actually rendered, the same rule the React
DevTools Profiler uses):

| Check | Result |
|---|---|
| Initial mount | 88 `PianoKey` renders in one commit |
| One key press or release | exactly 1 `PianoKey` render per commit |
| Chord of 8 keys pressed one after another | 8 commits, 1 key each |
| Stress: 300 random presses over about 3 s | 608 commits, at most 1 key rendered in any commit, 0 commits with more than 1 |
| Voice cap | 12 keys held: 8 oscillators sounding, 12 keys shown pressed; the Map never holds more than 8 voices |
| Orphan nodes | stress run: 280 oscillators created, 280 ended, 0 alive after settling; 12-key chord released: 0 alive |
| Peak overlapping oscillators during the stress run | 12 (8 held + notes still in their 40 ms release tail) |
| Stop Sequence mid replay | 0 oscillators alive 250 ms later, no note starts afterwards, 0 unhandled rejections |
| Leaving the tab (also mid replay) | `AudioContext` state `closed`; no new oscillators |
| Replay timing (start times) | within 12 ms of schedule at 0.5x, 1x and 2x |
| Click-free envelope | largest sample step during attack and release 0.0063, equal to steady state |
| Output peak with 8 voices | 0.752 (limit 0.8 by construction) |
| Horizontal scroll | none at 375 px and 320 px; the key strip scrolls inside its labelled region |
