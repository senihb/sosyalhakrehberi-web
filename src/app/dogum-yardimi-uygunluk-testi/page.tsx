import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dogum yardimi uygunluk testi",
  description:
    "Dogum yardimi basligi icin hazirlanan sayfa. Test ve rehber akisi bu alan icin olusturulma asamasindadir.",
  alternates: {
    canonical: "/dogum-yardimi-uygunluk-testi",
  },
};

export default function BirthSupportPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="card-panel">
            <p className="eyebrow">Dogum Yardimi</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Dogum Yardimi Uygunluk Testi hazirlaniyor
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Bu baslik icin sayfa gorunur hale getirildi. Test ve rehber akisi hazirlaniyor;
              yayinlandiginda bu ekrandan dogrudan ulasilabilecek.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="primary-link">
                Diger testlere don
              </Link>
              <Link href="/blog" className="secondary-link">
                Rehber yazilarini gor
              </Link>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Kisa bilgi</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Bu sayfa hazirlik asamasindadir. Resmi karar vermez ve yayinlanana kadar test sonucu
              uretmez.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
