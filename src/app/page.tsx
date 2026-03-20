import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sosyal hak uygunluk testleri ve basvuru rehberleri",
  description:
    "Sosyal Hak Rehberi, anlasilir on degerlendirme sayfalari ve basvuru oncesi rehberler sunar.",
  alternates: {
    canonical: "/",
  },
};

const testCards = [
  {
    title: "GSS Gelir Testi",
    body:
      "Genel Saglik Sigortasi kapsaminda gelir testi icin sade form, aciklayici sonuc ve temel rehberlik sunar.",
    href: "/gss-gelir-testi",
    cta: "Teste git",
    status: "Kullanima acik",
  },
  {
    title: "Evde Bakim Maasi Uygunluk Testi",
    body:
      "Tam bagimli bakim ihtiyaci bulunan kisiler icin evde bakim maasi yonunu anlamaya yardim eden, aciklayici sonuc ve rehberlik akisi sunar.",
    href: "/evde-bakim-maasi/hesaplama",
    cta: "Teste git",
    status: "Kullanima acik",
  },
  {
    title: "65 Yas Ayligi Uygunluk Testi",
    body:
      "65 yas ayligi icin daha buyuk yazilar, sade sorular ve sonraki adimi aciklayan sonuc sayfasi sunar.",
    href: "/65-yas-ayligi-uygunluk-testi",
    cta: "Teste git",
    status: "Kullanima acik",
  },
  {
    title: "Dogum Yardimi Uygunluk Testi",
    body:
      "Dogum yardimi sayfasi gorunur durumdadir. Bu baslik icin rehber ve test akisi hazirlaniyor.",
    href: "/dogum-yardimi-uygunluk-testi",
    cta: "Sayfayi gor",
    status: "Hazirlaniyor",
  },
];

const chooseItems = [
  {
    title: "Saglik primleri ve gelir testi sorulariniz varsa",
    body:
      "GSS Gelir Testi, sosyal guvence ve gelir testi baglamini netlestirmek isteyen kullanicilar icin dogru baslangic sayfasidir.",
  },
  {
    title: "Agir engelli yakin bakimi icin destek ariyorsaniz",
    body:
      "Evde Bakim Maasi Uygunluk Testi, tam bagimli bakim ihtiyacina yonelik sorular icin dogru baslangic sayfasidir.",
  },
  {
    title: "Ileri yas destekleriyle ilgili hizli bir yon lazimsa",
    body:
      "65 Yas Ayligi sayfasinda daha buyuk yazi, daha az soru ve daha sakin bir ilerleyis bulunur.",
  },
  {
    title: "Dogum yardimi konusunda bilgi ariyorsaniz",
    body:
      "Dogum Yardimi Uygunluk Testi sayfasi hazirlaniyor. Bu basligi simdiden gorebilir, aciklama yuzeyine ulasabilirsiniz.",
  },
];

const trustNotes = [
  "Bu sitedeki sonuclar on degerlendirme niteligindedir; resmi karar yerine gecmez.",
  "Karar kurallari bu sayfada kurulmaz; sonuc yalnizca aciklayici bicimde sunulur.",
  "Gereksiz kisisel veri istemiyoruz. Kimlik numarasi, acik adres ve belge yukleme bu asamada yok.",
];

