import type { Metadata } from "next";
import Link from "next/link";
import { birthGrantEdevletGuide } from "@/lib/birth-grant-content";

export const metadata: Metadata = {
  title: "e-Devlet doğum yardımı başvurusu",
  description:
    "Doğum yardımı için e-Devlet başvurusu öncesinde hangi bilgilere bakılması gerektiğini açıklayan kısa rehber.",
  alternates: {
    canonical: "/dogum-yardimi-uygunluk-testi/e-devlet-basvurusu",
  },
};

export default function BirthGrantEdevletPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">Doğum Yardımı</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {birthGrantEdevletGuide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            {birthGrantEdevletGuide.summary}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/dogum-yardimi-uygunluk-testi" className="primary-link">
              Doğum yardımı testine dön
            </Link>
            <Link href="/dogum-yardimi-uygunluk-testi/rehber" className="secondary-link">
              Başvuru rehberini aç
            </Link>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Kısa yol haritası</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            {birthGrantEdevletGuide.steps.map((step, index) => (
              <li key={step} className="rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-950">{index + 1}. adım:</span> {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
            {birthGrantEdevletGuide.note}
          </p>
        </section>
      </div>
    </main>
  );
}

