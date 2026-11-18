# PhysLAB — Final PBL Character & Autonomous Cart Pass

## Character sprite system
- Nara: original black-haired anime-inspired look with long silky straight hair below the waist, airy parted/see-through bangs, elegant face-framing locks, fine highlights, and a small satin side ribbon/hairpin. Cream knitted cardigan and school uniform; empty hands.
- Arka: short voluminous messy layered black hair, angular fringe, thin glasses, school uniform, and navy-orange PhysLAB varsity jacket; empty hands, no tablet or book.
- Pak Tono: classic black velvet peci, red/black rolled-sleeve flannel, neck towel, khaki trousers, and boots.
- Characters hold static upright poses. Normal / thinking / success / failure facial expressions crossfade independently; no animated arm gestures or body force poses.
- Character sprites are only in the prologue and dialogue guide panel, not on the simulation canvas.

## Autonomous cart simulation
- Removed push/pull character poses, character sprites from the scene, push/pull controls, force arrows, and any physical character-cart connection.
- The cart moves independently after the player submits a strategy. Its speed is derived from the selected strategy, chapter parameter, and result state.
- Teak grain, iron corner guards/rivets, spoked wheels, and cargo oscillation are retained.
- Wheel rotation/readout follows `ω = v/R` with `R = 0.28 m`.
- The cart's wooden draw handle is a cart component only. No character or rope is attached. Chapter 3's pulley rope remains as a separate learning object.

## Preserved systems
- Four distinct chapter environments with the sunset accent `#e89973`.
- Automatic `Pak Tono` → `Mr. Tono` naming in English.
- Typewriter dialogue, `useAudioSfx`, PBL chapter progression, RBL library, and connected crossword/TTS matrix.

## Validation
- TypeScript TSX syntax transpilation: passed for `CharacterPortrait.tsx`, `CivilizationCart.tsx`, `StudiKasusPage.tsx`, and `ChapterEnvironment.tsx`.
- PostCSS stylesheet parse: passed for `StudiKasus.css`.
- Full Vite build: not verified because project dependencies are not installed in this workspace. Run `npm ci` and `npm run build` locally before deployment.
