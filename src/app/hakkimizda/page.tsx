import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Sosyal Hak Rehberi'nin amacını, vizyonunu, misyonunu ve kamu kurumu olmadığına dair açık bilgilendirmeyi içeren sayfa.",
  alternates: {
    canonical: "/hakkimizda",
  },
};

const principles = [
  {
    title: "Kamu kurumu hizmeti değiliz",
    body:
      "Sosyal Hak Rehberi resmî bir kurum, kamu portalı veya bağlayıcı karar mercii değildir. Sitedeki sonuçlar ve yazılar yalnızca ön bilgilendirme ve rehberlik amacı taşır.",
  },
  {
    title: "Sosyal hizmet anlayışıyla hareket ediyoruz",
    body:
      "Amacımız sosyal haklara erişimi kolaylaştırmak, karmaşık başlıkları anlaşılır dile çevirmek ve kullanıcının ilk adımı daha güvenli atmasına yardım etmektir.",
  },
  {
    title: "Karar kuralları bu sayfada kurulmaz",
    body:
      "Bu site resmî karar vermez. Gösterilen ön değerlendirme, ayrıca kurulan değerlendirme yapısından gelir ve burada yeniden hesaplanmaz.",
  },
];

const missionItems = [
  "Sosyal hak başlıklarını daha anlaşılır hale getirmek",
  "Düşük dijital yeterlilikte kullanıcılar için sade arayüzler kurmak",
  "Test sonucu ile rehber içeriği arasında doğal bir akış sağlamak",
];

const visionItems = [
  "Sosyal haklara erişimde güvenilir bir yol gösterici yüz olmak",
  "Test ve rehber deneyimini tek bir anlaşılır yüzeyde buluşturmak",
  "Kullanıcıya teknik değil, yönlendirici ve saygılı bir deneyim sunmak",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="card-panel">
            <p className="eyebrow">Hakkımızda</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Sosyal Hak Rehberi, kamu kurumu hizmeti değil; sosyal hizmet anlayışıyla kurulan bir
              rehberlik projesidir
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Bu proje, sosyal hak başlıklarına ulaşmak isteyen kişilerin test, açıklama ve rehber
              içerikleri aynı yerde bulabilmesi için kuruldu. Amacımız resmî kurum yerine geçmek
              değil; ilk adımı daha anlaşılır, daha sakin ve daha güvenli hale getirmektir.
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
              Buradaki sonuç ekranları resmî karar yerine geçmez. Nihai hak sahipliği, ilgili kurum
              incelemesi ve güncel uygulama çerçevesinde belirlenir.
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

