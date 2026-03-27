import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GSS gelir testi rehberi",
  description:
    "GSS gelir testi sayfasında hangi bilgilerin neden sorulduğunu ve sonucun nasıl okunması gerektiğini açıklayan kısa rehber.",
  alternates: {
    canonical: "/gss-gelir-testi/rehber",
  },
};

export default function GssGuidePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card-panel">
          <p className="eyebrow">GSS Rehberi</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            GSS gelir testi sonucu nasıl okunur?
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-700">
            GSS gelir testi aracı resmî karar vermez. Sosyal güvence, aktif sigorta ve gelir
            bilginizi değerlendirme sistemine iletir; size ön değerlendirme ve bir sonraki adım için
            kısa yönlendirme sunar.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/gss-gelir-testi" className="primary-link">
              GSS testini aç
            </Link>
            <Link href="/" className="secondary-link">
              Diğer testleri gör
            </Link>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Bu testte neler sorulur?</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            <li>Brüt toplam hane geliri</li>
            <li>Hanedeki kişi sayısı</li>
            <li>Sosyal güvence durumu</li>
            <li>Aktif sigorta bilgisi</li>
            <li>Bir yakın üzerinden kapsam durumu</li>
          </ul>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Sonuç ekranında ne görürsünüz?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Sonuç ekranı size teknik kod göstermez. Bunun yerine neden olumlu, olumsuz veya eksik
            bilgi gerektiren bir ön değerlendirme çıktığını sade bir dille açıklar.
          </p>
        </section>
      </div>
    </main>
  );
}

