export type SimulationMode = "projectile" | "freefall" | "dynamics";

export type SimulationParams = {
  speed: number;
  angleDeg: number;
  gravity: number;
  initialHeight: number;
  mass: number;
  force: number;
  friction: number;
};

export type SimulationState = {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
};

export type SimulationMetrics = {
  duration: number;
  range: number;
  maxHeight: number;
  finalSpeed: number;
  acceleration: number;
};

export const DEFAULT_PARAMS: SimulationParams = {
  speed: 20,
  angleDeg: 45,
  gravity: 9.81,
  initialHeight: 0,
  mass: 5,
  force: 40,
  friction: 0.2,
};

export function validateParams(p: SimulationParams): void {
  const values = Object.values(p);
  if (!values.every(Number.isFinite)) {
    throw new Error("All parameters must be finite numbers.");
  }
  if (p.speed < 0 || p.angleDeg < 0 || p.angleDeg > 90) {
    throw new Error("Speed must be nonnegative and angle must be between 0° and 90°.");
  }
  if (p.gravity <= 0 || p.initialHeight < 0) {
    throw new Error("Gravity must be positive and initial height nonnegative.");
  }
  if (p.mass <= 0 || p.force < 0 || p.friction < 0 || p.friction > 1.5) {
    throw new Error("Mass must be positive, force nonnegative, and friction between 0 and 1.5.");
  }
}

export function calculateProjectile(p: SimulationParams, t: number): SimulationState {
  validateParams(p);
  if (!Number.isFinite(t) || t < 0) throw new Error("Time must be a finite nonnegative number.");

  const theta = (p.angleDeg * Math.PI) / 180;
  const vx0 = p.speed * Math.cos(theta);
  const vy0 = p.speed * Math.sin(theta);

  return {
    t,
    x: vx0 * t,
    y: p.initialHeight + vy0 * t - 0.5 * p.gravity * t * t,
    vx: vx0,
    vy: vy0 - p.gravity * t,
    ax: 0,
    ay: -p.gravity,
  };
}

export function getProjectileMetrics(p: SimulationParams): SimulationMetrics {
  validateParams(p);
  const theta = (p.angleDeg * Math.PI) / 180;
  const vx0 = p.speed * Math.cos(theta);
  const vy0 = p.speed * Math.sin(theta);
  const discriminant = vy0 * vy0 + 2 * p.gravity * p.initialHeight;
  const duration = (vy0 + Math.sqrt(discriminant)) / p.gravity;
  const maxHeight = p.initialHeight + (vy0 * vy0) / (2 * p.gravity);
  const range = vx0 * duration;
  const finalVy = vy0 - p.gravity * duration;

  return {
    duration,
    range,
    maxHeight,
    finalSpeed: Math.hypot(vx0, finalVy),
    acceleration: p.gravity,
  };
}

export function calculateFreeFall(p: SimulationParams, t: number): SimulationState {
  validateParams(p);
  if (!Number.isFinite(t) || t < 0) throw new Error("Time must be a finite nonnegative number.");

  // Positive y is upward; an object is released from rest at initialHeight.
  const duration = Math.sqrt((2 * p.initialHeight) / p.gravity);
  const y = Math.max(0, p.initialHeight - 0.5 * p.gravity * t * t);
  const landed = p.initialHeight === 0 || t > duration;

  return {
    t,
    x: 0,
    y,
    vx: 0,
    // At the exact impact time, preserve the incoming velocity.
    // After impact, the idealized object is resting on the ground.
    vy: landed ? 0 : -p.gravity * t,
    ax: 0,
    ay: landed ? 0 : -p.gravity,
  };
}

export function getFreeFallMetrics(p: SimulationParams): SimulationMetrics {
  validateParams(p);
  const duration = Math.sqrt((2 * p.initialHeight) / p.gravity);
  return {
    duration,
    range: 0,
    maxHeight: p.initialHeight,
    finalSpeed: Math.sqrt(2 * p.gravity * p.initialHeight),
    acceleration: p.gravity,
  };
}

export function calculateDynamics(p: SimulationParams, t: number): SimulationState {
  validateParams(p);
  if (!Number.isFinite(t) || t < 0) throw new Error("Time must be a finite nonnegative number.");

  // Simplified 1D block model: force acts to the right; friction opposes motion.
  // From rest, static friction holds until F > mu*m*g. Once moving,
  // kinetic friction is approximated by the same coefficient.
  const frictionLimit = p.friction * p.mass * p.gravity;
  const acceleration = p.force > frictionLimit
    ? (p.force - frictionLimit) / p.mass
    : 0;
  const x = 0.5 * acceleration * t * t;
  const vx = acceleration * t;

  return {
    t,
    x,
    y: 0,
    vx,
    vy: 0,
    ax: acceleration,
    ay: 0,
  };
}

export function getDynamicsMetrics(p: SimulationParams, duration = 5): SimulationMetrics {
  validateParams(p);
  const state = calculateDynamics(p, duration);
  return {
    duration,
    range: state.x,
    maxHeight: 0,
    finalSpeed: state.vx,
    acceleration: state.ax,
  };
}

export function getSimulationMetrics(
  mode: SimulationMode,
  p: SimulationParams,
): SimulationMetrics {
  if (mode === "freefall") return getFreeFallMetrics(p);
  if (mode === "dynamics") return getDynamicsMetrics(p);
  return getProjectileMetrics(p);
}

export function calculateState(
  mode: SimulationMode,
  p: SimulationParams,
  t: number,
): SimulationState {
  if (mode === "freefall") return calculateFreeFall(p, t);
  if (mode === "dynamics") return calculateDynamics(p, t);
  return calculateProjectile(p, t);
}
