import type {
  BirthGrantBenefitDetails,
  DecisionReason,
  EligibilityMetadata,
  EligibilityStatus,
  GuidanceItem,
  MissingFact,
} from "@/lib/types";

export type BirthGrantExplanationItem = {
  title: string;
  body: string;
};

export type BirthGrantDecisionViewModel = {
  title: string;
  summary: string;
  primaryReason: BirthGrantExplanationItem | null;
  secondaryReasons: BirthGrantExplanationItem[];
  missingInformation: BirthGrantExplanationItem[];
  specialReviewNotes: BirthGrantExplanationItem[];
  paymentSummary: string | null;
  paymentDetail: string | null;
  nextStepTitle: string;
  nextStepBody: string;
  applicationPathHint: string | null;
  helperLinks: GuidanceItem[];
  trustNote: string;
};

const defaultTrustNote =
  "Bu sonuç ön değerlendirme niteliğindedir; nihai değerlendirme ilgili kurumun incelemesine göre belirlenir.";

const reasonMap: Record<string, BirthGrantExplanationItem> = {
  LIVE_BIRTH_REQUIRED: {
    title: "Başvuru canlı doğumdan sonra değerlendirilir",
    body: "Doğum yardımı için anlamlı ön değerlendirme, canlı doğum bilgisi netleştikten sonra yapılabilir.",
  },
  BIRTH_DATE_OUT_OF_RANGE: {
    title: "Doğum tarihi yeniden kontrol edilmeli",
    body: "Doğum tarihi bu yardımın kapsama dönemini etkileyebilir.",
  },
  CITIZENSHIP_REQUIREMENT_NOT_MET: {
    title: "Vatandaşlık bilgisi sonucu etkiliyor",
    body: "Başvuruyu yapacak kişinin vatandaşlık bilgisi olumlu görünmediğinde sonuç değişebilir.",
  },
  PARENT_CITIZENSHIP_REQUIREMENT_NOT_MET: {
    title: "Ebeveyn bilgisi yeniden kontrol edilmeli",
    body: "Anne veya baba bilgisindeki eksiklik ya da uyumsuzluk başvuru yolunu etkileyebilir.",
  },
  RESIDENCY_REQUIREMENT_NOT_MET: {
    title: "İkamet bilgisi sonucu etkiliyor",
    body: "Başvuru yapan kişi ve çocuk için ikamet bilgisi ön değerlendirmede dikkate alınır.",
  },
  KPS_REGISTRATION_REQUIRED: {
    title: "KPS kaydı tamamlanmalı",
    body: "Doğum bilgisinin nüfus sisteminde görünmesi başvuru yolunu netleştirmeye yardımcı olur.",
  },
  CHILD_STATUS_NOT_ELIGIBLE: {
    title: "Çocuğun durumu yeniden kontrol edilmeli",
    body: "Başvuru anındaki çocuk durumu netleşmeden güvenli sonuç üretilemez.",
  },
};

const missingFactMap: Record<string, BirthGrantExplanationItem> = {
  child_is_live_birth: {
    title: "Doğum bilgisini netleştirin",
    body: "Canlı doğum gerçekleşti mi sorusu bu testin ilk ayrımıdır.",
  },
  child_birth_date: {
    title: "Doğum tarihini ekleyin",
    body: "Doğum tarihi başvuru akışını ve ödeme profilini anlamak için gerekir.",
  },
  child_is_kps_registered: {
    title: "KPS kaydını kontrol edin",
    body: "KPS kaydı olmadan başvuru yolu netleşmeyebilir.",
  },
  child_is_alive: {
    title: "Çocuğun mevcut durumunu seçin",
    body: "Başvuru anındaki çocuk durumu olmadan güvenli sonuç üretilemez.",
  },
  applicant_is_turkish_citizen: {
    title: "Vatandaşlık bilgisini seçin",
    body: "Başvuruyu yapacak kişi için vatandaşlık bilgisi gerekir.",
  },
  applicant_resides_in_tr: {
    title: "İkamet bilgisini seçin",
    body: "Başvuru yapan kişi için Türkiye'de ikamet bilgisi gerekir.",
  },
  child_resides_in_tr: {
    title: "Çocuğun ikamet bilgisini seçin",
    body: "Çocuk için Türkiye'de ikamet bilgisi gerekir.",
  },
  previous_live_children_count: {
    title: "Kaçıncı çocuk olduğunu seçin",
    body: "Ödeme profili çocuk sırasına göre değişebilir.",
  },
};

function mapReason(reason: DecisionReason, status: EligibilityStatus): BirthGrantExplanationItem {
  return (
    reasonMap[reason.code] ?? {
      title:
        status === "ELIGIBLE"
          ? "Ön değerlendirme olumlu görünüyor"
          : status === "NEEDS_INFO"
            ? "Biraz daha bilgi gerekli"
            : "Ön değerlendirme olumsuz görünüyor",
      body: reason.message,
    }
  );
}

function mapMissingFact(fact: MissingFact): BirthGrantExplanationItem {
  return (
    missingFactMap[fact.key] ?? {
      title: "Bir bilgiyi tamamlayın",
      body: fact.message || "Eksik bilgiyi netleştirip testi yeniden deneyin.",
    }
  );
}

function formatMoney(amount: number | null | undefined): string | null {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return null;
  }

  return `${new Intl.NumberFormat("tr-TR").format(amount)} TL`;
}

