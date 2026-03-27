import type { Metadata } from "next";
import Link from "next/link";
import { homeCareStartContent } from "@/lib/home-care-start-content";

export const metadata: Metadata = {
  title: "Başlangıç",
  description:
    "Evde bakım maaşı ön değerlendirmesine başlamadan önce hangi bilgilerin gerektiğini ve akışın sınırlarını açıklar.",
  alternates: {
    canonical: "/start",
  },
};

export default function StartPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">{homeCareStartContent.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {homeCareStartContent.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            {homeCareStartContent.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={homeCareStartContent.primaryHref} className="primary-link">
              {homeCareStartContent.primaryLabel}
            </Link>
            <Link href={homeCareStartContent.secondaryHref} className="secondary-link">
              {homeCareStartContent.secondaryLabel}
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">
              {homeCareStartContent.checklistHeading}
            </h2>
            <div className="mt-5 grid gap-4">
              {homeCareStartContent.checklist.map((item) => (
                <article key={item.title} className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p>
                </article>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="card-panel">
              <h2 className="text-lg font-semibold text-slate-950">
                {homeCareStartContent.durationHeading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                {homeCareStartContent.durationBody.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-7 text-amber-950">
              <p className="font-semibold">{homeCareStartContent.disclaimerHeading}</p>
              <div className="mt-2 space-y-2">
                {homeCareStartContent.disclaimerBody.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

