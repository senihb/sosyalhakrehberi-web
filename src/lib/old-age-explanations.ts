import type { DecisionReason, EligibilityStatus, MissingFact } from "@/lib/types";

export type OldAgeExplanationItem = {
  title: string;
  body: string;
};

export type OldAgeLink = {
  href: string;
  label: string;
};

export type OldAgeDecisionViewModel = {
  title: string;
  summary: string;
  primaryReason: OldAgeExplanationItem | null;
  secondaryReasons: OldAgeExplanationItem[];
  missingInformation: OldAgeExplanationItem[];
  nextStepTitle: string;
  nextStepBody: string;
  helperLinks: OldAgeLink[];
};

const reasonMap: Array<{
  matcher: (code: string) => boolean;
  item: OldAgeExplanationItem;
}> = [
  {
    matcher: (code) => code.includes("age"),
    item: {
      title: "Yaş koşulu sonucu etkiliyor",
      body: "Girilen yaş bilgisi 65 yaş aylığı ön değerlendirmesinde temel koşullardan biridir.",
    },
  },
  {
    matcher: (code) => code.includes("income"),
    item: {
      title: "Gelir bilgisi sonucu etkiliyor",
      body: "Kendi geliriniz ve varsa eş geliriniz birlikte değerlendirmeyi etkileyebilir.",
    },
  },
  {
    matcher: (code) => code.includes("social_security"),
    item: {
      title: "Sosyal güvence bilgisi sonucu etkiliyor",
      body: "Sosyal güvence durumunuz 65 yaş aylığı için ön değerlendirme sonucunu değiştirebilir.",
    },
  },
  {
    matcher: (code) => code.includes("pension"),
    item: {
      title: "Emekli aylığı bilgisi sonucu etkiliyor",
      body: "Hâlen emekli aylığı alıp almadığınız bu testte sonucu etkileyen bilgilerden biridir.",
    },
  },
];

const missingFactMap: Record<string, OldAgeExplanationItem> = {
  spouse_monthly_income: {
    title: "Eş gelir bilgisini tamamlayın",
    body: "Eğer eşiniz varsa, aylık gelir bilgisini girmeniz daha güvenli bir ön değerlendirme sağlar.",
  },
  age: {
    title: "Yaşınızı girin",
    body: "Yaş bilgisi 65 yaş aylığı için temel koşullardan biridir.",
  },
  has_spouse: {
    title: "Eşiniz olup olmadığını seçin",
    body: "Eş durumu gelir bilgisinin nasıl yorumlanacağını etkileyebilir.",
  },
  has_social_security: {
    title: "Sosyal güvence durumunu seçin",
    body: "Sosyal güvence bilgisi olmadan sistem eksik bilgi sonucu döndürebilir.",
  },
  receives_pension: {
    title: "Emekli aylığı durumunu seçin",
    body: "Mevcut emekli aylığı bilgisi sonuç açısından etkili olabilir.",
  },
};

const fallbackByStatus: Record<EligibilityStatus, OldAgeExplanationItem> = {
  ELIGIBLE: {
    title: "65 yaş aylığı için olumlu görünüyor",
    body: "Mevcut bilgilerle değerlendirme sistemi olumlu bir ön değerlendirme döndürdü.",
  },
  NOT_ELIGIBLE: {
    title: "65 yaş aylığı için uygun görünmüyor",
    body: "Mevcut bilgilerle değerlendirme sistemi olumsuz bir ön değerlendirme döndürdü.",
  },
  NEEDS_INFO: {
    title: "Karar için ek bilgi gerekiyor",
    body: "Sistem güvenli bir ön karar vermek için ilave bilgi istiyor.",
  },
};

function normalizeCode(code: string): string {
  return code.trim().toLowerCase();
}

function mapReason(reason: DecisionReason, status: EligibilityStatus): OldAgeExplanationItem {
  const normalized = normalizeCode(reason.code);
  const matched = reasonMap.find((entry) => entry.matcher(normalized));

  return matched?.item ?? fallbackByStatus[status];
}

function mapMissingFact(fact: MissingFact): OldAgeExplanationItem {
  return (
    missingFactMap[fact.key] ?? {
      title: "Bir bilgiyi tamamlayın",
      body: fact.message || "Eksik görünen bilgiyi netleştirdikten sonra yeniden deneyebilirsiniz.",
    }
  );
}

export function buildOldAgeDecisionViewModel(input: {
  status: EligibilityStatus;
  reasons: DecisionReason[];
  missingFacts: MissingFact[];
}): OldAgeDecisionViewModel {
  const { status, reasons, missingFacts } = input;
  const mappedReasons = reasons.map((reason) => mapReason(reason, status));
  const [primaryReason, ...secondaryReasons] = mappedReasons;
  const missingInformation = missingFacts.map(mapMissingFact);

  if (status === "ELIGIBLE") {
    return {
      title: "65 yaş aylığı için uygun görünüyorsunuz",
      summary:
        "Değerlendirme sistemi mevcut bilgilerle olumlu bir ön değerlendirme döndürdü. Bu sonuç resmî karar yerine geçmez.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Şimdi ne yapmalı?",
      nextStepBody:
        "Yaş, gelir ve sosyal güvence bilgilerinizi not edin. Başvuru öncesinde resmî kurumdan güncel yönlendirme almanız faydalı olur.",
      helperLinks: [
        { href: "/65-yas-ayligi-uygunluk-testi#form-start", label: "Bilgileri yeniden kontrol et" },
        { href: "/#hangi-testi-secmeliyim", label: "Diğer testlere dön" },
      ],
    };
  }

  if (status === "NEEDS_INFO") {
    return {
      title: "Daha fazla bilgi gerekli",
      summary:
        "Sistem mevcut bilgilerle güvenli bir ön karar üretemedi. Eksik alanları tamamlayıp tekrar deneyebilirsiniz.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Şimdi ne yapmalı?",
      nextStepBody:
        "Özellikle eş durumu ve gelir bilgisi eksikse bunları netleştirip aynı ekrandan yeniden ön değerlendirme alın.",
      helperLinks: [
        { href: "/65-yas-ayligi-uygunluk-testi#form-start", label: "Eksik bilgileri tamamla" },
        { href: "/#hangi-testi-secmeliyim", label: "Diğer testlere dön" },
      ],
    };
  }

  return {
    title: "65 yaş aylığı için uygun görünmüyorsunuz",
    summary:
      "Değerlendirme sistemi girilen bilgilerle olumsuz bir ön değerlendirme döndürdü. Bu sonuç resmî kurum kararı yerine geçmez.",
    primaryReason: primaryReason ?? fallbackByStatus[status],
    secondaryReasons,
    missingInformation,
    nextStepTitle: "Şimdi ne yapmalı?",
    nextStepBody:
      "Girilen yaş, gelir ve sosyal güvence bilgilerini yeniden kontrol edin. Varsa eş gelirini de mutlaka doğru girin.",
    helperLinks: [
      { href: "/65-yas-ayligi-uygunluk-testi#form-start", label: "Bilgileri düzelterek tekrar dene" },
      { href: "/#hangi-testi-secmeliyim", label: "Diğer testlere dön" },
    ],
  };
}

