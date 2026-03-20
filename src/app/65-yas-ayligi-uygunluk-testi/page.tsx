import type { Metadata } from "next";
import { OldAgeToolPageClient } from "./OldAgeToolPageClient";

export const metadata: Metadata = {
  title: "65 yas ayligi uygunluk testi",
  description:
    "65 yas ayligi icin daha buyuk yazi, sade form ve backend destekli on degerlendirme sunan public tool page.",
  alternates: {
    canonical: "/65-yas-ayligi-uygunluk-testi",
  },
};

export default function OldAgeToolPage() {
  return <OldAgeToolPageClient />;
}
