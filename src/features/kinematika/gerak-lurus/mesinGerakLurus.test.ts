import { describe, expect, it } from "vitest";
import {
  calculateLinearMotionState,
  DEFAULT_LINEAR_PARAMS,
  getLinearMotionMetrics,
} from "./mesinGerakLurus";

describe("model gerak lurus", () => {
  it("mempertahankan kecepatan konstan pada GLB", () => {
    const params = {
      ...DEFAULT_LINEAR_PARAMS,
      initialPosition: 2,
      initialVelocity: 4,
      acceleration: 99, // Diabaikan pada GLB.
    };

    const state = calculateLinearMotionState("glb", params, 3);
    expect(state.x).toBe(14);
    expect(state.vx).toBe(4);
    expect(state.ax).toBe(0);
  });

  it("menghitung posisi dan kecepatan pada GLBB", () => {
    const params = {
      ...DEFAULT_LINEAR_PARAMS,
      initialPosition: 1,
      initialVelocity: 2,
      acceleration: 3,
    };

    const state = calculateLinearMotionState("glbb", params, 4);
    expect(state.x).toBe(33);
    expect(state.vx).toBe(14);
    expect(state.ax).toBe(3);
  });

  it("mendukung kecepatan dan percepatan negatif", () => {
    const params = {
      ...DEFAULT_LINEAR_PARAMS,
      initialPosition: 10,
      initialVelocity: -4,
      acceleration: -2,
    };

    const state = calculateLinearMotionState("glbb", params, 2);
    expect(state.x).toBe(-2);
    expect(state.vx).toBe(-8);
  });

  it("menghasilkan besaran pada akhir pengamatan", () => {
    const params = {
      ...DEFAULT_LINEAR_PARAMS,
      initialVelocity: 5,
      acceleration: 2,
      duration: 3,
    };

    const metrics = getLinearMotionMetrics("glbb", params);
    expect(metrics.finalPosition).toBe(24);
    expect(metrics.displacement).toBe(24);
    expect(metrics.finalVelocity).toBe(11);
  });
});