function buildPaymentSummary(benefitDetails?: BirthGrantBenefitDetails | null): {
  paymentSummary: string | null;
  paymentDetail: string | null;
} {
  if (!benefitDetails) {
    return {
      paymentSummary: null,
      paymentDetail: null,
    };
  }

  if (benefitDetails.payment_type === "ONE_TIME") {
    return {
      paymentSummary: `${formatMoney(benefitDetails.payment_amount)} tek sefer`,
      paymentDetail: "İlk çocuk için destek tek seferlik ödeme profiline yakın görünüyor.",
    };
  }

  const paymentAmount = formatMoney(benefitDetails.payment_amount);
  const totalAmount = formatMoney(benefitDetails.total_estimated_amount);
  const remainingMonths =
    typeof benefitDetails.remaining_months === "number"
      ? `${benefitDetails.remaining_months} ay`
      : null;

  return {
    paymentSummary: paymentAmount ? `${paymentAmount} / ay` : null,
    paymentDetail:
      [remainingMonths, totalAmount ? `tahmini toplam ${totalAmount}` : null]
        .filter(Boolean)
        .join(" · ") || null,
  };
}

function buildSpecialReviewNotes(reasons: DecisionReason[]): BirthGrantExplanationItem[] {
  return reasons
    .filter((reason) => String(reason.severity).toUpperCase() === "WARNING")
    .map((reason) => ({
      title: "Ek belge veya inceleme gerekebilir",
      body: reason.message,
    }));
}

export function buildBirthGrantDecisionViewModel(input: {
  status: EligibilityStatus;
  reasons: DecisionReason[];
  missingFacts: MissingFact[];
  guidanceItems?: GuidanceItem[];
  benefitDetails?: BirthGrantBenefitDetails | null;
  metadata?: EligibilityMetadata;
  userMessage?: string | null;
  disclaimer?: string | null;
}): BirthGrantDecisionViewModel {
  const mappedReasons = input.reasons
    .filter((reason) => String(reason.severity).toUpperCase() !== "WARNING")
    .map((reason) => mapReason(reason, input.status));
  const [primaryReason, ...secondaryReasons] = mappedReasons;
  const missingInformation = input.missingFacts.map(mapMissingFact);
  const payment = buildPaymentSummary(input.benefitDetails);
  const applicationPathHint = input.metadata?.application_guidance?.description ?? null;
  const specialReviewNotes = buildSpecialReviewNotes(input.reasons);

  if (input.status === "ELIGIBLE") {
    return {
      title: "Başvurabilirsiniz gibi görünüyor",
      summary:
        input.userMessage ??
        "Mevcut bilgilerle başvuru yolu açık görünüyor. Yine de resmi inceleme ve belge kontrolü devam eder.",
      primaryReason: primaryReason ?? null,
      secondaryReasons,
      missingInformation,
      specialReviewNotes,
      paymentSummary: payment.paymentSummary,
      paymentDetail: payment.paymentDetail,
      nextStepTitle: "Şimdi ne yapmalısınız?",
      nextStepBody:
        applicationPathHint ??
        "Başvuru kanalını kontrol edin ve resmi başvuru öncesinde doğum kaydı ile temel bilgilerinizi yeniden doğrulayın.",
      applicationPathHint,
      helperLinks: input.guidanceItems ?? [],
      trustNote: input.disclaimer ?? defaultTrustNote,
    };
  }

  if (input.status === "NEEDS_INFO") {
    return {
      title: "Biraz daha bilgi gerekli",
      summary:
        input.userMessage ??
        "Sistem güvenli bir ön değerlendirme üretmek için ek bilgi istiyor. Eksik alanları tamamlayıp tekrar deneyebilirsiniz.",
      primaryReason: primaryReason ?? null,
      secondaryReasons,
      missingInformation,
      specialReviewNotes,
      paymentSummary: payment.paymentSummary,
      paymentDetail: payment.paymentDetail,
      nextStepTitle: "Şimdi ne yapmalısınız?",
      nextStepBody:
        "Özellikle doğum tarihi, KPS kaydı ve çocuk sırası net değilse bunları tamamlayıp aynı sayfada yeniden deneyin.",
      applicationPathHint,
      helperLinks: input.guidanceItems ?? [],
      trustNote: input.disclaimer ?? defaultTrustNote,
    };
  }

  return {
    title: "Şu anda uygun görünmüyor",
    summary:
      input.userMessage ??
      "Mevcut bilgilerle başvuru yolu açık görünmüyor. Yine de resmi rehberi inceleyip bilgilerinizi tekrar kontrol edebilirsiniz.",
    primaryReason: primaryReason ?? null,
    secondaryReasons,
    missingInformation,
    specialReviewNotes,
    paymentSummary: payment.paymentSummary,
    paymentDetail: payment.paymentDetail,
    nextStepTitle: "Şimdi ne yapmalısınız?",
    nextStepBody:
      applicationPathHint ??
      "Vatandaşlık, ikamet veya canlı doğum bilgilerini yeniden kontrol edin. Emin olmadığınız durumda resmi rehber üzerinden başvuru koşullarını okuyun.",
    applicationPathHint,
    helperLinks: input.guidanceItems ?? [],
    trustNote: input.disclaimer ?? defaultTrustNote,
  };
}

