import type { Metadata } from "next";
import Link from "next/link";
import { birthGrantFaqItems } from "@/lib/birth-grant-content";

export const metadata: Metadata = {
  title: "Doğum yardımı sık sorulan sorular",
  description:
    "Doğum yardımı testi, KPS kaydı, vatandaşlık, ikamet ve ön değerlendirme sonucu hakkında sık sorulan sorular.",
  alternates: {
    canonical: "/dogum-yardimi-uygunluk-testi/sss",
  },
};

export default function BirthGrantFaqPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">Doğum Yardımı SSS</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Doğum yardımı hakkında sık sorulan sorular
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            Bu sayfa, doğum yardımı testini kullanmadan önce veya sonra en sık karıştırılan
            başlıkları kısa ve sade biçimde toplar.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/dogum-yardimi-uygunluk-testi" className="primary-link">
              Teste dön
            </Link>
            <Link
              href="/dogum-yardimi-uygunluk-testi/odeme-takvimi"
              className="secondary-link"
            >
              Ödeme takvimini gör
            </Link>
            <Link href="/dogum-yardimi-uygunluk-testi/rehber" className="secondary-link">
              Rehberi aç
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          {birthGrantFaqItems.map((item) => (
            <article key={item.question} className="card-panel">
              <h2 className="text-lg font-semibold text-slate-950">{item.question}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.answer}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

