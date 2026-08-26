import { estimateOneRepMax } from "./estimated-1rm";
import { calculateSetVolume } from "./volume";

export interface SetData {
  weight: number;
  repetitions: number;
}

export interface ExistingRecords {
  weightPr: number | null;
  repPr: number | null;
  volumePr: number | null;
  e1rmPr: number | null;
}

export interface DetectedPr {
  type: "WEIGHT_PR" | "REP_PR" | "VOLUME_PR" | "E1RM_PR";
  value: number;
}

/**
 * Detect new personal records for a given set against existing records.
 * Returns an array of detected PRs (can be multiple for a single set).
 */
export function detectPersonalRecords(
  set: SetData,
  existing: ExistingRecords,
): DetectedPr[] {
  const prs: DetectedPr[] = [];

  if (set.weight <= 0 || set.repetitions <= 0) {
    return prs;
  }

  // Weight PR: heaviest weight used (regardless of rep count)
  if (existing.weightPr === null || set.weight > existing.weightPr) {
    prs.push({ type: "WEIGHT_PR", value: set.weight });
  }

  // Rep PR: most reps at any weight (simplified)
  if (existing.repPr === null || set.repetitions > existing.repPr) {
    prs.push({ type: "REP_PR", value: set.repetitions });
  }

  // Volume PR: highest single-set volume
  const volume = calculateSetVolume(set.weight, set.repetitions);
  if (existing.volumePr === null || volume > existing.volumePr) {
    prs.push({ type: "VOLUME_PR", value: volume });
  }

  // E1RM PR: highest estimated 1RM
  const e1rm = estimateOneRepMax(set.weight, set.repetitions);
  if (existing.e1rmPr === null || e1rm > existing.e1rmPr) {
    prs.push({ type: "E1RM_PR", value: e1rm });
  }

  return prs;
}
