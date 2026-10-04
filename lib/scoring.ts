import type { Severity } from "./types";

export const DEFAULT_PENALTIES: Record<Severity, number> = {
  Cosmetic: 1,
  Minor: 3,
  Moderate: 6,
  Major: 10,
  Critical: 20,
};

export function calculateScore(findings: { severity: Severity }[], penalties = DEFAULT_PENALTIES) {
  const counts = findings.reduce<Record<Severity, number>>((acc, finding) => {
    acc[finding.severity] = (acc[finding.severity] ?? 0) + 1;
    return acc;
  }, {} as Record<Severity, number>);

  const penalty = findings.reduce((sum, finding) => sum + (penalties[finding.severity] ?? 0), 0);
  return {
    overall: Math.max(0, Math.min(100, 100 - penalty)),
    counts: {
      Cosmetic: counts.Cosmetic ?? 0,
      Minor: counts.Minor ?? 0,
      Moderate: counts.Moderate ?? 0,
      Major: counts.Major ?? 0,
      Critical: counts.Critical ?? 0,
    },
  };
}

export function recommendationForScore(score: number, criticalCount: number, majorCount: number) {
  if (criticalCount > 0) return "Not recommended";
  if (majorCount > 0 || score < 70) return "Suitable with repairs";
  if (score < 85) return "Further evaluation required";
  return "Suitable";
}
