export type IncomeEvaluationAnalyticsEvent =
  | "income_test_started"
  | "income_test_completed"
  | "income_test_result_ELIGIBLE"
  | "income_test_result_NOT_ELIGIBLE";

export function trackIncomeEvaluationEvent(
  event: IncomeEvaluationAnalyticsEvent,
): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("shr:income-analytics", {
        detail: { event },
      }),
    );
  }

  console.log(event);
}
