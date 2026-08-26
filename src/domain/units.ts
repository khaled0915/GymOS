/**
 * Unit conversion utilities.
 * Internal storage is always in metric (kg, cm).
 * Conversion happens at the presentation boundary.
 */

const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 1 / KG_TO_LBS;
const CM_TO_INCHES = 0.393701;
const INCHES_TO_CM = 1 / CM_TO_INCHES;

/** Convert kilograms to pounds. */
export function kgToLbs(kg: number): number {
  return Math.round(kg * KG_TO_LBS * 100) / 100;
}

/** Convert pounds to kilograms. */
export function lbsToKg(lbs: number): number {
  return Math.round(lbs * LBS_TO_KG * 100) / 100;
}

/** Convert centimeters to inches. */
export function cmToInches(cm: number): number {
  return Math.round(cm * CM_TO_INCHES * 100) / 100;
}

/** Convert inches to centimeters. */
export function inchesToCm(inches: number): number {
  return Math.round(inches * INCHES_TO_CM * 100) / 100;
}

/**
 * Round weight to nearest practical increment.
 * Metric: nearest 0.5 kg
 * Imperial: nearest 1 lb
 */
export function roundWeight(value: number, unit: "METRIC" | "IMPERIAL"): number {
  if (unit === "METRIC") {
    return Math.round(value * 2) / 2; // nearest 0.5
  }
  return Math.round(value); // nearest 1
}

/**
 * Display a weight value with appropriate unit label.
 */
export function formatWeight(kg: number, unit: "METRIC" | "IMPERIAL"): string {
  if (unit === "IMPERIAL") {
    return `${roundWeight(kgToLbs(kg), "IMPERIAL")} lbs`;
  }
  return `${roundWeight(kg, "METRIC")} kg`;
}
