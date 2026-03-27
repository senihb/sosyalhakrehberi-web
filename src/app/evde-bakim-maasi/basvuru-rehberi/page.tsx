import type { Metadata } from "next";
import Link from "next/link";
import { homeCareApplicationGuide } from "@/lib/home-care-application-guide";

export const metadata: Metadata = {
  title: "Evde Bakım Maaşı Başvuru Hazırlık Rehberi",
  description:
    "Evde bakım maaşı ön değerlendirmesinden sonra hangi kuruma hangi hazırlıkla gidileceğini sade biçimde özetleyen başvuru hazırlık rehberi.",
  alternates: {
    canonical: "/evde-bakim-maasi/basvuru-rehberi",
  },
};

export default function HomeCareApplicationGuidePage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <section className="card-panel">
          <p className="eyebrow">Başvuru Hazırlığı</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {homeCareApplicationGuide.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            {homeCareApplicationGuide.intro}
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            <p className="font-semibold text-slate-950">Hangi kuruma başvurulur?</p>
            <p className="mt-2">{homeCareApplicationGuide.institutionNote}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/start" className="primary-link">
              Ön değerlendirmeye dön
            </Link>
            <Link href="/evde-bakim-maasi" className="secondary-link">
              Ana rehbere dön
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6">
          {homeCareApplicationGuide.steps.map((step) => (
            <article key={step.title} className="card-panel">
              <h2 className="text-2xl font-semibold text-slate-950">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Hazırlanabilecek belgeler</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {homeCareApplicationGuide.documents.map((section) => (
              <article key={section.title} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{section.title}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Önemli sınır</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            {homeCareApplicationGuide.caution}
          </p>
        </section>
      </div>
    </main>
  );
}

