export type MethodologySection = {
  title: string;
  body: string[];
};

export type MethodologyLink = {
  href: string;
  label: string;
};

export type MethodologyContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  sections: MethodologySection[];
  links: MethodologyLink[];
  disclaimer: string;
};

export const homeCareMethodologyContent: MethodologyContent = {
  eyebrow: "Yöntem ve Sınırlar",
  title: "Evde bakım maaşı ön değerlendirmesi nasıl çalışır?",
  subtitle:
    "Bu sayfa aracın ne yaptığını, neyi yapmadığını ve sonucun neden ön değerlendirme niteliğinde olduğunu açıklar.",
  sections: [
    {
      title: "Bu araç ne yapar?",
      body: [
        "Hesaplama akışında girdiğiniz temel gelir, hane ve bakım ihtiyacı bilgilerini toplar.",
        "Sonucu ve açıklama alanlarını SocialRightOS değerlendirme motorundan alır.",
        "Durum, gerekçeler, eksik bilgiler ve varsa kural ayrıntılarını ekranda anlaşılır biçimde sunar.",
      ],
    },
    {
      title: "Bu araç neyi bilemez?",
      body: [
        "Resmî kayıtları doğrudan göremez.",
        "Belge doğrulaması yapmaz.",
        "Girilmeyen veya eksik bırakılan bilgileri kendisi tamamlamaz.",
      ],
    },
    {
      title: "Sonuç neden ön değerlendirmedir?",
      body: [
        "Nihai uygunluk kararı ilgili kurumun belge incelemesi ve güncel uygulamasıyla verilir.",
        "Gelir, hane yapısı veya bakım ihtiyacı değişirse sonuç da değişebilir.",
      ],
    },
    {
      title: "Kaynağın sahibi kim?",
      body: [
        "Kurallar ve açıklamalar backend tarafında üretilir.",
        "Frontend yalnızca backend çıktısını gösterir; uygunluk hesabını kendi başına yapmaz.",
      ],
    },
  ],
  links: [
    {
      href: "/evde-bakim-maasi/hesaplama",
      label: "Hesaplama aracına dön",
    },
    {
      href: "/evde-bakim-maasi",
      label: "Evde bakım maaşı rehberini aç",
    },
  ],
  disclaimer:
    "Bu araç resmî karar vermez. Sonuçlar ön değerlendirme niteliğindedir ve mutlaka resmî kanallardan doğrulanmalıdır.",
};
