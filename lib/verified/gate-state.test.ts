import { describe, expect, it } from "vitest";
import { gateStates } from "./gate-state";

const KEYS = ["available", "installs", "runs", "io", "content"];
const states = (g: Record<string, boolean>) => KEYS.map((k) => gateStates(g, KEYS)[k]);

describe("gate states", () => {
  it("marks the gate where the run stopped, and leaves the rest as not reached", () => {
    // STRspy: installed, then the documented command exited with an error.
    expect(states({ available: true, installs: true, runs: false, io: false, content: false }))
      .toEqual(["pass", "pass", "stopped", "not-reached", "not-reached"]);
  });

  it("a full pass has nothing to flag", () => {
    expect(states({ available: true, installs: true, runs: true, io: true, content: true }))
      .toEqual(["pass", "pass", "pass", "pass", "pass"]);
  });

  it("output that is not plausible stops at the last rung", () => {
    expect(states({ available: true, installs: true, runs: true, io: true, content: false }))
      .toEqual(["pass", "pass", "pass", "pass", "stopped"]);
  });

  it("a build that never happened stops at the first rung it failed", () => {
    expect(states({ available: true, installs: false, runs: false, io: false, content: false }))
      .toEqual(["pass", "stopped", "not-reached", "not-reached"].concat("not-reached"));
  });

  it("a missing gates object is all not-run rather than a crash", () => {
    expect(states({})).toEqual(["stopped", "not-reached", "not-reached", "not-reached", "not-reached"]);
  });
});
