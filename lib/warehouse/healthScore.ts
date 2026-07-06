export type HealthInput = {
  pendingReceptions: number;
  saturatedDocks: number;
  productivity: number;
  criticalAlerts: number;
};

export function calculateHealthScore(input: HealthInput) {
  let score = 100;

  score -= input.pendingReceptions * 2;
  score -= input.saturatedDocks * 5;
  score -= input.criticalAlerts * 8;

  if (input.productivity >= 90) {
    score += 4;
  }

  score = Math.max(0, Math.min(100, score));

  let status = "Critique";

  if (score >= 90) {
    status = "Excellent";
  } else if (score >= 75) {
    status = "Stable";
  } else if (score >= 60) {
    status = "Sous surveillance";
  }

  return {
    score,
    status,
  };
}