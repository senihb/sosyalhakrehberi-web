import type { IncomeRuleTraceViewItem } from "@/lib/income-result-view";

type DecisionExplanationBlockProps = {
  reasons: string[];
  ruleTraceItems: IncomeRuleTraceViewItem[];
};

export function DecisionExplanationBlock({
  reasons,
  ruleTraceItems,
}: DecisionExplanationBlockProps) {
  if (reasons.length === 0 && ruleTraceItems.length === 0) {
    return null;
  }

  const passedItems = ruleTraceItems.filter((item) => item.passed === true);
  const otherItems = ruleTraceItems.filter((item) => item.passed !== true);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
      <h3 className="text-xl font-semibold text-slate-950">
        Bu sonucu neden aldınız?
      </h3>

      {reasons.length > 0 ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
            Sistemin açıklamaları
          </p>
          <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-800">
            {reasons.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {ruleTraceItems.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {passedItems.length > 0 ? (
            <article className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-900">
                Uygun görülen noktalar
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-emerald-950">
                {passedItems.map((item) => (
                  <li key={item.message} className="flex gap-3">
                    <span aria-hidden="true">✓</span>
                    <span>{item.message}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {otherItems.length > 0 ? (
            <article className="rounded-2xl bg-rose-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-900">
                Sonucu etkileyen noktalar
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-rose-950">
                {otherItems.map((item) => (
                  <li key={item.message} className="flex gap-3">
                    <span aria-hidden="true">
                      {item.passed === false ? "✖" : "•"}
                    </span>
                    <span>{item.message}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

