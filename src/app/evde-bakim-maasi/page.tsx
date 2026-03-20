import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evde Bakim Maasi Rehberi",
  description:
    "Evde bakim maasi icin temel sartlari, gerekli bilgileri ve on degerlendirme mantigini sade bir dille aciklayan ana rehber sayfasi.",
  alternates: {
    canonical: "/evde-bakim-maasi",
  },
};

const promiseSections = [
  {
    title: "Bu sayfa ne sunar?",
    body:
      "Evde bakim maasi hakkinda genel cerceveyi aciklar ve hesaplama sayfasina gecmeden once hangi bilgilerin onemli oldugunu gosterir.",
  },
  {
    title: "Ne sunmaz?",
    body:
      "Resmi hak kazanimi karari, kisiye ozel hukuki gorus veya kurum yerine gecen baglayici sonuc uretmez.",
  },
  {
    title: "Nasil calisir?",
    body:
      "Bu sayfa yalnizca degerlendirme sonucunu, nedenleri ve eksik bilgi basliklarini aciklar.",
  },
];

const checklist = [
  "Engellilik orani",
  "Aylik toplam hane geliri",
  "Hanedeki kisi sayisi",
  "Turkiye Cumhuriyeti vatandaslik durumu",
  "Turkiye'de ikamet bilgisi",
  "Tam bagimli bakim ihtiyaci bilgisi",
];

const faqItems = [
  {
    question: "Bu arac resmi sonuc verir mi?",
    answer:
      "Hayir. Bu arac yalnizca on degerlendirme sunar. Nihai karar ilgili kurumun incelemesi ve guncel uygulamasi ile verilir.",
  },
  {
    question: "Hangi bilgilerle calisir?",
    answer:
      "Yalnizca temel degerlendirme alanlari kullanilir. Kimlik numarasi, acik adres veya belge yukleme istenmez.",
  },
  {
    question: "Karar kurallari bu sayfada mi kuruluyor?",
    answer:
      "Hayir. Uygunluk kurallari, esik degerler ve sonuc anlamlari bu sayfa disinda belirlenir.",
  },
];

const detailGuides = [
  {
    href: "/evde-bakim-maasi/sartlar",
    title: "Evde Bakim Maasi sartlari",
    body:
      "Vatandaslik, ikamet, gelir ve hane bilgisi gibi temel basliklari kisa ve anlasilir bicimde ozetler.",
  },
  {
    href: "/evde-bakim-maasi/gelir-ve-hane-bilgisi",
    title: "Gelir ve hane bilgisi rehberi",
    body:
      "Gelir ve kisi sayisi alanlarinin neden istendigini ve sayfanin neden nihai gelir karari vermedigini aciklar.",
  },
];

export default function HomeCareAllowancePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="card-panel">
            <p className="eyebrow">Ana Rehber</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Evde bakim maasi icin anlasilir aciklama ve guvenli on degerlendirme akisi
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Evde bakim maasi, agir engelli bireyin tam bagimli bakim ihtiyacina iliskin belirli
              kosullar altinda degerlendirilen bir destek alanidir. Bu sayfa, basvuru oncesi
              hazirlik yapmaniza yardimci olmak icin sade aciklamalar ve hesaplama sayfasina gecis
              sunar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
                On degerlendirmeyi baslat
              </Link>
              <Link href="/" className="secondary-link">
                Ana sayfaya don
              </Link>
            </div>
          </div>

          <aside className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Guven notu</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Sonuclar yalnizca on degerlendirme niteligindedir. Nihai degerlendirme ilgili kurumun
              incelemesi ve guncel uygulamasi ile belirlenir.
            </p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Bu asamada istenmeyen veriler</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Kimlik numarasi, acik adres, belge yukleme ve gereksiz kisisel veri bu kapsama
                dahil degildir.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {promiseSections.map((section) => (
            <article key={section.title} className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">
              Hesaplama sayfasina gecmeden once hazirlamaniz iyi olur
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {checklist.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">
              Hesaplama sonucundan sonra ne beklersiniz?
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
              <p>
                Sayfa size uc temel sonuc yonunden birini gosterebilir: uygun gorunuyor, uygun
                gorunmuyor veya daha fazla bilgi gerekli.
              </p>
              <p>
                Sonuc ekraninda nedenler, eksik bilgiler ve yonlendirici aciklamalar gorunur.
                Boylece hangi bilgiyle ilerlediginizi acik bicimde anlarsiniz.
              </p>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">En hizli gecis yolu</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Temel bilgileri biliyorsaniz dogrudan hesaplama sayfasina gecebilirsiniz.
                </p>
                <Link href="/evde-bakim-maasi/hesaplama" className="secondary-link mt-4 inline-flex">
                  Hesaplama sayfasina git
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Sik sorulan kisa sorular</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Detay rehberleri</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {detailGuides.map((guide) => (
              <article key={guide.href} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{guide.body}</p>
                <Link href={guide.href} className="secondary-link mt-4 inline-flex">
                  Rehberi ac
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
