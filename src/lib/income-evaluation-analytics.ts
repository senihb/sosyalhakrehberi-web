export type IncomeEvaluationAnalyticsEvent =
  | "income_test_started"
  | "income_test_completed"
  | "income_test_result_ELIGIBLE"
  | "income_test_result_NOT_ELIGIBLE"
  | "conversion_cta_clicked"
  | "consultation_requested";

type IncomeEvaluationAnalyticsDetail = {
  intent?: "detailed-analysis" | "consultation";
  has_name?: boolean;
  has_contact?: boolean;
};

export function trackIncomeEvaluationEvent(
  event: IncomeEvaluationAnalyticsEvent,
  detail?: IncomeEvaluationAnalyticsDetail,
): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("shr:income-analytics", {
        detail: { event, ...detail },
      }),
    );
  }

  console.log({ event, ...detail });
}
