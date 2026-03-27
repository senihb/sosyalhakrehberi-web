import type {
  DecisionReason,
  EligibilityStatus,
  MissingFact,
} from "@/lib/types";

export type ExplanationItem = {
  title: string;
  body: string;
};

export type GuidedLink = {
  href: string;
  label: string;
};

export type DecisionViewModel = {
  title: string;
  summary: string;
  primaryReason: ExplanationItem | null;
  secondaryReasons: ExplanationItem[];
  missingInformation: ExplanationItem[];
  nextStepTitle: string;
  nextStepBody: string;
  checklistTitle: string;
  checklistItems: string[];
  helperLinks: GuidedLink[];
};

type ReasonDescriptor = {
  matcher: (code: string) => boolean;
  item: ExplanationItem;
};

const knownReasonDescriptors: ReasonDescriptor[] = [
  {
    matcher: (code) => code.includes("citizen"),
    item: {
      title: "Vatandaşlık şartı",
      body: "Bu ön değerlendirme, Türkiye Cumhuriyeti vatandaşlık bilgisinin sonucu etkilediğini gösteriyor.",
    },
  },
  {
    matcher: (code) =>
      code.includes("resident") || code.includes("residency") || code.includes("ikamet"),
    item: {
      title: "İkamet şartı",
      body: "Bu ön değerlendirme, Türkiye'de ikamet bilgisinin sonucu etkilediğini gösteriyor.",
    },
  },
  {
    matcher: (code) =>
      code.includes("income") ||
      code.includes("gelir") ||
      code.includes("household_income"),
    item: {
      title: "Gelir bilgisi sonucu etkiliyor",
      body: "Hane gelirine ilişkin bilgi veya değerlendirme sonucu bu ön karar üzerinde etkili görünüyor.",
    },
  },
  {
    matcher: (code) =>
      code.includes("disability") ||
      code.includes("engel") ||
      code.includes("disability_rate"),
    item: {
      title: "Engellilik bilgisi sonucu etkiliyor",
      body: "Engellilik oranına ilişkin bilgi veya eşik değerlendirmesi bu ön karar üzerinde etkili görünüyor.",
    },
  },
  {
    matcher: (code) =>
      code.includes("household_size") ||
      code.includes("household") ||
      code.includes("hane"),
    item: {
      title: "Hane bilgisi sonucu etkiliyor",
      body: "Hanedeki kişi sayısına ilişkin bilgi bu ön karar üzerinde etkili görünüyor.",
    },
  },
];

const knownMissingFactMap: Record<string, ExplanationItem> = {
  is_turkish_citizen: {
    title: "Vatandaşlık bilgisini netleştirin",
    body: "Türkiye Cumhuriyeti vatandaşlık durumunu seçerseniz sistem daha güvenli bir ön değerlendirme üretebilir.",
  },
  is_resident_in_tr: {
    title: "İkamet bilgisini netleştirin",
    body: "Türkiye'de ikamet durumunu seçerseniz sistem eksik bilgi yerine daha net bir ön değerlendirme sunabilir.",
  },
  disability_rate: {
    title: "Engellilik oranını girin",
    body: "Engellilik oranı sonucu etkileyen temel bilgilerden biridir.",
  },
  household_income: {
    title: "Toplam hane gelirini girin",
    body: "Aylık toplam hane geliri sonucu etkileyen temel bilgilerden biridir.",
  },
  household_size: {
    title: "Hanedeki kişi sayısını girin",
    body: "Hanedeki kişi sayısı sonucu etkileyen temel bilgilerden biridir.",
  },
};

const fallbackReasonByStatus: Record<
  EligibilityStatus,
  { title: string; body: string }
> = {
  ELIGIBLE: {
    title: "Mevcut bilgiler olumlu görünüyor",
    body: "Paylaştığınız bilgilerle değerlendirme sistemi uygunluk yönünde bir ön değerlendirme üretti.",
  },
  NOT_ELIGIBLE: {
    title: "Mevcut bilgilerle uygun görünmüyor",
    body: "Paylaştığınız bilgilerle değerlendirme sistemi şu aşamada uygunluk yönünde bir sonuç üretmedi.",
  },
  NEEDS_INFO: {
    title: "Karar için daha fazla bilgi gerekiyor",
    body: "Paylaştığınız bilgiler karar üretmek için yeterli görünmüyor.",
  },
};

const checklistByStatus: Record<
  EligibilityStatus,
  { title: string; items: string[]; links: GuidedLink[] }
