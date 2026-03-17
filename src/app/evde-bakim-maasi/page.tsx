import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evde Bakım Maaşı Rehberi",
  description:
    "Evde bakım maaşı için temel şartları, gerekli bilgileri ve ön değerlendirme mantığını sade bir dille açıklayan ana rehber sayfası.",
};

const promiseSections = [
  {
    title: "Bu sayfa ne sunar?",
    body:
      "Evde bakım maaşı hakkında genel çerçeveyi açıklar ve hesaplama aracına geçmeden önce hangi bilgilerin önemli olduğunu gösterir.",
  },
  {
    title: "Ne sunmaz?",
    body:
      "Resmi hak kazanımı kararı, kişiye özel hukuki görüş veya kurum yerine geçen bağlayıcı sonuç üretmez.",
  },
  {
    title: "Nasıl çalışır?",
    body:
      "Araç yalnızca SocialRightOS backend karar motorunun döndürdüğü statü, nedenler ve eksik bilgi alanlarını tüketir.",
  },
];

const checklist = [
  "Engellilik oranı",
  "Aylık toplam hane geliri",
  "Hanedeki kişi sayısı",
  "Türkiye Cumhuriyeti vatandaşlık durumu",
  "Türkiye’de ikamet bilgisi",
];

const faqItems = [
  {
    question: "Bu araç resmi sonuç verir mi?",
    answer:
      "Hayır. Bu araç yalnızca ön değerlendirme sunar. Nihai karar ilgili kurumun incelemesi ve güncel mevzuat uygulamasıyla verilir.",
  },
  {
    question: "Hangi bilgilerle çalışır?",
    answer:
      "MVP yalnızca temel değerlendirme alanlarını kullanır. Kimlik numarası, açık adres veya belge yükleme istenmez.",
  },
  {
    question: "Backend mantığı frontend’de mi çalışıyor?",
    answer:
      "Hayır. Uygunluk mantığı, threshold değerleri ve statü anlamları tamamen backend tarafından belirlenir.",
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
              Evde bakım maaşı için anlaşılır açıklama ve güvenli ön değerlendirme akışı
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              Evde bakım maaşı, ağır engelli bireyin bakım ihtiyacına ilişkin belirli
              koşullar altında değerlendirilen bir destek alanıdır. Bu sayfa, başvuru
              öncesi hazırlık yapmanıza yardımcı olmak için sade açıklamalar ve hesaplama
              aracına geçiş sunar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
                Ön değerlendirmeyi başlat
              </Link>
              <Link href="/" className="secondary-link">
                Ana sayfaya dön
              </Link>
            </div>
          </div>

          <aside className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Güven notu</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Sonuçlar yalnızca ön değerlendirme niteliğindedir. Nihai değerlendirme ilgili
              kurumun incelemesi ve güncel mevzuat uygulamasıyla belirlenir.
            </p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Bu aşamada istenmeyen veriler</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Kimlik numarası, açık adres, belge yükleme ve gereksiz kişisel veri bu MVP
                kapsamına dahil değildir.
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
              Hesaplama aracına geçmeden önce hazırlamanız iyi olur
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
                Araç size üç temel sonuçtan birini gösterebilir: uygun görünüyor, uygun
                görünmüyor veya daha fazla bilgi gerekli.
              </p>
              <p>
                Sonuç ekranında backend tarafından döndürülen nedenler, eksik bilgiler ve
                değerlendirme metadatası görünür. Böylece kullanıcı hangi bilgiyle ilerlediğini
                açık biçimde anlar.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-8 card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Sık sorulan kısa sorular</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
