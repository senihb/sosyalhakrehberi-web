import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkimizda",
  description:
    "Sosyal Hak Rehberi'nin amacini, vizyonunu, misyonunu ve kamu kurumu olmadigina dair acik bilgilendirmeyi iceren sayfa.",
  alternates: {
    canonical: "/hakkimizda",
  },
};

const principles = [
  {
    title: "Kamu kurumu hizmeti degiliz",
    body:
      "Sosyal Hak Rehberi resmi bir kurum, kamu portali veya baglayici karar mercii degildir. Sitedeki sonuclar ve yazilar yalnizca on bilgilendirme ve rehberlik amaci tasir.",
  },
  {
    title: "Sosyal hizmet anlayisiyla hareket ediyoruz",
    body:
      "Amacimiz sosyal haklara erisimi kolaylastirmak, karmasik basliklari anlasilir dile cevirmek ve kullanicinin ilk adimi daha guvenli atmasina yardim etmektir.",
  },
  {
    title: "Karar kurallari bu sayfada kurulmaz",
    body:
      "Bu site resmi karar vermez. Gosterilen on degerlendirme, ayrica kurulan degerlendirme yapisindan gelir ve burada yeniden hesaplanmaz.",
  },
];

const missionItems = [
  "Sosyal hak basliklarini daha anlasilir hale getirmek",
  "Dusuk dijital yeterlilikte kullanicilar icin sade arayuzler kurmak",
  "Test sonucu ile rehber icerigi arasinda dogal bir akis saglamak",
];

const visionItems = [
  "Sosyal haklara erisimde guvenilir bir yol gosterici yuz olmak",
  "Test ve rehber deneyimini tek bir anlasilir yuzeyde bulusturmak",
  "Kullaniciya teknik degil, yonlendirici ve saygili bir deneyim sunmak",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="card-panel">
            <p className="eyebrow">Hakkimizda</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Sosyal Hak Rehberi, kamu kurumu hizmeti degil; sosyal hizmet anlayisiyla kurulan bir
              rehberlik projesidir
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Bu proje, sosyal hak basliklarina ulasmak isteyen kisilerin test, aciklama ve rehber
              icerikleri ayni yerde bulabilmesi icin kuruldu. Amacimiz resmi kurum yerine gecmek
              degil; ilk adimi daha anlasilir, daha sakin ve daha guvenli hale getirmektir.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="primary-link">
                Testlere don
              </Link>
              <Link href="/blog" className="secondary-link">
                Blog ve rehberleri gor
              </Link>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Acik not</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Buradaki sonuc ekranlari resmi karar yerine gecmez. Nihai hak sahipligi, ilgili kurum
              incelemesi ve guncel uygulama cercevesinde belirlenir.
            </p>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Misyonumuz</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {missionItems.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Vizyonumuz</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {visionItems.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
