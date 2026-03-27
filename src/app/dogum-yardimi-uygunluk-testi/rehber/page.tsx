import type { Metadata } from "next";
import Link from "next/link";
import {
  birthGrantGuideIntro,
  birthGrantGuideSections,
} from "@/lib/birth-grant-content";

export const metadata: Metadata = {
  title: "Doğum yardımı başvuru rehberi",
  description:
    "Doğum yardımı için temel koşulları, testte hangi bilgilerin sorulduğunu ve başvuru öncesi hazırlık mantığını açıklayan kısa rehber.",
  alternates: {
    canonical: "/dogum-yardimi-uygunluk-testi/rehber",
  },
};

export default function BirthGrantGuidePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">Doğum Yardımı Rehberi</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {birthGrantGuideIntro.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            {birthGrantGuideIntro.summary}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/dogum-yardimi-uygunluk-testi" className="primary-link">
              Doğum yardımı testini aç
            </Link>
            <Link
              href="/dogum-yardimi-uygunluk-testi/e-devlet-basvurusu"
              className="secondary-link"
            >
              e-Devlet başvurusunu gör
            </Link>
            <Link href="/dogum-yardimi-uygunluk-testi/sss" className="secondary-link">
              Sık sorulan soruları gör
            </Link>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {birthGrantGuideSections.map((section) => (
            <article key={section.title} className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

