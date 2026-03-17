import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ana Sayfa",
  description:
    "Sosyal Hak Rehberi, evde bakım maaşı için güven veren açıklamalar ve backend destekli ön değerlendirme akışı sunar.",
};

const highlights = [
  {
    title: "Tek fayda, net odak",
    body:
      "MVP yalnızca evde bakım maaşına odaklanır. Çoklu benefit, dashboard veya üyelik sistemi bu aşamada kapsam dışıdır.",
  },
  {
    title: "SEO ve araç birlikte çalışır",
    body:
      "Bilgilendirici içerik ile hesaplama akışı aynı güven hattında ilerler. Kullanıcı hem açıklama görür hem de ön değerlendirme alır.",
  },
  {
    title: "Ön değerlendirme yaklaşımı",
    body:
      "Sonuçlar bağlayıcı iddia taşımaz. Eksik bilgi, risk ve sonraki adım ihtiyacı açık biçimde gösterilir.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="hero-shell">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Sosyal Hak Rehberi</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Evde bakım maaşı için sade, güven veren ve backend destekli ön değerlendirme.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Bu site resmi karar vermez. SocialRightOS karar motorundan gelen sonucu
              anlaşılır biçimde sunar; başvuru öncesinde hangi bilgilerin önemli olduğunu
              görmenize yardımcı olur.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/evde-bakim-maasi" className="primary-link">
                Evde bakım maaşı rehberine git
              </Link>
              <Link href="/evde-bakim-maasi/hesaplama" className="secondary-link">
                Hesaplama aracını aç
              </Link>
            </div>
          </div>

          <aside className="card-panel max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Neden bu yapı?
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <li>Frontend hak sahipliği mantığı üretmez.</li>
              <li>İş kuralları backend contract içinde kalır.</li>
              <li>Vatandaş için anlaşılır açıklama, güven ve yönlendirme sunulur.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-3 lg:px-10 lg:py-12">
        {highlights.map((highlight) => (
          <article key={highlight.title} className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">{highlight.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">{highlight.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
