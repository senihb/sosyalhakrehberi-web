import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evde Bakım Maaşı İçin Gelir ve Hane Bilgisi",
  description:
    "Evde bakım maaşı ön değerlendirmesinde toplam hane geliri ve kişi sayısının neden istendiğini açıklayan yardımcı rehber sayfası.",
  alternates: {
    canonical: "/evde-bakim-maasi/gelir-ve-hane-bilgisi",
  },
};

const notes = [
  "Toplam gelir bilgisi tek başına nihai karar anlamına gelmez.",
  "Hane kişi sayısı ile birlikte okunur.",
  "Bu sayfa yalnızca yol gösterici bir özet sunar.",
  "Kesin gelir yorumu bu sayfada yapılmaz.",
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
            Hesaplama ekranında toplam hane geliri ve kişi sayısı istenir; çünkü bu bilgiler ön
            değerlendirme için temel giriş alanları arasındadır. Ancak burada görülen özetler resmî
            gelir kararı değildir.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/start" className="primary-link">
              Başlangıç sayfasına git
            </Link>
            <Link href="/evde-bakim-maasi" className="secondary-link">
              Ana rehbere dön
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Nasıl okunmalı?</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                Gelir bilgisi, hanedeki kişi sayısıyla birlikte anlam kazanır. Bu nedenle hesaplama
                ekranı bu iki veriyi birlikte ister ve kullanıcıya yalnızca rehberlik amaçlı kısa
                bir kontrol adımı sunar.
              </p>
              <p>
                Nihai uygunluk ya da uygunsuzluk sonucu bu sayfada hesaplanmaz. Buradaki gelir
                adımı yalnızca yol gösterir.
              </p>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Kısa notlar</h2>
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

