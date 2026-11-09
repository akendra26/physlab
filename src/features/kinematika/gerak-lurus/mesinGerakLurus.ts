/**
 * Model kinematika satu dimensi untuk GLB dan GLBB.
 * Arah positif ditentukan oleh tanda kecepatan dan percepatan.
 */
export type LinearMotionMode = "glb" | "glbb";

export type LinearMotionParams = {
  initialPosition: number;
  initialVelocity: number;
  acceleration: number;
  duration: number;
};

export type LinearMotionState = {
  t: number;
  x: number;
  vx: number;
  ax: number;
};

export type LinearMotionMetrics = {
  duration: number;
  displacement: number;
  finalPosition: number;
  finalVelocity: number;
  acceleration: number;
};

export const DEFAULT_LINEAR_PARAMS: LinearMotionParams = {
  initialPosition: 0,
  initialVelocity: 5,
  acceleration: 1.5,
  duration: 10,
};

function validateLinearParams(params: LinearMotionParams, time: number): void {
  const values = [...Object.values(params), time];
  if (!values.every(Number.isFinite)) {
    throw new Error("Semua parameter gerak dan waktu harus berupa bilangan yang valid.");
  }
  if (params.duration <= 0) {
    throw new Error("Durasi pengamatan harus lebih besar dari nol.");
  }
  if (time < 0) {
    throw new Error("Waktu harus berupa bilangan tidak negatif.");
  }
}

/** Menghitung keadaan benda pada waktu t. */
export function calculateLinearMotionState(
  mode: LinearMotionMode,
  params: LinearMotionParams,
  time: number,
): LinearMotionState {
  validateLinearParams(params, time);

  const acceleration = mode === "glbb" ? params.acceleration : 0;
  const position =
    params.initialPosition +
    params.initialVelocity * time +
    0.5 * acceleration * time * time;
  const velocity = params.initialVelocity + acceleration * time;

  return {
    t: time,
    x: position,
    vx: velocity,
    ax: acceleration,
  };
}

/** Menghitung besaran pada akhir interval pengamatan. */
export function getLinearMotionMetrics(
  mode: LinearMotionMode,
  params: LinearMotionParams,
): LinearMotionMetrics {
  const finalState = calculateLinearMotionState(mode, params, params.duration);

  return {
    duration: params.duration,
    displacement: finalState.x - params.initialPosition,
    finalPosition: finalState.x,
    finalVelocity: finalState.vx,
    acceleration: finalState.ax,
  };
}
