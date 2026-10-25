# PhysLab

PhysLab is an interactive 2D physics learning website built with React, TypeScript, Vite, and Canvas.

## Features

- Projectile motion with adjustable speed, launch angle, launch height, and gravity.
- Free fall from a selectable height.
- A simplified Newton's second-law block model with applied force, mass, and friction.
- Play/pause/replay, timeline scrubbing, and simulation speed control.
- Analytical metrics and position/velocity/acceleration graphs.
- Export sampled model data to CSV.
- Unit tests for physics calculations.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Tests and production build

```bash
npm test
npm run lint
npm run build
npm run preview
```

## Project structure

```text
src/
  components/
    MiniGraph.tsx
    ProjectileCanvas.tsx
  physics/
    projectile.ts
    projectile.test.ts
  App.tsx
  App.css
  index.css
  main.tsx
```

## Model assumptions

### Projectile motion

The model assumes constant gravity and no air resistance. The projectile launches with speed `speed` at `angleDeg` above the horizontal from `initialHeight`. It stops at the first return to ground level.

### Free fall

An object is released from rest at `initialHeight` and falls vertically under constant gravity.

### Dynamics

A simplified horizontal block starts from rest. A constant force acts to the right. The friction coefficient is used as both the static threshold and kinetic coefficient. The block remains at rest when the applied force is no greater than `mu * mass * gravity`; otherwise, it accelerates with `(force - mu * mass * gravity) / mass`. This is an educational approximation, not a full rigid-body/contact solver.

## Notes

The simulation runs in the browser; no backend or database is required. The graph components are intentionally dependency-light SVG so the app can run without a charting library.