const guideLinks = [
  {
    href: "/blog",
    title: "Blog ve rehber yazilari",
    body:
      "Testlerden sonra okunabilecek aciklamalari, yol gosterici yazi dizilerini ve rehber icerikleri tek yerde toplar.",
  },
  {
    href: "/evde-bakim-maasi",
    title: "Evde Bakim Maasi ana rehberi",
    body:
      "Hesaplamaya gecmeden once hangi bilgilerin gerekli oldugunu, sonuc ekraninin ne anlattigini ve bu sayfanin sinirlarini ozetler.",
  },
  {
    href: "/evde-bakim-maasi/sartlar",
    title: "Evde Bakim Maasi sartlari",
    body:
      "Vatandaslik, ikamet, gelir ve hane bilgisi gibi temel basliklari kisa ve net sekilde toplar.",
  },
  {
    href: "/evde-bakim-maasi/gelir-ve-hane-bilgisi",
    title: "Gelir ve hane bilgisi rehberi",
    body:
      "Gelir sorularinin neden istendigini ve gelir kapisinin neden yalnizca yol gosterici olarak kullanildigini anlatir.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="hero-shell">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Sosyal Hak Testleri</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Sosyal hak testlerini tek giriste acin, sonucunuzu alin, sonraki adimi gorun
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Sosyal Hak Rehberi tanitim sayfasi gibi degil, urun gibi calisir. Kullaniciyi
              dogrudan uygun teste tasir, on degerlendirme sonucunu gosterir ve ilgili rehberlere
              yonlendirir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
                Evde Bakim Maasi testini ac
              </Link>
              <Link href="#hangi-testi-secmeliyim" className="secondary-link">
                Hangi test bana uygun?
              </Link>
            </div>
          </div>

          <aside className="card-panel">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Guvenli kullanim
            </p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <p>Bu site resmi kurum karari vermez. On degerlendirme sonucu ve rehberlik sunar.</p>
              <p>Evde Bakim Maasi sayfasi, mevcut guvenli akisin korundugu temel ornektir.</p>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Bugun ne yapabilirsiniz?</p>
                <p className="mt-2">
                  Evde Bakim Maasi, GSS ve 65 Yas sayfalarina hemen gecebilir; rehber ve bilgi
                  sayfalarina ayni ekrandan ulasabilirsiniz.
                </p>
              </div>
            </div>
          </aside>
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
              <Link
                href={test.href}
                className={test.status === "Kullanima acik" ? "primary-link mt-6" : "secondary-link mt-6"}
              >
                {test.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        id="hangi-testi-secmeliyim"
        className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10 lg:py-8"
      >
        <article className="card-panel">
          <p className="eyebrow">Hangi testi secmeliyim?</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">
            Once sorununuzu secin, sonra en kisa yoldan ilgili sayfaya gecin
          </h2>
          <div className="mt-5 grid gap-4">
            {chooseItems.map((item) => (
              <article key={item.title} className="rounded-2xl bg-slate-50 px-5 py-4">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p>
              </article>
            ))}
          </div>
        </article>

        <aside className="card-panel">
          <h2 className="text-xl font-semibold text-slate-950">Tek tikla ilgili sayfaya gidin</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Buradan kullanima acik testlere tek tikla gecebilir, hazirlanan sayfalarin da bilgi
            yuzunu gorebilirsiniz.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
              Evde Bakim Maasi testini baslat
            </Link>
            <Link href="/dogum-yardimi-uygunluk-testi" className="secondary-link">
              Dogum Yardimi sayfasini ac
            </Link>
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10 lg:py-8">
        <aside className="card-panel">
          <p className="eyebrow">Guven ve uyari</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
            {trustNotes.map((note) => (
              <li key={note} className="rounded-2xl bg-slate-50 px-4 py-3">
                {note}
              </li>
            ))}
          </ul>
        </aside>

        <article className="card-panel">
          <p className="eyebrow">En cok okunan rehberler</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">
            Testten once ve sonra acilan temel rehberler
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {guideLinks.map((guide) => (
              <article key={guide.href} className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{guide.body}</p>
                <Link href={guide.href} className="secondary-link mt-4 inline-flex">
                  Rehberi ac
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
            Bu yuzey bir kamu kurumu portali degil, sosyal hizmet anlayisiyla kurulan bir rehberlik
            projesidir
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            Sosyal Hak Rehberi resmi karar vermez. Amaci, test sonuclarini sade bir dille sunmak,
            kullaniciyi ilgili rehber iceriklere yonlendirmek ve ilk adimi daha anlasilir hale
            getirmektir.
          </p>
        </article>

        <aside className="card-panel">
          <h2 className="text-xl font-semibold text-slate-950">Daha fazla bilgi</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/hakkimizda" className="secondary-link">
              Hakkimizda sayfasini ac
            </Link>
            <Link href="/blog" className="secondary-link">
              Blog ve rehberleri gor
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
