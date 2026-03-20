import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "65 yas ayligi rehberi",
  description:
    "65 yas ayligi testinde yas, es geliri ve sosyal guvence bilgilerinin neden soruldugunu aciklayan kisa rehber sayfasi.",
  alternates: {
    canonical: "/65-yas-ayligi-uygunluk-testi/rehber",
  },
};

export default function OldAgeGuidePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card-panel">
          <p className="eyebrow">65 Yas Rehberi</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            65 yas ayligi testinde hangi bilgiler neden sorulur?
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-700">
            Bu sayfa 65 yas ayligi araci oncesinde veya sonrasinda kisa bir hazirlik rehberi olarak
            kullanilabilir. Arac resmi karar vermez; yalnızca aciklayici on degerlendirme
            sunar.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/65-yas-ayligi-uygunluk-testi" className="primary-link">
              65 yas testini ac
            </Link>
            <Link href="/" className="secondary-link">
              Diger testleri gor
            </Link>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Temel bilgiler</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            <li>Yas bilgisi</li>
            <li>Varsa es durumu ve es geliri</li>
            <li>Kendi aylik geliriniz</li>
            <li>Sosyal guvence durumu</li>
            <li>Mevcut emekli ayligi bilgisi</li>
          </ul>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Eksik bilgi neden onemli?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Eger esiniz varsa ve gelir bilgisi girilmezse sistem eksik bilgi sonucu dondurebilir.
            Bu nedenle arac, teknik dil kullanmadan hangi alanin tamamlanmasi gerektigini ayrica
            gosterir.
          </p>
        </section>
      </div>
    </main>
  );
}



