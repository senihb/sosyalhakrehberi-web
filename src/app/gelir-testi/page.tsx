import type { Metadata } from "next";
import { IncomeTestPageClient } from "./IncomeTestPageClient";

export const metadata: Metadata = {
  title: "Gelir testi değerlendirme aracı",
  description:
    "Hane kişi sayısı ve toplam gelir ile sade bir gelir değerlendirmesi sunan açıklayıcı test sayfası.",
  alternates: {
    canonical: "/gelir-testi",
  },
};

export default function GelirTestiPage() {
  return <IncomeTestPageClient />;
}

