import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "65 yaş aylığı rehberi",
  description:
    "65 yaş aylığı testinde yaş, eş geliri ve sosyal güvence bilgilerinin neden sorulduğunu açıklayan kısa rehber sayfası.",
  alternates: {
    canonical: "/65-yas-ayligi-uygunluk-testi/rehber",
  },
};

export default function OldAgeGuidePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card-panel">
          <p className="eyebrow">65 Yaş Rehberi</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            65 yaş aylığı testinde hangi bilgiler neden sorulur?
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-700">
            Bu sayfa 65 yaş aylığı aracı öncesinde veya sonrasında kısa bir hazırlık rehberi olarak
            kullanılabilir. Araç resmî karar vermez; yalnızca açıklayıcı ön değerlendirme sunar.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/65-yas-ayligi-uygunluk-testi" className="primary-link">
              65 yaş testini aç
            </Link>
            <Link href="/" className="secondary-link">
              Diğer testleri gör
            </Link>
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Temel bilgiler</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            <li>Yaş bilgisi</li>
            <li>Varsa eş durumu ve eş geliri</li>
            <li>Kendi aylık geliriniz</li>
            <li>Sosyal güvence durumu</li>
            <li>Mevcut emekli aylığı bilgisi</li>
          </ul>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Eksik bilgi neden önemli?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Eğer eşiniz varsa ve gelir bilgisi girilmezse sistem eksik bilgi sonucu döndürebilir.
            Bu nedenle araç, teknik dil kullanmadan hangi alanın tamamlanması gerektiğini ayrıca
            gösterir.
          </p>
        </section>
      </div>
    </main>
  );
}

