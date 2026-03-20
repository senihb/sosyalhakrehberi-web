import type { Metadata } from "next";
import { GssToolPageClient } from "./GssToolPageClient";

export const metadata: Metadata = {
  title: "GSS gelir testi uygunluk araci",
  description:
    "GSS gelir testi icin backend destekli, SEO uyumlu ve kullanimi kolay on degerlendirme araci.",
  alternates: {
    canonical: "/gss-gelir-testi",
  },
};

export default function GssGelirTestiPage() {
  return <GssToolPageClient />;
}
