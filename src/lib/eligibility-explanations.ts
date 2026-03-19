import type {
  DecisionReason,
  EligibilityStatus,
  MissingFact,
} from "@/lib/types";

export type ExplanationItem = {
  title: string;
  body: string;
};

export type DecisionViewModel = {
  title: string;
  summary: string;
  primaryReason: ExplanationItem | null;
  secondaryReasons: ExplanationItem[];
  missingInformation: ExplanationItem[];
  nextStepTitle: string;
  nextStepBody: string;
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
    body: "Paylaştığınız bilgilerle backend motoru uygunluk yönünde bir ön değerlendirme üretti.",
  },
  NOT_ELIGIBLE: {
    title: "Mevcut bilgilerle uygun görünmüyor",
    body: "Paylaştığınız bilgilerle backend motoru şu aşamada uygunluk yönünde bir sonuç üretmedi.",
  },
  NEEDS_INFO: {
    title: "Karar için daha fazla bilgi gerekiyor",
    body: "Paylaştığınız bilgiler karar üretmek için yeterli görünmüyor.",
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
      nextStepTitle: "Sonraki adım",
      nextStepBody:
        "Eksik görünen alanları tamamlayın. Özellikle vatandaşlık, ikamet, gelir ve hane bilgilerini netleştirmek sonucu iyileştirebilir.",
    };
  }

  if (status === "ELIGIBLE") {
    return {
      title: "Ön değerlendirme olumlu görünüyor",
      summary:
        "Backend motoru mevcut bilgilerle uygunluk yönünde bir ön değerlendirme üretti. Bu sonuç resmi hak sahipliği kararı değildir.",
      primaryReason:
        primaryReason ?? {
          title: fallback.title,
          body: fallback.body,
        },
      secondaryReasons,
      missingInformation,
      nextStepTitle: "Sonraki adım",
      nextStepBody:
        "Başvuru öncesinde gelir, hane ve bakım koşullarına ilişkin bilgilerinizi düzenli biçimde hazırlamanız faydalı olur.",
    };
  }

  return {
    title: "Ön değerlendirme olumsuz görünüyor",
    summary:
      "Backend motoru girilen bilgilerle uygunluk yönünde sonuç üretmedi. Nihai değerlendirme ilgili kurum incelemesiyle yapılır.",
    primaryReason:
      primaryReason ?? {
        title: fallback.title,
        body: fallback.body,
      },
    secondaryReasons,
    missingInformation,
    nextStepTitle: "Sonraki adım",
    nextStepBody:
      "Girilen bilgileri tekrar kontrol edin. Özellikle vatandaşlık, ikamet, gelir ve hane bilgilerini doğru girdiğinizden emin olun.",
  };
}
