import { describe, expect, it } from "vitest";
import {
  calculateDynamics,
  calculateFreeFall,
  calculateProjectile,
  getDynamicsMetrics,
  getFreeFallMetrics,
  getProjectileMetrics,
} from "./projectile";

const projectile = {
  speed: 20,
  angleDeg: 45,
  gravity: 9.81,
  initialHeight: 0,
  mass: 5,
  force: 40,
  friction: 0.2,
};

describe("Projectile model", () => {
  it("starts at the launch point", () => {
    const state = calculateProjectile(projectile, 0);
    expect(state.x).toBeCloseTo(0);
    expect(state.y).toBeCloseTo(0);
  });

  it("matches known flight time, range, and maximum height", () => {
    const metrics = getProjectileMetrics(projectile);
    expect(metrics.duration).toBeCloseTo(2.88, 2);
    expect(metrics.range).toBeCloseTo(40.77, 1);
    expect(metrics.maxHeight).toBeCloseTo(10.19, 1);
  });

  it("returns to ground at the predicted flight time", () => {
    const metrics = getProjectileMetrics(projectile);
    expect(calculateProjectile(projectile, metrics.duration).y).toBeCloseTo(0);
  });

  it("has zero vertical velocity at the peak", () => {
    const metrics = getProjectileMetrics(projectile);
    expect(calculateProjectile(projectile, metrics.duration / 2).vy).toBeCloseTo(0);
  });

  it("supports a horizontal launch from an elevated position", () => {
    const params = { ...projectile, speed: 10, angleDeg: 0, initialHeight: 5 };
    const metrics = getProjectileMetrics(params);
    expect(metrics.duration).toBeCloseTo(Math.sqrt(10 / 9.81), 5);
    expect(metrics.range).toBeGreaterThan(0);
  });
});

describe("Free-fall model", () => {
  it("calculates fall time from height", () => {
    const params = { ...projectile, initialHeight: 10 };
    expect(getFreeFallMetrics(params).duration).toBeCloseTo(Math.sqrt(20 / 9.81), 5);
  });

  it("keeps the impact velocity at impact and rests afterward", () => {
    const params = { ...projectile, initialHeight: 10 };
    const impactTime = getFreeFallMetrics(params).duration;
    const impact = calculateFreeFall(params, impactTime);
    const afterImpact = calculateFreeFall(params, impactTime + 0.1);
    expect(impact.y).toBeCloseTo(0);
    expect(impact.vy).toBeCloseTo(-Math.sqrt(2 * 9.81 * 10), 4);
    expect(afterImpact.y).toBe(0);
    expect(afterImpact.vy).toBe(0);
  });
});

describe("Dynamics model", () => {
  it("accelerates when applied force exceeds friction", () => {
    const state = calculateDynamics(projectile, 2);
    expect(state.ax).toBeCloseTo((40 - 0.2 * 5 * 9.81) / 5);
    expect(state.vx).toBeGreaterThan(0);
  });

  it("remains at rest when static friction can hold the block", () => {
    const params = { ...projectile, force: 2, friction: 0.5 };
    const state = calculateDynamics(params, 3);
    expect(state.x).toBe(0);
    expect(state.vx).toBe(0);
  });

  it("reports displacement after five seconds", () => {
    expect(getDynamicsMetrics(projectile).range).toBeGreaterThan(0);
  });
});
