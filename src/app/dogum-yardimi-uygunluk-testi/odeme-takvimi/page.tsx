import type { Metadata } from "next";
import Link from "next/link";
import { birthGrantPaymentCalendarGuide } from "@/lib/birth-grant-content";

export const metadata: Metadata = {
  title: "Doğum yardımı ödeme takvimi",
  description:
    "Doğum yardımı başvurusu sonrası ödeme sürecini ve takibin nasıl yapılacağını açıklayan kısa rehber.",
  alternates: {
    canonical: "/dogum-yardimi-uygunluk-testi/odeme-takvimi",
  },
};

export default function BirthGrantPaymentCalendarPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">Doğum Yardımı</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {birthGrantPaymentCalendarGuide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">
            {birthGrantPaymentCalendarGuide.summary}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/dogum-yardimi-uygunluk-testi" className="primary-link">
              Sonuç ekranına dön
            </Link>
            <Link href="/dogum-yardimi-uygunluk-testi/sss" className="secondary-link">
              Sık sorulan soruları aç
            </Link>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Ödeme takibini nasıl yapabilirsiniz?</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            {birthGrantPaymentCalendarGuide.steps.map((step, index) => (
              <li key={step} className="rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-950">{index + 1}. adım:</span> {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
            {birthGrantPaymentCalendarGuide.note}
          </p>
        </section>
      </div>
    </main>
  );
}

