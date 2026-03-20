import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GSS gelir testi rehberi",
  description:
    "GSS gelir testi sayfasinda hangi bilgilerin neden soruldugunu ve sonucun nasil okunmasi gerektigini aciklayan kisa rehber.",
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
            GSS gelir testi sonucu nasil okunur?
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-700">
            GSS gelir testi araci resmi karar vermez. Sosyal guvence, aktif sigorta ve gelir
            bilginizi degerlendirme sistemine iletir; size on degerlendirme ve bir sonraki adim icin
            kisa yonlendirme sunar.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/gss-gelir-testi" className="primary-link">
              GSS testini ac
            </Link>
            <Link href="/" className="secondary-link">
              Diger testleri gor
            </Link>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Bu testte neler sorulur?</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            <li>Brut toplam hane geliri</li>
            <li>Hanedeki kisi sayisi</li>
            <li>Sosyal guvence durumu</li>
            <li>Aktif sigorta bilgisi</li>
            <li>Bir yakin uzerinden kapsam durumu</li>
          </ul>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Sonuc ekraninda ne gorursunuz?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Sonuc ekrani size teknik kod gostermez. Bunun yerine neden olumlu, olumsuz veya eksik
            bilgi gerektiren bir on degerlendirme ciktigini sade bir dille aciklar.
          </p>
        </section>
      </div>
    </main>
  );
}


