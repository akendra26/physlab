# PhysLAB — Cosmic Warp & Simulation Hub Update

## Included

- Cosmic Warp intro splash: starfield, center-ward warp motion, peach horizon glow, localized PhysLAB wordmark/tagline, and reduced-motion handling.
- Interactive Simulation Hub: stage-select cards for Kinematics and Dynamics, animated mission modal, experiment description/goal, time-mode indicators, and localized start action.
- Dynamics observation-duration controls: synchronized range + numeric inputs (1–60 s), timed/unlimited modes, automatic stop at the selected limit, and final-state sampling in the dynamics sandboxes.
- ID/EN context for the updated app shell, hub, intro, navigation, and Dynamics simulator surfaces.
- Existing `motion/react` dependency is reused; no extra animation package is required.

## Run locally

```bash
npm install
npm run dev
```

## Validation notes

- `node node_modules/typescript/bin/tsc -b` passed in the authoring environment.
- ESLint passed for the updated app shell, hub, splash, and Dynamics modules.
- A full Vite production build could not be completed in the authoring environment because the installed dependency tree is missing the platform-specific Rolldown native binding (`@rolldown/binding-linux-x64-gnu`). Reinstall dependencies with `npm install` in the target environment, then run `npm run build`.
- Some older pages outside this update (notably Trivia/archive and the historical map) still contain pre-existing language/lint work and are not represented as fully localized by this update.
