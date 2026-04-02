import type { Metadata } from "next";
import Link from "next/link";
import { homeCareMethodologyContent } from "@/lib/methodology-content";
import { siteProfile } from "@/lib/site-profile";

export const metadata: Metadata = {
  title: "Yöntem ve Sınırlar",
  description:
    "Evde bakım maaşı ön değerlendirme aracının nasıl çalıştığını, sınırlarını ve neden ön değerlendirme sunduğunu açıklar.",
  alternates: {
    canonical: "/methodology",
  },
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">Yöntem ve Sınırlar</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {homeCareMethodologyContent.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            {homeCareMethodologyContent.subtitle} {siteProfile.trustPoints[1]}
          </p>
        </section>

        <section className="grid gap-5">
          {homeCareMethodologyContent.sections.map((section) => (
            <article key={section.title} className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="card-panel">
          <h2 className="text-xl font-semibold text-slate-950">Sonraki adım</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Ön değerlendirme sonucunu gördüyseniz bilgilerinizi resmî başvuru kanallarında
            doğrulayın ve gerekirse rehber sayfasındaki hazırlık adımlarını gözden geçirin.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {homeCareMethodologyContent.links.map((link) => (
              <Link key={link.href} href={link.href} className="secondary-link inline-flex">
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-7 text-amber-950">
          <p className="font-semibold">Önemli not</p>
          <p className="mt-2">{homeCareMethodologyContent.disclaimer}</p>
        </section>
      </div>
    </main>
  );
}