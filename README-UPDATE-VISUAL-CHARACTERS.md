# PhysLAB — Visual Character & Dialogue Update

## Implemented

- Replaced the previous simplified character avatars with original, scalable full-body SVG character illustrations.
- Pak Tono: adult local farmer design with short salt-and-pepper temples, rolled plaid field shirt, undershirt, neck towel, caping on his back, khaki workwear and boots.
- Arka: 17-year-old analytical student design with curtain haircut, titanium glasses, white/grey uniform, loose tie, navy/orange PhysLAB varsity jacket and transparent tablet.
- Nara: 17-year-old observant student design with high ponytail and ribbon, white/grey uniform, oversized cream cardigan, leather notebook and mechanical pencil.
- Added expression states (normal, thinking, success, failure) and gestural states with Motion-based transitions.
- CharacterPortrait localizes Pak Tono to Mr. Tono when the global language is English.
- PBL prologue now types text at 36 ms per character, plays `click.mp3` as each character appears, and provides an instant skip/reveal control.
- `whoosh.mp3` plays on dialogue/character transitions; `chime.mp3` plays when a strategy is selected or submitted.
- Existing global click and hover SFX delegation in `App.tsx` remains in place. Local SFX controls are marked to avoid duplicate global click playback.

## Changed files

- `src/features/studi-kasus/CharacterPortrait.tsx`
- `src/features/studi-kasus/StudiKasusPage.tsx`
- `src/features/studi-kasus/StudiKasus.css`

## Validation

- TypeScript/TSX transpile syntax check: passed for both changed TSX files.
- PostCSS parse check: passed for `StudiKasus.css`.
- Full `npm run build`: not completed in this environment because project dependencies are absent (`vite/client` and `@types/node` cannot be resolved). Run `npm ci` followed by `npm run build` locally.
