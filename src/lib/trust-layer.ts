import type { EligibilityMetadata, EligibilityStatus } from "@/lib/types";

export type TrustItem = {
  title: string;
  body: string;
};

export type TrustLink = {
  href: string;
  label: string;
};

export type TrustLayerModel = {
  heading: string;
  items: TrustItem[];
  links: TrustLink[];
};

export function buildTrustLayerModel(input: {
  status: EligibilityStatus;
  metadata: EligibilityMetadata;
}): TrustLayerModel {
  const { metadata } = input;
  const policyVersion = metadata.policy_version || "Belirtilmedi";
  const evaluationDate = metadata.evaluation_date ?? "Belirtilmedi";

  return {
    heading: "Bu sonuç nasıl okunmalı?",
    items: [
      {
        title: "Bu bir ön değerlendirmedir",
        body: "Bu ekrandaki sonuç resmî kurum kararı yerine geçmez. Nihai değerlendirme ilgili kurum incelemesiyle yapılır.",
      },
      {
        title: "Karar kuralları ayrı değerlendirilir",
        body: "Bu sayfa yalnızca sonucu sunar. Eşikler, kurallar ve değerlendirmenin anlamı ayrı sistemde yönetilir.",
      },
      {
        title: "Gereksiz kişisel veri istenmez",
        body: "Bu akışta kimlik numarası, açık adres veya belge yükleme istenmez. Yalnızca temel ön değerlendirme bilgileri kullanılır.",
      },
      {
        title: "Değerlendirme bağlamı kayıtlıdır",
        body: `Bu sonuç değerlendirme sürümü ${policyVersion} ve değerlendirme tarihi ${evaluationDate} ile üretilmiştir.`,
      },
    ],
    links: [
      {
        href: "/evde-bakim-maasi",
        label: "Evde bakım maaşı rehberini aç",
      },
      {
        href: "/evde-bakim-maasi/hesaplama#form-start",
        label: "Bilgileri yeniden gözden geçir",
      },
    ],
  };
}
