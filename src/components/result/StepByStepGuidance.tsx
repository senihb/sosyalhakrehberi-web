type StepByStepGuidanceProps = {
  steps: string[];
};

export function StepByStepGuidance({ steps }: StepByStepGuidanceProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section
      id="step-by-step-guidance"
      className="rounded-3xl border border-slate-200 bg-white/80 p-6"
    >
      <h3 className="text-xl font-semibold text-slate-950">
        Adım adım ne yapmalısınız?
      </h3>
      <ol className="mt-4 grid gap-4">
        {steps.map((step, index) => (
          <li
            key={`${index + 1}-${step}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex gap-4">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-7 text-slate-800">{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

