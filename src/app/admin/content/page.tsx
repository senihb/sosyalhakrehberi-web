import type { Metadata } from "next";
import { contentRegistry, sourceRegistry } from "@/lib/content-registry";

export const metadata: Metadata = {
  title: "Content Registry",
  description: "Sayfa ve kaynak kayıtlarının dosya tabanlı görünümü.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminContentPage() {
  return (
    <div className="grid gap-6">
      <section className="card-panel">
        <h2 className="text-2xl font-semibold text-slate-950">Sayfa kayıtları</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {contentRegistry.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {entry.status}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{entry.title}</h3>
                </div>
                <span className="tool-status">{entry.section}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{entry.body}</p>
              <p className="mt-4 text-xs text-slate-500">{entry.canonical_path}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card-panel">
        <h2 className="text-2xl font-semibold text-slate-950">Kaynak kayıtları</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {sourceRegistry.map((source) => (
            <article key={source.id} className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {source.kind} • {source.trust_level}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{source.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {source.url ?? source.file_path ?? "Kayıt yolu belirtilmedi."}
              </p>
              <p className="mt-4 text-xs text-slate-500">{source.topic_tags.join(" • ")}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
