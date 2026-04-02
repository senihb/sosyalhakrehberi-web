import type { Metadata } from "next";
import { analyticsProviderRegistry, analyticsRegistry } from "@/lib/analytics-registry";

export const metadata: Metadata = {
  title: "Analytics Registry",
  description: "Ölçümleme olayları ve ücretsiz araç entegrasyon planı.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card-panel">
        <h2 className="text-2xl font-semibold text-slate-950">Olay sözlüğü</h2>
        <div className="mt-5 grid gap-3">
          {analyticsRegistry.map((event) => (
            <article key={event.id} className="rounded-2xl bg-slate-50 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-950">{event.event_name}</h3>
                  <p className="mt-1 text-sm text-slate-700">{event.surface}</p>
                </div>
                <span className="tool-status">{event.enabled ? "active" : "disabled"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-panel">
        <h2 className="text-2xl font-semibold text-slate-950">Provider readiness</h2>
        <div className="mt-5 grid gap-4">
          {analyticsProviderRegistry.map((provider) => (
            <article key={provider.id} className="rounded-2xl bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-950">{provider.label}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{provider.purpose}</p>
              <p className="mt-3 text-xs text-slate-500">{provider.env}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
