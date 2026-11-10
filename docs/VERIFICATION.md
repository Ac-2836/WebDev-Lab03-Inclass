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
