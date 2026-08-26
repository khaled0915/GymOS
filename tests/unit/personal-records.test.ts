import { describe, it, expect } from "vitest";
import { detectPersonalRecords, type ExistingRecords } from "@/domain/personal-records";

describe("detectPersonalRecords", () => {
  const noRecords: ExistingRecords = {
    weightPr: null,
    repPr: null,
    volumePr: null,
    e1rmPr: null,
  };

  it("should detect all PR types on first set", () => {
    const prs = detectPersonalRecords({ weight: 60, repetitions: 8 }, noRecords);
    expect(prs).toHaveLength(4);
    expect(prs.map((p) => p.type)).toContain("WEIGHT_PR");
    expect(prs.map((p) => p.type)).toContain("REP_PR");
    expect(prs.map((p) => p.type)).toContain("VOLUME_PR");
    expect(prs.map((p) => p.type)).toContain("E1RM_PR");
  });

  it("should detect weight PR when heavier", () => {
    const existing: ExistingRecords = {
      weightPr: 60,
      repPr: 10,
      volumePr: 600,
      e1rmPr: 80,
    };
    const prs = detectPersonalRecords({ weight: 65, repetitions: 5 }, existing);
    expect(prs.some((p) => p.type === "WEIGHT_PR")).toBe(true);
  });

  it("should not detect PR when all are lower", () => {
    const existing: ExistingRecords = {
      weightPr: 100,
      repPr: 20,
      volumePr: 2000,
      e1rmPr: 150,
    };
    const prs = detectPersonalRecords({ weight: 40, repetitions: 5 }, existing);
    expect(prs).toHaveLength(0);
  });

  it("should return empty for non-positive values", () => {
    const prs = detectPersonalRecords({ weight: 0, repetitions: 10 }, noRecords);
    expect(prs).toHaveLength(0);
  });
});
