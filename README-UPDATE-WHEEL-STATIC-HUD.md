# PhysLAB — Static Wheel & Physics HUD Update

## Implemented
- Removed the cart wheel's independent Motion rotation and all wheel angular-speed / period calculations.
- Kept the cart body's track translation and the existing cargo response during the simulation stage.
- Reworked the in-canvas glassmorphism HUD to show mass, incline / pull angle (θ), gravitational acceleration (g), force status, and the chapter's supporting parameter description.
- Set the CharacterPortrait motion root key to `${character}-${expression}` and retained per-instance SVG gradient IDs to avoid duplicate SVG resource references.
- Left chapter environments, language switching, typewriter dialogue, global `useAudioSfx`, PBL narrative, and RBL library / matrix module intact.

## Validation
- TSX syntax transpilation: passed for `StudiKasusPage.tsx`, `CharacterPortrait.tsx`, and `CivilizationCart.tsx`.
- CSS brace-balance check: passed.
- Static source audit: no `animate-spin`, `rotate: 360`, `wheelOmega`, `angularSpeed`, `wheelPeriod`, or `spinTransition` remains in the Studi Kasus module.
- Full `npm run build` was not verified because dependency installation (`npm ci`) timed out in this environment.

## Run locally
```bash
npm ci
npm run build
npm run dev
```
