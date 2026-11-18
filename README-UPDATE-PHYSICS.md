# PhysLAB — Physics & Performance Update

## Menu and routing
- Kinematics is now exactly four independent stages: GLB, GLBB, Projectile Motion, and Free Fall.
- Dynamics is now exactly eight independent stages: Single Block, Contact Forces, Stacked Blocks, Inclined Plane, Springs & Oscillations, Advanced Applications, Free-Body Force Lab, and Collision & Momentum.
- Selecting a Dynamics stage opens the selected experiment directly; the old repeated tab strip inside the Dynamics page has been removed.

## Dynamics physics
- Contact blocks are rendered flush: the center-to-center offset equals the two half-widths.
- Stacked-block motion detects when the upper block's relative displacement passes the support edge. It then continues horizontally at its release velocity and falls under gravity to the floor.
- Inclined-plane angle is configurable from 0° to 180°. The normal-force magnitude remains non-negative and the rendered block follows the plane orientation.
- Spring experiments include horizontal, vertical-hanging, and inclined orientations. The spring is drawn as a smooth sinusoidal coil whose endpoints meet the support and mass.
- Added a one-dimensional collision model with configurable masses, initial velocity, and coefficient of restitution. The model uses the standard post-collision velocities and conserves linear momentum.

## Motion and presentation
- The intro now includes a radial portal ring and warp rays, with reduced-motion support.
- The simulation hub has a radial portal arrival effect and responsive stage grids.
- Native select controls use the PhysLAB zinc/peach dark palette.
- Dynamics time integration uses requestAnimationFrame with a fixed 1/60 s step. Physics state and graph samples are memoized; the SVG scene is memoized and isolated for paint/layout. Time-state updates are scheduled as transitions so controls remain responsive.

## Validation
- All TypeScript/TSX source files passed TypeScript transpilation syntax checks.
- The pure Dynamics engine compiled under strict TypeScript settings.
- Targeted engine checks passed for stacked-block falling, 135° incline orientation, and linear-momentum conservation in collision.
- Full `npm run build` and the Vitest suite were not run because dependencies were not installed in the provided environment. Run `npm install`, then `npm run build` and `npm test` locally.