> = {
  ELIGIBLE: {
    title: "Başvuru öncesi hazırlık",
    items: [
      "Gelir ve hane bilgilerinizi başvuru öncesinde tekrar gözden geçirin.",
      "Bakım ihtiyacını destekleyen güncel bilgi ve belgeleri hazır tutun.",
      "Resmî başvuru öncesinde rehber sayfasındaki şartları son kez okuyun.",
    ],
    links: [
      {
        href: "/evde-bakim-maasi",
        label: "Başvuru rehberini incele",
      },
      {
        href: "/evde-bakim-maasi/hesaplama#form-start",
        label: "Bilgileri yeniden kontrol et",
      },
    ],
  },
  NOT_ELIGIBLE: {
    title: "Tekrar kontrol edilmesi iyi olur",
    items: [
      "Vatandaşlık ve ikamet seçimlerinizi doğru yaptığınızdan emin olun.",
      "Toplam hane geliri ve kişi sayısını güncel bilgilerle tekrar girin.",
      "Koşulları daha ayrıntılı okumak için rehber sayfasına dönün.",
    ],
    links: [
      {
        href: "/evde-bakim-maasi",
        label: "Şartları rehber sayfasında incele",
      },
      {
        href: "/evde-bakim-maasi/hesaplama#form-start",
        label: "Bilgileri düzelterek tekrar dene",
      },
    ],
  },
  NEEDS_INFO: {
    title: "Bilgileri tamamlayın",
    items: [
      "Eksik veya emin olmadığınız alanları netleştirin.",
      "Vatandaşlık ve ikamet bilgisini mümkünse kesin seçimle tamamlayın.",
      "Gelir ve hane bilgilerini girdikten sonra yeniden ön değerlendirme alın.",
    ],
    links: [
      {
        href: "/evde-bakim-maasi/hesaplama#form-start",
        label: "Eksik bilgileri tamamla",
      },
      {
        href: "/evde-bakim-maasi",
        label: "Hangi bilgilerin gerektiğini rehberde gör",
      },
    ],
  },
};

function normalizeCode(code: string): string {
  return code.trim().toLowerCase();
}

function mapReasonToExplanation(
  reason: DecisionReason,
  status: EligibilityStatus,
): ExplanationItem {
  const normalizedCode = normalizeCode(reason.code);
  const descriptor = knownReasonDescriptors.find(({ matcher }) => matcher(normalizedCode));

  if (descriptor) {
    return descriptor.item;
  }

  return fallbackReasonByStatus[status];
}

function mapMissingFactToExplanation(fact: MissingFact): ExplanationItem {
  return (
    knownMissingFactMap[fact.key] ?? {
      title: "Bir bilgiyi netleştirin",
      body: fact.message || "Eksik görünen bilgiyi tamamladıktan sonra yeniden deneyebilirsiniz.",
    }
  );
}

export function buildDecisionViewModel(input: {
  status: EligibilityStatus;
  reasons: DecisionReason[];
  missingFacts: MissingFact[];
}): DecisionViewModel {
  const { status, reasons, missingFacts } = input;
  const fallback = fallbackReasonByStatus[status];
  const mappedReasons = reasons.map((reason) => mapReasonToExplanation(reason, status));
  const [primaryReason, ...secondaryReasons] = mappedReasons;
  const missingInformation = missingFacts.map(mapMissingFactToExplanation);
  const checklist = checklistByStatus[status];

  if (status === "NEEDS_INFO") {
    return {
      title: "Daha fazla bilgi gerekli",
      summary:
        "Sistem, mevcut bilgilerle güvenli bir ön karar üretemedi. Eksik veya belirsiz alanları tamamlayarak tekrar deneyebilirsiniz.",
      primaryReason:
        primaryReason ?? {
          title: fallback.title,
          body: fallback.body,
        },
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Şimdi ne yapmalı?",
      nextStepBody:
        "Önce eksik görünen bilgileri tamamlayın. Sonrasında aynı ekrandan yeniden ön değerlendirme alarak sonucu netleştirebilirsiniz.",
      checklistTitle: checklist.title,
      checklistItems: checklist.items,
      helperLinks: checklist.links,
    };
  }

  if (status === "ELIGIBLE") {
    return {
      title: "Ön değerlendirme olumlu görünüyor",
      summary:
        "Değerlendirme sistemi mevcut bilgilerle uygunluk yönünde bir ön değerlendirme üretti. Bu sonuç resmî hak sahipliği kararı değildir.",
      primaryReason:
        primaryReason ?? {
          title: fallback.title,
          body: fallback.body,
        },
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Şimdi ne yapmalı?",
      nextStepBody:
        "Başvuru öncesinde gelir, hane ve bakım koşullarına ilişkin bilgilerinizi düzenli biçimde hazırlamanız faydalı olur.",
      checklistTitle: checklist.title,
      checklistItems: checklist.items,
      helperLinks: checklist.links,
    };
  }

  return {
    title: "Ön değerlendirme olumsuz görünüyor",
    summary:
      "Değerlendirme sistemi girilen bilgilerle uygunluk yönünde sonuç üretmedi. Nihai değerlendirme ilgili kurum incelemesiyle yapılır.",
    primaryReason:
      primaryReason ?? {
        title: fallback.title,
        body: fallback.body,
      },
    secondaryReasons,
    missingInformation,
    nextStepTitle: "Şimdi ne yapmalı?",
    nextStepBody:
      "Önce girilen temel bilgileri yeniden kontrol edin. Özellikle vatandaşlık, ikamet, gelir ve hane verilerindeki farklılıklar sonucu etkileyebilir.",
    checklistTitle: checklist.title,
    checklistItems: checklist.items,
    helperLinks: checklist.links,
  };
}

