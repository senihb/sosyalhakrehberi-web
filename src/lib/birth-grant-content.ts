export type BirthGrantFaqItem = {
  question: string;
  answer: string;
};

export type BirthGrantGuideSection = {
  title: string;
  body: string;
};

export type BirthGrantActionPageModel = {
  title: string;
  summary: string;
  steps: string[];
  note: string;
};

export type BirthGrantPageInfoBlock = {
  title: string;
  body: string;
};

export type BirthGrantScenarioItem = {
  title: string;
  body: string;
};

export const birthGrantGuideIntro = {
  title: "Doğum yardımı rehberi",
  summary:
    "Bu rehber, doğum yardımı testinden önce veya sonra temel başvuru yolunu gözden geçirmek için hazırlanmıştır. Resmi karar vermez; yalnızca başvuru öncesi yön gösterir.",
};

export const birthGrantGuideSections: BirthGrantGuideSection[] = [
  {
    title: "Bu test neyi anlamanıza yardım eder?",
    body:
      "Bu akış, başvurunun ilk bakışta açık görünüp görünmediğini, hangi bilgi nedeniyle durduğunu ve hangi başvuru yoluna bakmanız gerektiğini anlamanıza yardım eder.",
  },
  {
    title: "Bu testte hangi bilgiler sorulur?",
    body:
      "Canlı doğum bilgisi, doğum tarihi, çocuğun sırası, vatandaşlık, ikamet, KPS kaydı ve çocuğun başvuru anındaki durumu sorulur.",
  },
  {
    title: "Sonuç ekranı nasıl okunmalı?",
    body:
      "Olumlu görünen sonuç resmi onay değildir. Olumsuz veya eksik bilgi sonucu ise hangi bilginin etkili olduğunu gösterir. Son adımda resmi başvuru yolunu ayrıca kontrol etmek gerekir.",
  },
  {
    title: "Başvuru öncesi hangi bilgiler faydalıdır?",
    body:
      "Doğum tarihi, KPS kaydı, vatandaşlık ve ikamet bilgileri ne kadar netse başvuru yolunu anlamak o kadar kolay olur.",
  },
];

export const birthGrantPageInfoBlocks: BirthGrantPageInfoBlock[] = [
  {
    title: "Bu test ne yapar?",
    body:
      "Doğum yardımı için ön değerlendirme sunar. Sonucun hangi bilgiye dayandığını ve bundan sonra hangi yolu izlemeniz gerektiğini sade biçimde gösterir.",
  },
  {
    title: "Bu test ne yapmaz?",
    body:
      "Resmi karar vermez. Ödeme garantisi vermez. Kurum incelemesinin yerine geçmez.",
  },
  {
    title: "Hangi bilgiler gerekir?",
    body:
      "Doğum tarihi, çocuğun sırası, vatandaşlık, ikamet, KPS kaydı ve çocuğun başvuru anındaki durumu gibi temel bilgiler gerekir.",
  },
];

export const birthGrantScenarioItems: BirthGrantScenarioItem[] = [
  {
    title: "Bilgileri tam olan başvuru sahibi",
    body:
      "Canlı doğum, doğum tarihi ve KPS kaydı net ise sistem başvuru yolunu daha açık gösterebilir.",
  },
  {
    title: "Bazı bilgileri emin olmayan kullanıcı",
    body:
      "Emin olmadığınız sorularda 'Emin değilim' seçeneğini kullanabilirsiniz. Bu durumda sonuç ekranı genellikle hangi bilgiyi tamamlamanız gerektiğini anlatır.",
  },
  {
    title: "Özel durum veya ek belge ihtimali",
    body:
      "Bazı başvurularda ek belge, özel inceleme veya farklı başvuru kanalı gerekebilir. Bu durumda sonuç ekranındaki notlara ve rehber bağlantılarına bakmak gerekir.",
  },
];

export const birthGrantFaqItems: BirthGrantFaqItem[] = [
  {
    question: "Doğum yardımı gelir testine bağlı mı?",
    answer:
      "Hayır. Bu hakta temel eksen gelir değil; doğum, çocuk sırası, vatandaşlık, ikamet ve kayıt bilgileridir.",
  },
  {
    question: "Olumlu sonuç alırsam ödeme kesinleşmiş olur mu?",
    answer:
      "Hayır. Sonuç ekranı yalnızca ön değerlendirme sunar. Resmi başvuru ve kurum incelemesi devam eder.",
  },
  {
    question: "KPS kaydı neden önemlidir?",
    answer:
      "KPS kaydı, doğum bilgisinin nüfus sisteminde göründüğünü anlatır. Başvuru yolunu anlamak için önemli bilgilerden biridir.",
  },
  {
    question: "Emin olmadığım sorularda ne yapmalıyım?",
    answer:
      "Emin değilseniz ilgili seçeneği işaretleyebilirsiniz. Sistem sizi cezalandırmaz; bunun yerine hangi bilgiyi tamamlamanız gerektiğini gösterebilir.",
  },
];

export const birthGrantEdevletGuide: BirthGrantActionPageModel = {
  title: "e-Devlet doğum yardımı başvurusu",
  summary:
    "Bu sayfa, e-Devlet üzerinden başvuru düşünen kişiler için kısa bir hazırlık özeti sunar. Resmi ekranların görünümü zamanla değişebilir.",
  steps: [
    "Kimlik ve iletişim bilgilerinizin güncel olduğundan emin olun.",
    "Doğum bilgisi ve KPS kaydı görünüyorsa e-Devlet içinde ilgili hizmeti arayın.",
    "Başvuru ekranındaki bilgileri dikkatle kontrol ederek işlemi tamamlayın.",
  ],
  note:
    "e-Devlet ekranında farklı bir açıklama görürseniz güncel resmi ekrandaki yönlendirmeyi esas alın.",
};

export const birthGrantPaymentCalendarGuide: BirthGrantActionPageModel = {
  title: "Doğum yardımı ödeme takvimi",
  summary:
    "Bu sayfa, olumlu ön değerlendirme sonrasında ödemenin nasıl takip edilebileceğini sade biçimde açıklar.",
  steps: [
    "Önce başvurunun alındığından emin olun.",
    "Ödeme durumu için e-Devlet veya ilgili kurum duyurularını takip edin.",
    "Ödeme günü ve aktarım bilgisi için resmi kaynaktaki güncel açıklamayı esas alın.",
  ],
  note:
    "Ödeme günü kurum yoğunluğu ve resmi işlem sırasına göre değişebilir. Bu sayfa yalnızca yön gösterir.",
};

