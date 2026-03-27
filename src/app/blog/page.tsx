import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog ve rehber yazıları",
  description:
    "Sosyal hak testlerinden yönlenebileceğiniz rehber yazıları, temel açıklamalar ve başvuru öncesi bilgi sayfaları.",
  alternates: {
    canonical: "/blog",
  },
};

const featuredPosts = [
  {
    href: "/evde-bakim-maasi",
    title: "Evde Bakım Maaşı ana rehberi",
    category: "Evde Bakım",
    body:
      "Ön değerlendirme aracından önce veya sonra okunabilecek temel çerçeveyi, sınırları ve sonucu nasıl yorumlamanız gerektiğini toplar.",
  },
  {
    href: "/gss-gelir-testi/rehber",
    title: "GSS gelir testi rehberi",
    category: "GSS",
    body:
      "Gelir, sosyal güvence ve sigorta sorularının neden sorulduğunu açıklar; sonuç ekranını sade bir dille yorumlar.",
  },
  {
    href: "/65-yas-ayligi-uygunluk-testi/rehber",
    title: "65 Yaş Aylığı rehberi",
    category: "65 Yaş",
    body:
      "Yaş, gelir, eş durumu ve sosyal güvence bilgilerinin neden istendiğini ve eksik bilgi sonucunun ne anlattığını açıklar.",
  },
];

const contentTopics = [
  "Şartlar ve temel uygunluk başlıkları",
  "Gelir ve hane bilgisini doğru hazırlama",
  "Başvuru öncesi hazırlık adımları",
  "Gerekli belgeleri anlamaya yardımcı rehberler",
  "Ret veya eksik bilgi nedenlerini sade dille açıklayan yazı dizileri",
  "Sık sorulan sorular ve kısa cevaplar",
];

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="card-panel">
            <p className="eyebrow">Blog ve Rehberler</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Testlerden sonra yolunuzu bulmanıza yardım eden rehber sayfaları
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
              Bu sayfa sosyal hak testlerinden yönleneceğiniz rehber yazılarını bir araya getirir.
              Amacımız teknik dili azaltmak, sonraki adımı göstermek ve kullanıcının sitede doğal
              biçimde ilerlemesini sağlamaktır.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="primary-link">
                Testlere dön
              </Link>
              <Link href="/hakkimizda" className="secondary-link">
                Hakkımızda
              </Link>
            </div>
          </article>

          <aside className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Bu sayfada ne var?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Blog yüzeyi kurum duyurusu veya resmî mevzuat servisi değildir. Testlerden sonra
              kullanıcının anlayacağı dilde açıklama, rehberlik ve bir sonraki adım yönlendirmesi
              sunar.
            </p>
          </aside>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">Öne çıkan rehberler</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <article key={post.href} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {post.category}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{post.body}</p>
                <Link href={post.href} className="secondary-link mt-4 inline-flex">
                  Yazıyı aç
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="card-panel">
          <h2 className="text-2xl font-semibold text-slate-950">
            Blog yapısında işleyeceğimiz ana başlıklar
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {contentTopics.map((topic) => (
              <article key={topic} className="rounded-2xl bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700">
                {topic}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

