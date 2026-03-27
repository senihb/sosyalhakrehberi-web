import type { Metadata } from "next";
import { OldAgeToolPageClient } from "./OldAgeToolPageClient";

export const metadata: Metadata = {
  title: "65 yaş aylığı uygunluk testi",
  description:
    "65 yaş aylığı için daha büyük yazı, sade form ve anlaşılır ön değerlendirme sunan sayfa.",
  alternates: {
    canonical: "/65-yas-ayligi-uygunluk-testi",
  },
};

export default function OldAgeToolPage() {
  return <OldAgeToolPageClient />;
}

