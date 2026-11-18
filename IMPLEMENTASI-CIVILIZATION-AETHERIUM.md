# PhysLAB — Civilization, Aetherium Archive & Trial Chambers

## Implemented
- Studi Kasus cinematic intro and dual portal: Project: Civilization (PBL) and The Aetherium Archive (RBL).
- Four PBL chapters: sandy road / angled pull, 35° slope / tangential pull, calibrated compound pulley / Atwood dynamics, and critically damped suspension.
- Five non-labelled strategy choices per chapter, delayed outcome reveal, retry flow, and happy / bad / secret endings.
- RBL three-panel workspace: selectable research records, SVG parameter-fitting lab (force angle, spring constant, damping), and eight interactive across/down clue fields. Solving all eight terms unlocks Master Archive and report export.
- Trial Chambers carousel with exactly eight requested topic categories.
- `useAudioSfx` custom hook and generated lightweight MP3 cues (`click`, `hover`, `whoosh`, `chime`) in `public/sfx/`.
- Indonesian / English UI strings in the new Case Studies experience and Problem Set hub/workspace controls.

## Run
```bash
npm install
npm run dev
```

## Notes
- The project already uses `motion/react` from the `motion` package. Existing dependency is retained; no redundant `framer-motion` package was added.
- Audio is an enhancement; if browser playback is blocked, the hook falls back to a synthesized short tone.
- The forensic curve fitter is a learning-oriented SVG model, not a statistical regression against an external journal dataset. The archive literature is included as in-app conceptual notes.
- The crossword uses interactive clue-entry cells grouped as Across and Down. The master archive unlocks only when all eight exact terms are entered.
- Production build could not be verified in this environment because dependency installation did not complete (registry package unavailable / timeout). TypeScript/TSX syntax transpilation checks passed for modified source files.
