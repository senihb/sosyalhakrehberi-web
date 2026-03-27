import type { DecisionReason, EligibilityStatus, MissingFact } from "@/lib/types";

export type GssExplanationItem = {
  title: string;
  body: string;
};

export type GssLink = {
  href: string;
  label: string;
};

export type GssDecisionViewModel = {
  title: string;
  summary: string;
  primaryReason: GssExplanationItem | null;
  secondaryReasons: GssExplanationItem[];
  missingInformation: GssExplanationItem[];
  nextStepTitle: string;
  nextStepBody: string;
  helperLinks: GssLink[];
};

const reasonMap: Array<{
  matcher: (code: string) => boolean;
  item: GssExplanationItem;
}> = [
  {
    matcher: (code) => code.includes("active_insurance"),
    item: {
      title: "Aktif sigorta durumu sonucu etkiliyor",
      body: "Aktif sigortanız varsa GSS gelir testi ihtiyacı farklı değerlendirilebilir.",
    },
  },
  {
    matcher: (code) => code.includes("social_security"),
    item: {
      title: "Sosyal güvence bilgisi sonucu etkiliyor",
      body: "Sosyal güvence durumunuz GSS gelir testi gerekip gerekmediğini etkileyebilir.",
    },
  },
  {
    matcher: (code) => code.includes("dependent"),
    item: {
      title: "Bakmakla yükümlülük durumu sonucu etkiliyor",
      body: "Bir yakın üzerinden kapsamdaysanız GSS gelir testi ihtiyacı farklı olabilir.",
    },
  },
  {
    matcher: (code) => code.includes("income"),
    item: {
      title: "Gelir bilgisi sonucu etkiliyor",
      body: "Girilen gelir bilgisi GSS gelir testi ön değerlendirmesinde belirleyici görünüyor.",
    },
  },
  {
    matcher: (code) => code.includes("household"),
    item: {
      title: "Hane bilgisi sonucu etkiliyor",
      body: "Hanedeki kişi sayısı ve toplam gelir birlikte değerlendirmeyi etkileyebilir.",
    },
  },
];

const missingFactMap: Record<string, GssExplanationItem> = {
  has_social_security: {
    title: "Sosyal güvence bilginizi netleştirin",
    body: "Sosyal güvenceniz olup olmadığını seçerseniz sistem daha net bir ön değerlendirme sunabilir.",
  },
  has_active_insurance: {
    title: "Aktif sigorta durumunu seçin",
    body: "Aktif sigorta bilgisi GSS gelir testi ihtiyacını doğrudan etkileyebilir.",
  },
  is_covered_as_dependent: {
    title: "Yakın üzerinden kapsam durumunu seçin",
    body: "Bir yakın üzerinden sağlık güvencesi kapsamındaysanız sonucu etkileyebilir.",
  },
  gross_household_income: {
    title: "Toplam hane gelirini girin",
    body: "Brüt toplam hane geliri GSS gelir testinde sorulan temel bilgilerden biridir.",
  },
  household_size: {
    title: "Hanedeki kişi sayısını girin",
    body: "Hanedeki kişi sayısı gelir bilgisinin yorumlanmasında kullanılır.",
  },
};

const fallbackByStatus: Record<EligibilityStatus, GssExplanationItem> = {
  ELIGIBLE: {
    title: "GSS gelir testi açısından olumlu görünüyor",
    body: "Mevcut bilgilerle değerlendirme sistemi GSS gelir testi için olumlu bir ön değerlendirme döndürdü.",
  },
  NOT_ELIGIBLE: {
    title: "GSS gelir testi açısından farklı bir durum görünüyor",
    body: "Mevcut bilgilerle değerlendirme sistemi GSS gelir testi için olumsuz bir ön değerlendirme döndürdü.",
  },
  NEEDS_INFO: {
    title: "Daha fazla bilgi gerekli",
    body: "Sistem güvenli bir ön karar için ek bilgiye ihtiyaç duyuyor.",
  },
};

function normalizeCode(code: string): string {
  return code.trim().toLowerCase();
}

function mapReason(reason: DecisionReason, status: EligibilityStatus): GssExplanationItem {
  const normalized = normalizeCode(reason.code);
  const matched = reasonMap.find((entry) => entry.matcher(normalized));

  return matched?.item ?? fallbackByStatus[status];
}

function mapMissingFact(fact: MissingFact): GssExplanationItem {
  return (
    missingFactMap[fact.key] ?? {
      title: "Bir bilgiyi tamamlayın",
      body: fact.message || "Eksik görünen bilgiyi netleştirdikten sonra yeniden deneyebilirsiniz.",
    }
  );
}

export function buildGssDecisionViewModel(input: {
  status: EligibilityStatus;
  reasons: DecisionReason[];
  missingFacts: MissingFact[];
}): GssDecisionViewModel {
  const { status, reasons, missingFacts } = input;
  const mappedReasons = reasons.map((reason) => mapReason(reason, status));
  const [primaryReason, ...secondaryReasons] = mappedReasons;
  const missingInformation = missingFacts.map(mapMissingFact);

  if (status === "ELIGIBLE") {
    return {
      title: "GSS gelir testi için uygun görünüyorsunuz",
      summary:
        "Değerlendirme sistemi mevcut bilgilerle olumlu bir ön değerlendirme üretti. Bu sonuç resmî karar yerine geçmez.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Şimdi ne yapmalı?",
      nextStepBody:
        "Sosyal güvence ve gelir bilginizi not edin, sonra başvuru veya bilgi alma sürecinde resmî kurum yönlendirmesini takip edin.",
      helperLinks: [
        { href: "/gss-gelir-testi#form-start", label: "Bilgileri yeniden kontrol et" },
        { href: "/#hangi-testi-secmeliyim", label: "Diğer testlere dön" },
      ],
    };
  }

  if (status === "NEEDS_INFO") {
    return {
      title: "Karar için ek bilgi gerekli",
      summary:
        "Sistem, mevcut bilgilerle güvenli bir GSS gelir testi sonucu üretemedi. Eksik veya emin olmadığınız alanları tamamlayın.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Şimdi ne yapmalı?",
      nextStepBody:
        "Sosyal güvence, aktif sigorta ve yakın üzerinden kapsam sorularını netleştirip aynı ekrandan tekrar deneyin.",
      helperLinks: [
        { href: "/gss-gelir-testi#form-start", label: "Eksik bilgileri tamamla" },
        { href: "/#hangi-testi-secmeliyim", label: "Diğer testlere dön" },
      ],
    };
  }

  return {
    title: "GSS gelir testi için uygun görünmüyorsunuz",
    summary:
      "Değerlendirme sistemi girilen bilgilerle olumsuz bir ön değerlendirme döndürdü. Bu sonuç resmî kurum kararı yerine geçmez.",
    primaryReason: primaryReason ?? fallbackByStatus[status],
    secondaryReasons,
    missingInformation,
    nextStepTitle: "Şimdi ne yapmalı?",
    nextStepBody:
      "Girilen bilgileri yeniden kontrol edin. Özellikle aktif sigorta, sosyal güvence ve yakın üzerinden kapsam durumu sonucu değiştirebilir.",
    helperLinks: [
      { href: "/gss-gelir-testi#form-start", label: "Bilgileri düzelterek tekrar dene" },
      { href: "/#hangi-testi-secmeliyim", label: "Diğer testlere dön" },
    ],
  };
}

