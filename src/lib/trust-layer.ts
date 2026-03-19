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
        body: "Bu ekrandaki sonuç resmi kurum kararı yerine geçmez. Nihai değerlendirme ilgili kurum incelemesiyle yapılır.",
      },
      {
        title: "Karar mantığı backend tarafındadır",
        body: "Frontend yalnızca sonucu sunar. Eşikler, policy kuralları ve değerlendirme semantiği backend motorunda yönetilir.",
      },
      {
        title: "Gereksiz kişisel veri istenmez",
        body: "Bu akışta kimlik numarası, açık adres veya belge yükleme istenmez. Yalnızca temel ön değerlendirme bilgileri kullanılır.",
      },
      {
        title: "Policy bağlamı kayıtlıdır",
        body: `Bu sonuç backend tarafında policy sürümü ${policyVersion} ve değerlendirme tarihi ${evaluationDate} ile üretilmiştir.`,
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
