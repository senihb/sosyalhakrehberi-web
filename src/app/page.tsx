import type { Metadata } from "next";
import Link from "next/link";
import {
  homepageChooseItems,
  homepageGuideLinks,
  homepageHero,
  homepageTrustNotes,
} from "@/lib/homepage-entry-content";

export const metadata: Metadata = {
  title: "Sosyal hak uygunluk testleri ve başvuru rehberleri",
  description:
    "Sosyal Hak Rehberi, anlaşılır ön değerlendirme sayfaları ve başvuru öncesi rehberler sunar.",
  alternates: {
    canonical: "/",
  },
};

const testCards = [
  {
    title: "GSS Gelir Testi",
    body:
      "Kısa form, sade sonuç ve temel rehberlik ile sağlık primi ve gelir testi yönünü hızlıca anlamaya yardımcı olur.",
    href: "/gss-gelir-testi",
    cta: "Sayfayı aç",
    status: "Kullanıma açık",
  },
  {
    title: "Evde Bakım Maaşı Uygunluk Testi",
    body:
      "Bakım ihtiyacı, gelir ve hane bilgisi üzerinden açıklayıcı bir ön değerlendirme ve başvuru hazırlık rehberi sunar.",
    href: "/start",
    cta: "Sayfayı aç",
    status: "Kullanıma açık",
  },
  {
    title: "65 Yaş Aylığı Uygunluk Testi",
    body:
      "Daha büyük yazılar, daha sakin bir akış ve sonraki adımı gösteren sade sonuç yüzeyi içerir.",
    href: "/65-yas-ayligi-uygunluk-testi",
    cta: "Sayfayı aç",
    status: "Kullanıma açık",
  },
  {
    title: "Doğum Yardımı Uygunluk Testi",
    body:
      "Sayfa görünür durumdadır. Bu başlık için rehber ve test akışı hazırlanmaya devam ediyor.",
    href: "/dogum-yardimi-uygunluk-testi",
    cta: "Bilgi sayfasını aç",
    status: "Hazırlanıyor",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="hero-shell">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10 lg:py-18">
          <div className="max-w-3xl">
            <p className="eyebrow">{homepageHero.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {homepageHero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              {homepageHero.body}
            </p>
            <div className="mt-8">
              <Link href={homepageHero.primaryCtaHref} className="primary-link">
                {homepageHero.primaryCtaLabel}
              </Link>
            </div>
          </div>

          <aside className="card-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              60 saniyede yön bul
            </p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>Önce durumunu seç, sonra ilgili uygunluk akışına doğrudan geç.</p>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Bu sayfada ne var?</p>
                <ul className="mt-2 space-y-2">
                  <li>Doğru teste hızlı giriş</li>
                  <li>Sade ön değerlendirme akışları</li>
                  <li>Sonuç sonrası rehber ve sonraki adımlar</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="durumunu-sec"
        className="mx-auto max-w-6xl px-6 py-4 lg:px-10 lg:py-6"
      >
        <div className="card-panel">
          <p className="eyebrow">Durumunu seç</p>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold text-slate-950">
                En ilgili uygunluk testine tek adımda girin
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Hangi başlığın size daha yakın olduğunu seçin. Her kart sizi ilgili
                ön değerlendirme veya bilgi yüzeyine doğrudan taşır.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {homepageChooseItems.map((item) => (
              <article key={item.title} className="tool-card">
                <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p>
                <Link href={item.href} className="secondary-link mt-5">
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-4 lg:px-10 lg:py-6">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {testCards.map((test) => (
            <article key={test.title} className="tool-card">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-950">{test.title}</h2>
                <span className="tool-status">{test.status}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{test.body}</p>
              <Link href={test.href} className="secondary-link mt-6">
                {test.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10 lg:py-8">
        <aside className="card-panel">
          <p className="eyebrow">Güven ve uyarı</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            {homepageTrustNotes.map((note) => (
              <li key={note} className="rounded-2xl bg-slate-50 px-4 py-3">
                {note}
              </li>
            ))}
          </ul>
        </aside>

        <article className="card-panel">
          <p className="eyebrow">Rehberler</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">
            Testten önce veya sonra açılabilecek temel rehberler
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {homepageGuideLinks.map((guide) => (
              <article key={guide.href} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{guide.body}</p>
                <Link href={guide.href} className="secondary-link mt-4 inline-flex">
                  Rehberi aç
                </Link>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-8">
        <article className="card-panel">
          <p className="eyebrow">Proje bilgisi</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">
            Bu yüzey bir kamu kurumu portalı değil, sosyal hizmet odaklı rehberlik projesidir
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Sosyal Hak Rehberi resmî karar vermez. Amacı, kullanıcıyı doğru teste hızlıca
            ulaştırmak, sonucu sade bir dille sunmak ve sonraki adıma yönlendirmektir.
          </p>
        </article>

        <aside className="card-panel">
          <h2 className="text-xl font-semibold text-slate-950">Daha fazla bilgi</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/hakkimizda" className="secondary-link">
              Hakkımızda sayfasını aç
            </Link>
            <Link href="/blog" className="secondary-link">
              Blog ve rehberleri gör
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
