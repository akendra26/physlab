# PhysLAB — Final Layout Update

## Studi Kasus / Project: Civilization
- The physics parameter panel now sits in normal document flow directly below the environment canvas, with a 12px top gap and responsive wrapping.
- The panel reports system mass, the chapter-appropriate angle (force angle or incline angle), gravity, force status, and the selected strategy metric.
- The sunset accent remains `#e89973`.
- The cart wheels contain no independent rotation animation or angular-velocity animation. The cart body continues its translational movement; cargo vibration is kept separate from wheel rotation.
- CharacterPortrait instances are keyed by character and expression at their parent call sites. Portrait entrance motion is opacity-only so the characters remain statically posed.
- Chapter environment artwork, Pak Tono/Mr. Tono localization, typewriter dialogue, `useAudioSfx`, PBL flow, and RBL archive modules are preserved.

## Validation
- TypeScript/TSX transpile syntax checks passed for StudiKasusPage.tsx, CharacterPortrait.tsx, and CivilizationCart.tsx.
- CSS brace-balance check passed.
- A full `npm run build` has not been run in this environment; run `npm ci` and `npm run build` locally to verify dependency-based type checking and bundling.
