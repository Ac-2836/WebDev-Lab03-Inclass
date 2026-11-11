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

## Homework 3: KRAFTON x PUBG Vietnam Championship & Airdrop Arena

Lighthouse (snapshot mode on the HW 3 tab of the production build, Chrome
headless, 3 runs per form factor; run before the aria-disabled fix of AI
Failure 08, which changes no markup Lighthouse scores):

| Form factor | Run 1 | Run 2 | Run 3 | Failed audits |
|---|---|---|---|---|
| Mobile (375 px) | 100 | 100 | 100 | none |
| Desktop (1350 px) | 100 | 100 | 100 | none |

Measured checks (Playwright on Chrome; the fake clock is paused and advanced
by hand so time-based results are exact):

| Check | Result |
|---|---|
| Countdown | 20 values from 00:20 to 00:01, each exactly 1 s apart, then "Airdrop live" with a 05:00 claim window |
| Background tab | a 60 s throttled jump shows the exact remaining time; `visibilitychange` resyncs at once; interval and listener removed on leaving the tab |
| Phases | WARMUP, AIRDROP_LIVE, LOOTED_OUT (stock 0) and EXPIRED (5 minutes after the drop) derived from clock and stock; phase label changes once per transition |
| Idle render rate | 30 commits and 18 card renders in 3 s (105 and 91 before AI Failure 06) |
| Optimistic claim | stock 25 shows 24 immediately, button reads "Claiming...", focus stays on it, server answer replaces the number |
| Duplicate clicks | 6 synchronous clicks make 1 claim (stock 25 to 24, not 19) |
| 409 Looted Out | stock 25, 24 (optimistic), then 0; `role="alert"` explains the rollback; phase "Looted out" |
| Mock server | 20 parallel claims on stock 5 give 5 successes and 15 conflicts, never oversold; repeated `claimId` replays the first answer; abort leaves the stock untouched |
| Leaderboard | filter and sort by WWCD, placement, kills, total derived in render (0 `useEffect`); rank does not change when filtering; 1 commit per keystroke |
| Kill feed | 12 to 16 of 5000 rows in the DOM, scroll height 200000 px, `aria-posinset` 1 to 5000, End key reaches row 5000, no blank space after 8 scroll jumps |
| Prices | `Intl.NumberFormat('vi-VN')`: 1.500.000 ₫, 450.000 ₫, 99.000 ₫ |
| Contrast | 6.18:1 to 16.74:1 for text, 9.49:1 for the error alert (threshold 4.5:1) |
| Horizontal scroll | none at 375 px and 320 px; the standings table and the kill feed scroll inside their labelled regions |
| Inline style attributes | 1, on the kill feed scroller, which carries the four CSS custom properties that depend on the scroll position; none elsewhere |

## Bonus: 'Hẹn Hò Nhưng Không Yêu' State Machine

Lighthouse (snapshot mode on the Bonus tab of the production build, Chrome
headless, 3 runs per form factor):

| Form factor | Run 1 | Run 2 | Run 3 | Failed audits |
|---|---|---|---|---|
| Mobile (375 px) | 100 | 100 | 100 | none |
| Desktop (1350 px) | 100 | 100 | 100 | none |

Measured checks (Playwright on Chrome; the fake clock is paused and advanced
by hand so every time-based result is exact):

| Check | Result |
|---|---|
| State machine | 7 valid transitions; 17 of 17 invalid phase and event combinations leave the phase unchanged; all 4 phases reachable from FRIENDS; an unknown phase or event is ignored |
| Boolean soup | no `isDating`, `isLoved` or `hasTitle` flags; the relationship is one `RelationshipPhase` value |
| Effort log | append-only (`[...prev, signal]`, frozen signals, `crypto.randomUUID()` ids); 7 invalid inputs rejected by `createSignal`; browser validation blocks empty, 0, fractional and negative values and focuses the field |
| Derived scores | `emScore`, `rivalScore`, share and red flag computed in render (1 `useEffect` in the file, the reply timer only); 3 x 0.1 and 0.3 x 1 compare as equal |
| Red flag | none with an empty log; Em 10 against Ai đó 50 gives the red flag in `role="status" aria-live="polite"`; Em catching up or `OFFICIAL_LOVE` returns "Stable" |
| Ghosting timer | not ghosted at 4.9 s, ghosted at 5.1 s; a second message restarts the 5 s window |
| Reply | an Ai đó signal cancels the wait; an Em signal does not |
| Timer cleanup | send then no reply: timer fired; Dừng Lại at 2 s, reply at 2 s, replaced by a newer message, and leaving the tab at 1 s: every timer is cleared, none left pending; restarting after Dừng Lại is not hit by the old timer; no console errors |
| Contrast | 6.18:1 to 16.74:1 for text, 9.49:1 for the red-flag verdict and the error alert (threshold 4.5:1) |
| Horizontal scroll | none at 375 px and 320 px; controls at least 40 px high |
