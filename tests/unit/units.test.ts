import { describe, it, expect } from "vitest";
import { kgToLbs, lbsToKg, cmToInches, inchesToCm, roundWeight, formatWeight } from "@/domain/units";

describe("kgToLbs", () => {
  it("should convert 100 kg to ~220.46 lbs", () => {
    expect(kgToLbs(100)).toBeCloseTo(220.46, 1);
  });
});

describe("lbsToKg", () => {
  it("should convert 220 lbs to ~99.79 kg", () => {
    expect(lbsToKg(220)).toBeCloseTo(99.79, 1);
  });

  it("should be inverse of kgToLbs", () => {
    expect(lbsToKg(kgToLbs(60))).toBeCloseTo(60, 0);
  });
});

describe("cmToInches", () => {
  it("should convert 180 cm to ~70.87 in", () => {
    expect(cmToInches(180)).toBeCloseTo(70.87, 1);
  });
});

describe("inchesToCm", () => {
  it("should convert 72 in to ~182.88 cm", () => {
    expect(inchesToCm(72)).toBeCloseTo(182.88, 1);
  });
});

describe("roundWeight", () => {
  it("should round metric to nearest 0.5", () => {
    expect(roundWeight(62.3, "METRIC")).toBe(62.5);
    expect(roundWeight(62.1, "METRIC")).toBe(62);
  });

  it("should round imperial to nearest 1", () => {
    expect(roundWeight(135.4, "IMPERIAL")).toBe(135);
    expect(roundWeight(135.6, "IMPERIAL")).toBe(136);
  });
});

describe("formatWeight", () => {
  it("should format metric weight", () => {
    expect(formatWeight(60, "METRIC")).toBe("60 kg");
  });

  it("should format imperial weight (converted from kg)", () => {
    const result = formatWeight(60, "IMPERIAL");
    expect(result).toContain("lbs");
  });
});
