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
    "Sosyal hak testleri ve basvuru rehberleri icin guven odakli bir yol gosterici yuz. Resmi karar uretmez; on degerlendirme ve aciklayici rehberlik sunar.",
  applicationName: "Sosyal Hak Rehberi",
  keywords: [
    "sosyal hak testi",
    "sosyal yardim uygunluk testi",
    "evde bakim maasi",
    "evde bakim maasi hesaplama",
    "gss gelir testi",
    "65 yas ayligi uygunluk testi",
    "sosyal hak rehberi",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sosyal Hak Rehberi",
    description:
      "Sosyal hak testleri icin aciklayici, guven veren ve anlasilir bir yol gosterici deneyim.",
    type: "website",
    locale: "tr_TR",
    siteName: "Sosyal Hak Rehberi",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sosyal Hak Rehberi",
    description: "Sosyal hak testleri ve rehberleri icin guven odakli on degerlendirme deneyimi.",
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
                  Hakkimizda
                </Link>
                <Link href="/evde-bakim-maasi" className="secondary-link compact-link">
                  Evde Bakim
                </Link>
                <Link href="/dogum-yardimi-uygunluk-testi" className="secondary-link compact-link">
                  Dogum Yardimi
                </Link>
                <Link href="/evde-bakim-maasi/hesaplama" className="primary-link compact-link">
                  Testi Ac
                </Link>
              </nav>
            </div>
          </header>

          <div className="site-notice-wrap">
            <div className="site-notice" role="note" aria-label="Onemli site notu">
              Site su anda deneme asamasindadir. Tam kurulum tamamlanana kadar test
              sonuclarini dikkate almayin.
            </div>
          </div>

          {children}

          <footer className="mx-auto mt-10 w-full max-w-6xl px-6 pb-10 lg:px-10">
            <div className="footer-panel">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Guven Notu
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
                  Sosyal Hak Rehberi resmi kurum karari vermez. Buradaki sonuclar yalnizca on
                  degerlendirme niteligindedir ve degerlendirme sistemi uzerinden uretilen bilgiye
                  dayanir.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/" className="secondary-link compact-link">
                  Tum testler
                </Link>
                <Link href="/blog" className="secondary-link compact-link">
                  Blog
                </Link>
                <Link href="/hakkimizda" className="secondary-link compact-link">
                  Hakkimizda
                </Link>
                <Link href="/evde-bakim-maasi" className="secondary-link compact-link">
                  Evde Bakim rehberi
                </Link>
                <Link href="/dogum-yardimi-uygunluk-testi" className="secondary-link compact-link">
                  Dogum Yardimi sayfasi
                </Link>
                <Link href="/evde-bakim-maasi/hesaplama" className="secondary-link compact-link">
                  Evde Bakim testini ac
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
