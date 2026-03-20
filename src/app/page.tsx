import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sosyal hak uygunluk testleri ve basvuru rehberleri",
  description:
    "Sosyal Hak Rehberi, SocialRightOS backend karar motorunu kullanan anlasilir on degerlendirme araclari ve basvuru oncesi rehberleri sunar.",
  alternates: {
    canonical: "/",
  },
};

const toolCards = [
  {
    title: "GSS Gelir Testi",
    body:
      "Genel Saglik Sigortasi kapsaminda gelir testiyle ilgili on degerlendirme akisini tek sayfada acmayi hedefliyoruz.",
    href: "#hangi-testi-secmeliyim",
    cta: "Yakinda",
    status: "Hazirlaniyor",
  },
  {
    title: "Evde Bakim Maası Uygunluk Testi",
    body:
      "Stabilized Home Care flow burada referans urun katmani olarak yer alir. Form, backend destekli sonuc ve rehberlik ayni hatta calisir.",
    href: "/evde-bakim-maasi/hesaplama",
    cta: "Teste git",
    status: "Kullanima acik",
  },
  {
    title: "65 Yas Ayligi Uygunluk Testi",
    body:
      "Yasli kullanicilar icin sade sorularla ilerleyen, on degerlendirme odakli yeni tool sayfasi sonraki adimda acilacak.",
    href: "#hangi-testi-secmeliyim",
    cta: "Yakinda",
    status: "Hazirlaniyor",
  },
];

const chooserItems = [
  {
    title: "Saglik primleri ve gelir testi sorulariniz varsa",
    body:
      "GSS Gelir Testi, sosyal guvence ve gelir testi baglamini netlestirmek isteyen kullanicilar icin dogru baslangic olacak.",
  },
  {
    title: "Agir engelli yakin bakimi icin destek ariyorsaniz",
    body:
      "Evde Bakim Maasi Uygunluk Testi su anda canli ve kullanima hazir tek tool. En hizli aktif akisimizi bu sayfadan baslatabilirsiniz.",
  },
  {
    title: "Ileri yas destekleriyle ilgili hizli bir yon lazimsa",
    body:
      "65 Yas Ayligi testini acarken dili daha buyuk, sorulari daha az ve akisi daha sakin bir deneyim olarak kuracagiz.",
  },
];

const trustNotes = [
  "Bu sitedeki sonuclar on degerlendirme niteligindedir; resmi karar yerine gecmez.",
  "Frontend kendi eligibility mantigini uretmez; karar semantikleri backend tarafinda kalir.",
  "Gereksiz kisisel veri istemiyoruz. Kimlik numarasi, acik adres ve belge yukleme bu asamada yok.",
];

const guideLinks = [
  {
    href: "/evde-bakim-maasi",
    title: "Evde Bakim Maasi ana rehberi",
    body:
      "Hesaplamaya gecmeden once hangi bilgilerin gerekli oldugunu, sonuc ekraninin ne anlattigini ve bu aracın sinirlarini ozetler.",
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
      "Gelir sorularinin neden istendigini ve gelir kapisinin neden yalnizca guidance olarak kullanildigini anlatir.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="hero-shell">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Public Tool Layer</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Sosyal hak testlerini tek giriste acin, sonucunuzu alin, sonraki adimi gorun
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Sosyal Hak Rehberi tanitim sayfasi gibi degil, urun gibi calisir. Kullaniciyi
              dogrudan uygun teste tasir, backend destekli on degerlendirme sonucunu gosterir ve
              ilgili rehberlere yonlendirir.
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
              <p>
                Bu site resmi kurum karari vermez. On degerlendirme sonucu ve rehberli yonlendirme
                sunar.
              </p>
              <p>
                Mevcut canli Home Care flow bu urun katmaninin referans desenidir ve aynen
                korunmustur.
              </p>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Bugun ne yapabilirsiniz?</p>
                <p className="mt-2">
                  Mevcut canli tool ile Evde Bakim Maasi on degerlendirmesini hemen baslatabilir,
                  sartlar ve gelir rehberlerine tek ekrandan ulasabilirsiniz.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-4 lg:px-10 lg:py-6">
        <div className="grid gap-5 lg:grid-cols-3">
          {toolCards.map((tool) => (
            <article key={tool.title} className="tool-card">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-950">{tool.title}</h2>
                <span className="tool-status">{tool.status}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{tool.body}</p>
              <Link
                href={tool.href}
                className={tool.status === "Kullanima acik" ? "primary-link mt-6" : "secondary-link mt-6"}
              >
                {tool.cta}
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
            Once sorununuzu secin, sonra en kisa yoldan ilgili araca gecin
          </h2>
          <div className="mt-5 grid gap-4">
            {chooserItems.map((item) => (
              <article key={item.title} className="rounded-2xl bg-slate-50 px-5 py-4">
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p>
              </article>
            ))}
          </div>
        </article>

        <aside className="card-panel">
          <h2 className="text-xl font-semibold text-slate-950">Tek tikla canli araca gidin</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Su anda kullanima acik testimiz Evde Bakim Maasi aracidir. Diger iki tool ayni urun
            diliyle ayrica acilacak.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <Link href="/evde-bakim-maasi/hesaplama" className="primary-link">
              Evde Bakim Maasi testini baslat
            </Link>
            <Link href="/evde-bakim-maasi" className="secondary-link">
              Once ana rehberi oku
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
          <div className="mt-5 grid gap-4 md:grid-cols-3">
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
    </main>
  );
}
