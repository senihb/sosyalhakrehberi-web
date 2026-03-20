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
      body: "Aktif sigortaniz varsa GSS gelir testi ihtiyaci farkli degerlendirilebilir.",
    },
  },
  {
    matcher: (code) => code.includes("social_security"),
    item: {
      title: "Sosyal guvence bilgisi sonucu etkiliyor",
      body: "Sosyal guvence durumunuz GSS gelir testi gerekip gerekmedigini etkileyebilir.",
    },
  },
  {
    matcher: (code) => code.includes("dependent"),
    item: {
      title: "Bakmakla yukumluluk durumu sonucu etkiliyor",
      body: "Bir yakin uzerinden kapsamdaysaniz GSS gelir testi ihtiyaci farkli olabilir.",
    },
  },
  {
    matcher: (code) => code.includes("income"),
    item: {
      title: "Gelir bilgisi sonucu etkiliyor",
      body: "Girilen gelir bilgisi GSS gelir testi on degerlendirmesinde belirleyici gorunuyor.",
    },
  },
  {
    matcher: (code) => code.includes("household"),
    item: {
      title: "Hane bilgisi sonucu etkiliyor",
      body: "Hanedeki kisi sayisi ve toplam gelir birlikte degerlendirmeyi etkileyebilir.",
    },
  },
];

const missingFactMap: Record<string, GssExplanationItem> = {
  has_social_security: {
    title: "Sosyal guvence bilginizi netlestirin",
    body: "Sosyal guvenceniz olup olmadigini secerseniz sistem daha net bir on degerlendirme sunabilir.",
  },
  has_active_insurance: {
    title: "Aktif sigorta durumunu secin",
    body: "Aktif sigorta bilgisi GSS gelir testi ihtiyacini dogrudan etkileyebilir.",
  },
  is_covered_as_dependent: {
    title: "Yakin uzerinden kapsam durumunu secin",
    body: "Bir yakin uzerinden saglik guvencesi kapsamindaysaniz sonucu etkileyebilir.",
  },
  gross_household_income: {
    title: "Toplam hane gelirini girin",
    body: "Brut toplam hane geliri GSS gelir testinde sorulan temel bilgilerden biridir.",
  },
  household_size: {
    title: "Hanedeki kisi sayisini girin",
    body: "Hanedeki kisi sayisi gelir bilgisinin yorumlanmasinda kullanilir.",
  },
};

const fallbackByStatus: Record<EligibilityStatus, GssExplanationItem> = {
  ELIGIBLE: {
    title: "GSS gelir testi acisindan olumlu gorunuyor",
    body: "Mevcut bilgilerle backend motoru GSS gelir testi icin olumlu bir on degerlendirme dondurdu.",
  },
  NOT_ELIGIBLE: {
    title: "GSS gelir testi acisindan farkli bir durum gorunuyor",
    body: "Mevcut bilgilerle backend motoru GSS gelir testi icin olumsuz bir on degerlendirme dondurdu.",
  },
  NEEDS_INFO: {
    title: "Daha fazla bilgi gerekli",
    body: "Sistem guvenli bir on karar icin ek bilgiye ihtiyac duyuyor.",
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
      title: "Bir bilgiyi tamamlayin",
      body: fact.message || "Eksik gorunen bilgiyi netlestirdikten sonra yeniden deneyebilirsiniz.",
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
      title: "GSS gelir testi icin uygun gorunuyorsunuz",
      summary:
        "Backend motoru mevcut bilgilerle olumlu bir on degerlendirme uretti. Bu sonuc resmi karar yerine gecmez.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Simdi ne yapmali?",
      nextStepBody:
        "Sosyal guvence ve gelir bilginizi not edin, sonra basvuru veya bilgi alma surecinde resmi kurum yonlendirmesini takip edin.",
      helperLinks: [
        { href: "/gss-gelir-testi#form-start", label: "Bilgileri yeniden kontrol et" },
        { href: "/#hangi-testi-secmeliyim", label: "Diger testlere don" },
      ],
    };
  }

  if (status === "NEEDS_INFO") {
    return {
      title: "Karar icin ek bilgi gerekli",
      summary:
        "Sistem, mevcut bilgilerle guvenli bir GSS gelir testi sonucu uretemedi. Eksik veya emin olmadiginiz alanlari tamamlayin.",
      primaryReason: primaryReason ?? fallbackByStatus[status],
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Simdi ne yapmali?",
      nextStepBody:
        "Sosyal guvence, aktif sigorta ve yakin uzerinden kapsam sorularini netlestirip ayni ekrandan tekrar deneyin.",
      helperLinks: [
        { href: "/gss-gelir-testi#form-start", label: "Eksik bilgileri tamamla" },
        { href: "/#hangi-testi-secmeliyim", label: "Diger testlere don" },
      ],
    };
  }

  return {
    title: "GSS gelir testi icin uygun gorunmuyorsunuz",
    summary:
      "Backend motoru girilen bilgilerle olumsuz bir on degerlendirme dondurdu. Bu sonuc resmi kurum karari yerine gecmez.",
    primaryReason: primaryReason ?? fallbackByStatus[status],
    secondaryReasons,
    missingInformation,
    nextStepTitle: "Simdi ne yapmali?",
    nextStepBody:
      "Girilen bilgileri yeniden kontrol edin. Ozellikle aktif sigorta, sosyal guvence ve yakin uzerinden kapsam durumu sonucu degistirebilir.",
    helperLinks: [
      { href: "/gss-gelir-testi#form-start", label: "Bilgileri duzelterek tekrar dene" },
      { href: "/#hangi-testi-secmeliyim", label: "Diger testlere don" },
    ],
  };
}
