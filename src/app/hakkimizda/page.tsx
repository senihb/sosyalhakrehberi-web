import type { Metadata } from "next";
import Link from "next/link";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Sosyal Hak Rehberi'nin amacı, vizyonu, uzmanlık zemini ve doğrudan iletişim kanalları.",
  alternates: {
    canonical: "/hakkimizda",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="card-panel">
            <p className="eyebrow">Hakkımızda</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {siteProfile.tagline}, sosyal hizmet anlayışıyla kurulan bir rehberlik projesidir
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              {siteProfile.mission}. Bu proje, test, açıklama ve rehber içeriklerini aynı yerde
              toplar; ilk adımı daha anlaşılır, daha sakin ve daha güvenli hale getirir.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="primary-link">
                Testlere dön
              </Link>
              <Link href="/blog" className="secondary-link">
                Blog ve rehberleri gör
              </Link>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Açık not</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {siteProfile.trustPoints[0]} Nihai hak sahipliği, ilgili kurum incelemesi ve güncel
              uygulama çerçevesinde belirlenir.
            </p>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Profesyonel zemin</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteProfile.expertise.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Eğitim ve yetkinlik</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteProfile.education.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Sertifikalar</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteProfile.certificates.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Doğrudan iletişim</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{siteProfile.founderSummary}</p>
            <div className="mt-5 grid gap-3">
              {siteProfile.contactChannels.map((channel) => (
                <a
                  key={channel.kind}
                  href={channel.href}
                  target={channel.kind === "email" ? undefined : "_blank"}
                  rel={channel.kind === "email" ? undefined : "noreferrer"}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:-translate-y-0.5 hover:border-slate-300"
                >
                  <p className="text-sm font-semibold text-slate-950">{channel.label}</p>
                  <p className="mt-1 text-sm text-slate-700">{channel.value}</p>
                  <p className="mt-1 text-xs text-slate-600">{channel.note}</p>
                </a>
              ))}
            </div>
          </article>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Neden bu proje?</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            {siteProfile.professionalSummary} Hedef, sosyal hak başlıklarında ziyaretçiyi
            gereksiz jargonla yormadan doğru rehbere ve doğru sonraki adıma ulaştırmaktır.
          </p>
        </section>
      </div>
    </main>
  );
}