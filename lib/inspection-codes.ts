export type ConditionOption = { value: string; label: string };

const BODY_DAMAGE_OPTIONS: ConditionOption[] = [
  { value: "0", label: "0 · No damage" },
  { value: "P1", label: "P1 · Paint / surface · Level 1" },
  { value: "P2", label: "P2 · Paint / surface · Level 2" },
  { value: "P3", label: "P3 · Paint / surface · Level 3" },
  { value: "B1", label: "B1 · Shape changed · Level 1" },
  { value: "B2", label: "B2 · Shape changed · Level 2" },
  { value: "B3", label: "B3 · Shape changed · Level 3" },
  { value: "X1", label: "X1 · Cut / crack / hole / missing · Level 1" },
  { value: "X2", label: "X2 · Cut / crack / hole / missing · Level 2" },
  { value: "X3", label: "X3 · Cut / crack / hole / missing · Level 3" },
  { value: "NT", label: "NT · Not inspected" },
  { value: "NA", label: "NA · Not applicable" },
  { value: "RC", label: "RC · Reclassify legacy entry" }
];

const FUNCTION_OPTIONS: ConditionOption[] = [
  { value: "0", label: "0 · No defect recorded" },
  { value: "S", label: "S · Small defect" },
  { value: "L", label: "L · Large defect" },
  { value: "NT", label: "NT · Not inspected" },
  { value: "NA", label: "NA · Not applicable" },
  { value: "RC", label: "RC · Reclassify legacy entry" }
];

const validBodyCodes = new Set(BODY_DAMAGE_OPTIONS.map((option) => option.value));
const validFunctionCodes = new Set(FUNCTION_OPTIONS.map((option) => option.value));

export function conditionOptionsFor(section: string, currentStatus?: string): ConditionOption[] {
  const base = section === "Exterior" || section === "Interior" ? BODY_DAMAGE_OPTIONS : FUNCTION_OPTIONS;
  if (currentStatus && !base.some((option) => option.value === currentStatus) && !base.some((option) => option.value === "RC")) {
    return [...base, { value: "RC", label: "RC · Reclassify legacy entry" }];
  }
  return base;
}

export function normalizeConditionCode(section: string, rawStatus: unknown): string {
  const status = String(rawStatus ?? "").trim();
  const value = status.toUpperCase();
  const body = section === "Exterior" || section === "Interior";
  const validCodes = body ? validBodyCodes : validFunctionCodes;
  if (validCodes.has(value)) return value;
  const legacy = status.toLowerCase();
  if (["good", "no damage", "no defect", "passed"].includes(legacy)) return "0";
  if (["n/a", "na", "not applicable"].includes(legacy)) return "NA";
  if (["not tested", "not inspected", "not conducted", "not performed"].includes(legacy)) return "NT";
  // Old descriptive grades do not identify the exact P/B/X or S/L code.
  // Preserve the need for review instead of silently inventing a damage code.
  return "RC";
}

export function isIssueCode(status: string): boolean {
  return !["", "0", "NT", "NA"].includes(status);
}

export function severityForCode(status: string): "Cosmetic" | "Minor" | "Moderate" | "Major" | "Critical" {
  if (status === "X3" || status === "L") return "Critical";
  if (status.endsWith("3") || status === "X2") return "Major";
  if (status === "S" || status === "RC" || status.endsWith("2") || status === "X1") return "Moderate";
  if (status.endsWith("1")) return "Minor";
  return "Minor";
}

export const ROAD_TEST_OPTIONS: ConditionOption[] = [
  { value: "0", label: "0 · No fault recorded" },
  { value: "S", label: "S · Small observation" },
  { value: "L", label: "L · Large / safety-critical fault" },
  { value: "NT", label: "NT · Not conducted" }
];

export function normalizeRoadTestCode(rawResult: unknown): string {
  const result = String(rawResult ?? "").trim();
  if (ROAD_TEST_OPTIONS.some((option) => option.value === result)) return result;
  switch (result.toLowerCase()) {
    case "passed": return "0";
    case "passed with notes": return "S";
    case "failed": return "L";
    case "not conducted": return "NT";
    default: return "NT";
  }
}
