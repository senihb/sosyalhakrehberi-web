import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evde Bakım Maaşı Şartları",
  description:
    "Evde bakım maaşı için temel uygunluk başlıklarını, vatandaşlık, ikamet, gelir ve hane bilgisi açısından sade bir dille özetleyen rehber sayfa.",
  alternates: {
    canonical: "/evde-bakim-maasi/sartlar",
  },
};

const sections = [
  {
    title: "Vatandaşlık ve ikamet bilgisi",
    body:
      "Ön değerlendirme akışında vatandaşlık ve Türkiye'de ikamet bilgisi temel doğrulama alanları arasındadır. Bu bilgilerden emin değilseniz hesaplama ekranında Bilmiyorum seçeneği kullanılabilir.",
  },
  {
    title: "Gelir ve hane bilgisi",
    body:
      "Toplam hane geliri ile hanedeki kişi sayısı birlikte değerlendirilir. Frontend bu alanlarda nihai eşik kararı vermez; backend yalnızca girilen bilgileri authoritative kurallarla değerlendirir.",
  },
  {
    title: "Engellilik oranı ve bakım ihtiyacı",
    body:
      "Engellilik oranı ön değerlendirmede önemli alanlardan biridir. Ancak nihai uygunluk, resmi inceleme ve güncel mevzuat çerçevesinde belirlenir.",
  },
];

export default function HomeCareConditionsPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <section className="card-panel">
          <p className="eyebrow">Detay Rehber</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Evde bakım maaşı şartları nasıl okunmalı?
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            Bu sayfa, evde bakım maaşı için ön değerlendirmede dikkate alınan temel başlıkları
            sadeleştirir. Nihai karar üretmez; hangi bilgilerin sonucu etkileyebileceğini açıklamaya
            yardımcı olur.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
              Ön değerlendirmeyi başlat
            </Link>
            <Link href="/evde-bakim-maasi" className="secondary-link">
              Ana rehbere dön
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6">
          {sections.map((section) => (
            <article key={section.title} className="card-panel">
              <h2 className="text-2xl font-semibold text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Ne yapmaz?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Bu içerik hukuki görüş, resmi karar veya belge otomasyonu sunmaz. Eşik ve threshold
              davranışı frontend tarafından hesaplanmaz.
            </p>
          </article>

          <article className="card-panel">
            <h2 className="text-2xl font-semibold text-slate-950">Sonraki adım</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Şart başlıklarını okuduktan sonra hesaplama aracında temel bilgileri girerek backend
              destekli ön değerlendirme alabilirsiniz.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
