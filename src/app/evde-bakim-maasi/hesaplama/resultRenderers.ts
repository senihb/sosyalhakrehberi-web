import type { DecisionReason, MissingFact, RuleResult } from "@/lib/types";

const SEVERITY_WEIGHT: Record<string, number> = {
  ERROR: 0,
  WARNING: 1,
  INFO: 2,
};

export function normalizeReasons(
  reasons: DecisionReason[] | null | undefined,
  options?: { sortBySeverity?: boolean },
): DecisionReason[] {
  if (!Array.isArray(reasons)) {
    return [];
  }

  if (!options?.sortBySeverity) {
    return reasons;
  }

  return [...reasons].sort((left, right) => {
    const leftWeight = SEVERITY_WEIGHT[left.severity] ?? 999;
    const rightWeight = SEVERITY_WEIGHT[right.severity] ?? 999;

    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }

    if (left.code !== right.code) {
      return left.code.localeCompare(right.code);
    }

    return left.message.localeCompare(right.message);
  });
}

export function getWhyFallbackCopy(locale: "tr" | "en" = "tr"): string {
  if (locale === "en") {
    return "No explanation details were returned for this evaluation.";
  }

  return "Bu değerlendirme için ayrıntılı gerekçe döndürülmedi.";
}

export function normalizeMissingFacts(
  missingFacts: MissingFact[] | null | undefined,
): MissingFact[] {
  if (!Array.isArray(missingFacts) || missingFacts.length === 0) {
    return [];
  }

  const hasPriority = missingFacts.some((fact) => typeof fact.priority === "number");
  if (!hasPriority) {
    return missingFacts;
  }

  return [...missingFacts].sort((left, right) => {
    const leftPriority =
      typeof left.priority === "number" ? left.priority : Number.POSITIVE_INFINITY;
    const rightPriority =
      typeof right.priority === "number" ? right.priority : Number.POSITIVE_INFINITY;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    if (left.fact_group && right.fact_group && left.fact_group !== right.fact_group) {
      return left.fact_group.localeCompare(right.fact_group);
    }

    if (left.key !== right.key) {
      return left.key.localeCompare(right.key);
    }

    return left.message.localeCompare(right.message);
  });
}

export type MissingFactsGroup = {
  groupLabel: string;
  items: MissingFact[];
};

export function groupMissingFactsByFactGroup(
  missingFacts: MissingFact[],
): MissingFactsGroup[] {
  if (missingFacts.length === 0) {
    return [];
  }

  const groups = new Map<string, MissingFact[]>();
  for (const fact of missingFacts) {
    const label =
      typeof fact.fact_group === "string" && fact.fact_group.trim()
        ? fact.fact_group
        : "Diğer";
    const items = groups.get(label) ?? [];
    items.push(fact);
    groups.set(label, items);
  }

  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([groupLabel, items]) => ({ groupLabel, items }));
}

export function isValidHttpUrl(url: unknown): url is string {
  if (typeof url !== "string") {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeRuleResults(
  ruleResults: Record<string, RuleResult> | RuleResult[] | null | undefined,
): RuleResult[] {
  if (!ruleResults) {
    return [];
  }

  if (Array.isArray(ruleResults)) {
    return ruleResults;
  }

  if (typeof ruleResults === "object") {
    return Object.values(ruleResults);
  }

  return [];
}

export function formatEvaluationDateTR(
  evaluationDate: string | null | undefined,
): string | null {
  if (!evaluationDate) {
    return null;
  }

  const parsed = new Date(evaluationDate);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
