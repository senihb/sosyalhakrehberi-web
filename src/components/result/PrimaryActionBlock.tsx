import type { IncomeEligibleBenefit } from "@/lib/types";

type PrimaryActionBlockProps = {
  benefit: IncomeEligibleBenefit | null;
};

export function PrimaryActionBlock({ benefit }: PrimaryActionBlockProps) {
  if (!benefit) {
    return null;
  }

  const nextStepDescription = benefit.next_step_details?.description?.trim() || null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">
        Öncelikli yönlendirme
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-950">
        Sizin için en doğru adım:
      </h3>
      <p className="mt-3 text-lg font-medium text-slate-950">
        {benefit.name?.trim() || "Uygun hak"}
      </p>
      {nextStepDescription ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          {nextStepDescription}
        </p>
      ) : null}
      <a href="#step-by-step-guidance" className="primary-button mt-5 inline-flex">
        Başvuruya başla
      </a>
      <p className="mt-4 text-xs leading-6 text-slate-500">
        Bu bir resmî karar değildir.
      </p>
    </section>
  );
}
