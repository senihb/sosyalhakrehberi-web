import Link from "next/link";
import { createToolAnalyticsSession } from "@/lib/tool-analytics";
import type { ToolAnalyticsTool } from "@/lib/analytics";
import type { ToolGuidanceModel } from "@/lib/tool-guidance";

type ToolGuidanceSurfaceProps = {
  model: ToolGuidanceModel;
  tool: ToolAnalyticsTool;
  showNextStep?: boolean;
};

export function ToolGuidanceSurface({
  model,
  tool,
  showNextStep = true,
}: ToolGuidanceSurfaceProps) {
  const analytics = createToolAnalyticsSession(tool);

  return (
    <section className="mt-5 rounded-2xl bg-white/70 p-5">
      <div
        className={`grid gap-4 ${
          showNextStep
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        }`}
      >
        {showNextStep ? (
          <article className="rounded-2xl bg-white/70 p-4">
            <h3 className="text-base font-semibold text-slate-950">{model.nextStepTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">{model.nextStepBody}</p>
          </article>
        ) : null}

        <article className="rounded-2xl bg-white/70 p-4">
          <h3 className="text-base font-semibold text-slate-950">İlgili rehberler</h3>
          <div className="mt-3 space-y-3">
            {model.relatedGuides.map((guide) => (
              <article key={`${guide.href}-${guide.label}`} className="rounded-2xl bg-white/80 p-3">
                <Link
                  href={guide.href}
                  className="secondary-link inline-flex"
                  onClick={() => analytics.trackLinkClick("guidance", "guide", guide.href)}
                >
                  {guide.label}
                </Link>
                <p className="mt-2 text-sm leading-6 text-slate-700">{guide.body}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white/70 p-4">
          <h3 className="text-base font-semibold text-slate-950">Diğer testler</h3>
          <div className="mt-3 space-y-3">
            {model.otherTests.map((otherTool) => (
              <article key={`${otherTool.href}-${otherTool.label}`} className="rounded-2xl bg-white/80 p-3">
                <Link
                  href={otherTool.href}
                  className="secondary-link inline-flex"
                  onClick={() => analytics.trackLinkClick("guidance", "tool", otherTool.href)}
                >
                  {otherTool.label}
                </Link>
                <p className="mt-2 text-sm leading-6 text-slate-700">{otherTool.body}</p>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

