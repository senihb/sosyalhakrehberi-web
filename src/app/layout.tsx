import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl, isProductionSite } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();
const allowIndexing = isProductionSite(siteUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Sosyal Hak Rehberi",
    template: "%s | Sosyal Hak Rehberi",
  },
  description:
    "Sosyal hak testleri ve başvuru rehberleri için güven odaklı bir yol gösterici yüz. Resmî karar üretmez; ön değerlendirme ve açıklayıcı rehberlik sunar.",
  applicationName: "Sosyal Hak Rehberi",
  keywords: [
    "sosyal hak testi",
    "sosyal yardım uygunluk testi",
    "evde bakım maaşı",
    "evde bakım maaşı hesaplama",
    "gss gelir testi",
    "65 yaş aylığı uygunluk testi",
    "sosyal hak rehberi",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sosyal Hak Rehberi",
    description:
      "Sosyal hak testleri için açıklayıcı, güven veren ve anlaşılır bir yol gösterici deneyim.",
    type: "website",
    locale: "tr_TR",
    siteName: "Sosyal Hak Rehberi",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sosyal Hak Rehberi",
    description: "Sosyal hak testleri ve rehberleri için güven odaklı ön değerlendirme deneyimi.",
  },
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
              <Link
                href="/"
                className="text-sm font-semibold tracking-[0.22em] text-slate-900 uppercase"
              >
                Sosyal Hak Rehberi
              </Link>
              <nav className="flex items-center gap-3 text-sm text-slate-700">
                <Link href="/" className="secondary-link compact-link">
                  Testler
                </Link>
                <Link href="/blog" className="secondary-link compact-link">
                  Blog
                </Link>
                <Link href="/hakkimizda" className="secondary-link compact-link">
                  Hakkımızda
                </Link>
                <Link href="/evde-bakim-maasi" className="secondary-link compact-link">
                  Evde Bakım
                </Link>
                <Link href="/dogum-yardimi-uygunluk-testi" className="secondary-link compact-link">
                  Doğum Yardımı
                </Link>
                <Link href="/start" className="primary-link compact-link">
                  Testi Aç
                </Link>
              </nav>
            </div>
          </header>

          <div className="site-notice-wrap">
            <div className="site-notice" role="note" aria-label="Önemli site notu">
              Site şu anda deneme aşamasındadır. Tam kurulum tamamlanana kadar test sonuçlarını
              dikkate almayın.
            </div>
          </div>

          {children}

          <footer className="mx-auto mt-10 w-full max-w-6xl px-6 pb-10 lg:px-10">
            <div className="footer-panel">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Güven Notu
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
                  Sosyal Hak Rehberi resmî kurum kararı vermez. Buradaki sonuçlar yalnızca ön
                  değerlendirme niteliğindedir ve değerlendirme sistemi üzerinden üretilen bilgiye
                  dayanır.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/" className="secondary-link compact-link">
                  Tüm testler
                </Link>
                <Link href="/blog" className="secondary-link compact-link">
                  Blog
                </Link>
                <Link href="/hakkimizda" className="secondary-link compact-link">
                  Hakkımızda
                </Link>
                <Link href="/evde-bakim-maasi" className="secondary-link compact-link">
                  Evde Bakım rehberi
                </Link>
                <Link href="/dogum-yardimi-uygunluk-testi" className="secondary-link compact-link">
                  Doğum Yardımı sayfası
                </Link>
                <Link href="/start" className="secondary-link compact-link">
                  Evde Bakım testini aç
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
