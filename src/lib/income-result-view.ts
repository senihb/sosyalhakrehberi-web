import type {
  DecisionReason,
  IncomeEligibleBenefit,
  IncomeEvaluationResponse,
} from "@/lib/types";

function toText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function priorityOrLast(priority: number | null | undefined): number {
  return typeof priority === "number" && Number.isFinite(priority)
    ? priority
    : Number.NEGATIVE_INFINITY;
}

export type IncomeRuleTraceViewItem = {
  message: string;
  passed: boolean | null;
};

export function adaptEligibleBenefits(
  benefits: IncomeEvaluationResponse["eligible_benefits"],
): IncomeEligibleBenefit[] {
  if (!Array.isArray(benefits)) {
    return [];
  }

  return [...benefits].sort(
    (left, right) => priorityOrLast(right.priority) - priorityOrLast(left.priority),
  );
}

export function adaptPrimaryBenefit(
  benefits: IncomeEvaluationResponse["eligible_benefits"],
): IncomeEligibleBenefit | null {
  return adaptEligibleBenefits(benefits)[0] ?? null;
}

export function adaptReasonMessages(
  reasons: DecisionReason[] | null | undefined,
): string[] {
  if (!Array.isArray(reasons)) {
    return [];
  }

  return reasons
    .map((reason) => toText(reason.message))
    .filter((message): message is string => Boolean(message));
}

export function adaptRiskMessages(
  reasons: DecisionReason[] | null | undefined,
): string[] {
  if (!Array.isArray(reasons)) {
    return [];
  }

  return reasons
    .filter((reason) => String(reason.severity).toUpperCase() === "ERROR")
    .map((reason) => toText(reason.message))
    .filter((message): message is string => Boolean(message));
}

export function adaptRuleTraceMessages(
  ruleTrace: IncomeEvaluationResponse["rule_trace"],
): IncomeRuleTraceViewItem[] {
  if (!ruleTrace) {
    return [];
  }

  if (Array.isArray(ruleTrace)) {
    return ruleTrace
      .filter((item): item is string => typeof item === "string")
      .map((message) => toText(message))
      .filter((message): message is string => Boolean(message))
      .map((message) => ({ message, passed: null }));
  }

  if (typeof ruleTrace !== "object") {
    return [];
  }

  return Object.values(ruleTrace).flatMap((value) => {
    if (!value || typeof value !== "object") {
      return [];
    }

    const record = value as Record<string, unknown>;
    const message = toText(
      typeof record.message === "string" ? record.message : null,
    );

    if (!message) {
      return [];
    }

    const passed =
      typeof record.passed === "boolean"
        ? record.passed
        : typeof record.result === "boolean"
          ? record.result
          : null;

    return [{ message, passed }];
  });
}

export function adaptGuidanceSteps(
  uiHints: IncomeEvaluationResponse["ui_hints"],
  benefits: IncomeEvaluationResponse["eligible_benefits"],
): string[] {
  const stepsFromHints =
    uiHints?.next_steps
      ?.map((step) => toText(step))
      .filter((step): step is string => Boolean(step)) ?? [];

  const stepsFromBenefits = adaptEligibleBenefits(benefits)
    .map((benefit) => toText(benefit.next_step_details?.description))
    .filter((step): step is string => Boolean(step));

  return [...stepsFromHints, ...stepsFromBenefits];
}

export function getConfidenceBadgeLabel(
  confidence: IncomeEligibleBenefit["confidence"],
): string {
  const normalized = String(confidence ?? "").toLowerCase();

  if (normalized === "high") {
    return "Yüksek güven";
  }

  if (normalized === "medium") {
    return "Orta güven";
  }

  if (normalized === "low") {
    return "Düşük güven";
  }

  return "Güven seviyesi belirtilmedi";
}

export function getConfidenceTone(
  confidence: IncomeEligibleBenefit["confidence"],
): string {
  const normalized = String(confidence ?? "").toLowerCase();

  if (normalized === "high") {
    return "border-emerald-200 bg-emerald-50 text-emerald-950";
  }

  if (normalized === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-950";
  }

  if (normalized === "low") {
    return "border-rose-200 bg-rose-50 text-rose-950";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

