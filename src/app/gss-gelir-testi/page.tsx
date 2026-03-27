import type { Metadata } from "next";
import { GssToolPageClient } from "./GssToolPageClient";

export const metadata: Metadata = {
  title: "GSS gelir testi uygunluk aracı",
  description:
    "GSS gelir testi için anlaşılır, kolay kullanımlı ve ön değerlendirme odaklı bir sayfa.",
  alternates: {
    canonical: "/gss-gelir-testi",
  },
};

export default function GssGelirTestiPage() {
  return <GssToolPageClient />;
}

