import type { Metadata } from "next";
import Link from "next/link";
import { siteOperations } from "@/lib/site-operations";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Hakkımızda | Misyon, Vizyon ve Çalışma Modeli",
  description:
    "Sosyal Hak Rehberi'nin misyonu, vizyonu, uzmanlık zemini, iş dağılımı ve doğrudan iletişim kanalları.",
  alternates: {
    canonical: "/hakkimizda",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="card-panel">
            <p className="eyebrow">Hakkımızda</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {siteProfile.tagline}, sosyal hak bilgisini sade, güven veren ve ölçülebilir bir
              rehberlik sistemine dönüştürür
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
              {siteProfile.mission} Buradaki amaç, ziyaretçiyi ilk anda do,gru teste, doğru rehbere
              ve doğru sonraki adıma yönlendirmektir.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="primary-link">
                Ana sayfaya dön
              </Link>
              <Link href="/methodology" className="secondary-link">
                Yöntem ve sınırları oku
              </Link>
            </div>
          </article>

          <aside className="card-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Kısa profil
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">{siteProfile.founderName}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">{siteProfile.founderRole}</p>
            <p className="mt-4 text-sm leading-7 text-slate-700">{siteProfile.founderSummary}</p>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card-panel">
            <p className="eyebrow">Misyon</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Ne yapıyoruz?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{siteOperations.mission}</p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteOperations.trafficModel.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <p className="eyebrow">Vizyon</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Nereye gidiyoruz?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{siteProfile.vision}</p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Çalışma ilkesi</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Trafik, veri ve satış sırasını koruruz; önce değer üretir, sonra ölçer, en son
                ölçekleriz.
              </p>
            </div>
          </article>
        </section>

        <section className="card-panel">
          <p className="eyebrow">İş dağılımı</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">
            Frontend, backend ve admin rolü net çalışır
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {siteOperations.workStreams.map((stream) => (
              <article key={stream.key} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {stream.title}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{stream.summary}</h3>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
                  {stream.responsibilities.map((item) => (
                    <li key={item} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-medium text-slate-900">{stream.output}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="card-panel">
            <p className="eyebrow">Profesyonel zemin</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Uzmanlık alanları</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteProfile.expertise.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <p className="eyebrow">Eğitim ve yetkinlik</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Akademik ve sertifika zemini</h2>
            <div className="mt-5 space-y-6">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Eğitim
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                  {siteProfile.education.map((item) => (
                    <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Sertifikalar
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                  {siteProfile.certificates.map((item) => (
                    <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="card-panel">
            <p className="eyebrow">Neden bu proje?</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">
              Sosyal hak bilgisini daha anlaşılır, daha hızlı ve daha ölçülebilir hale getirmek için
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {siteProfile.professionalSummary} Hedef, kullanıcıyı gereksiz jargonla yormadan
              doğru rehbere, doğru sayfaya ve doğru aksiyona ulaştırmaktır.
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              {siteOperations.publishingRules.map((rule) => (
                <li key={rule} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {rule}
                </li>
              ))}
            </ul>
          </article>

          <aside className="card-panel">
            <p className="eyebrow">İletişim</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Doğrudan iletişim kanalları</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              Uzun form yerine doğrudan ve net iletişim tercih edilir. Uygun kanal üzerinden kısa
              yönlendirme alabilirsiniz.
            </p>
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
          </aside>
        </section>
      </div>
    </main>
  );
}
