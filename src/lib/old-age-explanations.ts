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
      title: "Yas kosulu sonucu etkiliyor",
      body: "Girilen yas bilgisi 65 yas ayligi on degerlendirmesinde temel kosullardan biridir.",
    },
  },
  {
    matcher: (code) => code.includes("income"),
    item: {
      title: "Gelir bilgisi sonucu etkiliyor",
      body: "Kendi geliriniz ve varsa es geliriniz birlikte degerlendirmeyi etkileyebilir.",
    },
  },
  {
    matcher: (code) => code.includes("social_security"),
    item: {
      title: "Sosyal guvence bilgisi sonucu etkiliyor",
      body: "Sosyal guvence durumunuz 65 yas ayligi icin on degerlendirme sonucunu degistirebilir.",
    },
  },
  {
    matcher: (code) => code.includes("pension"),
    item: {
      title: "Emekli ayligi bilgisi sonucu etkiliyor",
      body: "Halen emekli ayligi alip almadiginiz bu testte sonucu etkileyen bilgilerden biridir.",
    },
  },
];

const missingFactMap: Record<string, OldAgeExplanationItem> = {
  spouse_monthly_income: {
    title: "Es gelir bilgisini tamamlayin",
    body: "Eger esiniz varsa, aylik gelir bilgisini girmeniz daha guvenli bir on degerlendirme saglar.",
  },
  age: {
    title: "Yasinizi girin",
    body: "Yas bilgisi 65 yas ayligi icin temel kosullardan biridir.",
  },
  has_spouse: {
    title: "Esiniz olup olmadigini secin",
    body: "Es durumu gelir bilgisinin nasil yorumlanacagini etkileyebilir.",
  },
  has_social_security: {
    title: "Sosyal guvence durumunu secin",
    body: "Sosyal guvence bilgisi olmadan sistem eksik bilgi sonucu dondurebilir.",
  },
  receives_pension: {
    title: "Emekli ayligi durumunu secin",
    body: "Mevcut emekli ayligi bilgisi sonuc acisindan etkili olabilir.",
  },
};

const fallbackByStatus: Record<EligibilityStatus, OldAgeExplanationItem> = {
  ELIGIBLE: {
    title: "65 yas ayligi icin olumlu gorunuyor",
    body: "Mevcut bilgilerle backend motoru olumlu bir on degerlendirme dondurdu.",
  },
  NOT_ELIGIBLE: {
    title: "65 yas ayligi icin uygun gorunmuyor",
    body: "Mevcut bilgilerle backend motoru olumsuz bir on degerlendirme dondurdu.",
  },
  NEEDS_INFO: {
    title: "Karar icin ek bilgi gerekiyor",
    body: "Sistem guvenli bir on karar vermek icin ilave bilgi istiyor.",
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
      title: "Bir bilgiyi tamamlayin",
      body: fact.message || "Eksik gorunen bilgiyi netlestirdikten sonra yeniden deneyebilirsiniz.",
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
      title: "65 yas ayligi icin uygun gorunuyorsunuz",
      summary:
        "Backend motoru mevcut bilgilerle olumlu bir on degerlendirme dondurdu. Bu sonuc resmi karar yerine gecmez.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Simdi ne yapmali?",
      nextStepBody:
        "Yas, gelir ve sosyal guvence bilgilerinizi not edin. Basvuru oncesinde resmi kurumdan guncel yonlendirme almaniz faydali olur.",
      helperLinks: [
        { href: "/65-yas-ayligi-uygunluk-testi#form-start", label: "Bilgileri yeniden kontrol et" },
        { href: "/#hangi-testi-secmeliyim", label: "Diger testlere don" },
      ],
    };
  }

  if (status === "NEEDS_INFO") {
    return {
      title: "Daha fazla bilgi gerekli",
      summary:
        "Sistem mevcut bilgilerle guvenli bir on karar uretemedi. Eksik alanlari tamamlayip tekrar deneyebilirsiniz.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Simdi ne yapmali?",
      nextStepBody:
        "Ozellikle es durumu ve gelir bilgisi eksikse bunlari netlestirip ayni ekrandan yeniden on degerlendirme alin.",
      helperLinks: [
        { href: "/65-yas-ayligi-uygunluk-testi#form-start", label: "Eksik bilgileri tamamla" },
        { href: "/#hangi-testi-secmeliyim", label: "Diger testlere don" },
      ],
    };
  }

  return {
    title: "65 yas ayligi icin uygun gorunmuyorsunuz",
    summary:
      "Backend motoru girilen bilgilerle olumsuz bir on degerlendirme dondurdu. Bu sonuc resmi kurum karari yerine gecmez.",
    primaryReason: primaryReason ?? fallbackByStatus[status],
    secondaryReasons,
    missingInformation,
    nextStepTitle: "Simdi ne yapmali?",
    nextStepBody:
      "Girilen yas, gelir ve sosyal guvence bilgilerini yeniden kontrol edin. Varsa es gelirini de mutlaka dogru girin.",
    helperLinks: [
      { href: "/65-yas-ayligi-uygunluk-testi#form-start", label: "Bilgileri duzelterek tekrar dene" },
      { href: "/#hangi-testi-secmeliyim", label: "Diger testlere don" },
    ],
  };
}
