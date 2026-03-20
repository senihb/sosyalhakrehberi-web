import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evde Bakim Maasi Icin Gelir ve Hane Bilgisi",
  description:
    "Evde bakim maasi on degerlendirmesinde toplam hane geliri ve kisi sayisinin neden istendigini aciklayan yardimci rehber sayfasi.",
  alternates: {
    canonical: "/evde-bakim-maasi/gelir-ve-hane-bilgisi",
  },
};

const notes = [
  "Toplam gelir bilgisi tek basina nihai karar anlamina gelmez.",
  "Hane kisi sayisi ile birlikte okunur.",
  "Bu sayfa yalnizca yol gosterici bir ozet sunar.",
  "Kesin gelir yorumu bu sayfada yapilmaz.",
];

export default function HomeCareIncomeGuidePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <section className="card-panel">
          <p className="eyebrow">Detay Rehber</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Gelir ve hane bilgisi neden istenir?
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Hesaplama ekraninda toplam hane geliri ve kisi sayisi istenir; cunku bu bilgiler on
            degerlendirme icin temel giris alanlari arasindadir. Ancak burada gorulen ozetler resmi
            gelir karari degildir.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
              Hesaplama sayfasina git
            </Link>
            <Link href="/evde-bakim-maasi" className="secondary-link">
              Ana rehbere don
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Nasil okunmali?</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                Gelir bilgisi, hanedeki kisi sayisiyla birlikte anlam kazanir. Bu nedenle hesaplama
                ekrani bu iki veriyi birlikte ister ve kullaniciya yalnizca rehberlik amacli kisa
                bir kontrol adimi sunar.
              </p>
              <p>
                Nihai uygunluk ya da uygunsuzluk sonucu bu sayfada hesaplanmaz. Buradaki gelir
                adimi yalnizca yol gosterir.
              </p>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Kisa notlar</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {notes.map((note) => (
                <li key={note} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {note}
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>
    </main>
  );
}
