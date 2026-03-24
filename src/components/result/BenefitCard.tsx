import {
  getConfidenceBadgeLabel,
  getConfidenceTone,
} from "@/lib/income-result-view";
import type { IncomeEligibleBenefit } from "@/lib/types";

type BenefitCardProps = {
  benefit: IncomeEligibleBenefit;
  isRecommended?: boolean;
};

export function BenefitCard({
  benefit,
  isRecommended = false,
}: BenefitCardProps) {
  const priority = benefit.priority ?? null;
  const reason = benefit.reason?.trim() || null;
  const nextStepDescription = benefit.next_step_details?.description?.trim() || null;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white/80 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-semibold text-slate-950">
              {benefit.name?.trim() || "Adı belirtilmeyen hak"}
            </h4>
            {isRecommended ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                Önerilen
              </span>
            ) : null}
            {priority !== null ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                Öncelik {priority}
              </span>
            ) : null}
          </div>
          {reason ? (
            <p className="mt-3 text-sm leading-7 text-slate-700">{reason}</p>
          ) : null}
        </div>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getConfidenceTone(
            benefit.confidence,
          )}`}
        >
          {getConfidenceBadgeLabel(benefit.confidence)}
        </span>
      </div>

      {nextStepDescription ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          <p className="font-medium text-slate-950">Sonraki adım</p>
          <p className="mt-1">{nextStepDescription}</p>
        </div>
      ) : null}
    </article>
  );
}
