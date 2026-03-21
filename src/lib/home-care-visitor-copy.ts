import type { EligibilityStatus } from "@/lib/types";

const fieldLabelMap: Record<string, string> = {
  is_resident_in_tr: "Türkiye'de ikamet durumu",
  is_turkish_citizen: "Türk vatandaşlığı",
  has_valid_foreigner_identity_number: "Geçerli yabancı kimlik numarası",
  has_valid_residence_permit: "Geçerli oturma izni",
  has_valid_health_report: "Geçerli sağlık raporu",
  is_fully_dependent: "Tam bağımlılık durumu",
  care_recipient_disability_rate: "Sağlık raporu oranı",
  care_dependency_status: "Tam bağımlılık durumu",
  care_need_confirmed_by_board: "Heyet bakım raporu veya bakım ihtiyacı tespiti",
  caregiver_same_residence: "Bakım verenle aynı evde yaşama",
  household_size: "Hanedeki kişi sayısı",
  household_total_income: "Toplam hane geliri",
  has_additional_income_or_assets: "Ek gelir veya varlık etkileri",
};

const statusLabelMap: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Uygun görünüyor",
  NOT_ELIGIBLE: "Uygun görünmüyor",
  NEEDS_INFO: "Ek bilgi gerekli",
};

export function getHomeCareFieldLabel(field: string): string {
  return fieldLabelMap[field] ?? "İlgili bilgi alanı";
}

export function getHomeCareStatusLabel(status: EligibilityStatus): string {
  return statusLabelMap[status];
}

export function getHomeCareVisitorErrorMessage(
  message: string,
  status?: number,
): string {
  if (status === 422 || /request payload is invalid/i.test(message)) {
    return "Gönderilen bilgiler güncel değerlendirme kurallarına uymuyor. Lütfen alanları gözden geçirip yeniden deneyin.";
  }

  return message;
}

export function getHomeCareVisitorFieldMessages(
  field: string,
  messages: string[],
): string[] {
  return messages.map((message) => {
    if (/this fact is not allowed for the requested benefit/i.test(message)) {
      return `${getHomeCareFieldLabel(field)} şu anda bu ön değerlendirmede kullanılamıyor. Lütfen bilgileri gözden geçirip yeniden deneyin.`;
    }

    return message;
  });
}
