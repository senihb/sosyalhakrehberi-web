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

export const birthGrantGuideIntro = {
  title: "Doğum yardımı rehberi",
  summary:
    "Bu rehber, doğum yardımı testinden önce veya sonra temel başvuru mantığını hızlıca gözden geçirmek için hazırlanmıştır. Resmî karar vermez; yalnızca başvuru öncesi yön gösterir.",
};

export const birthGrantGuideSections: BirthGrantGuideSection[] = [
  {
    title: "Kimler için anlamlı bir başlangıç sunar?",
    body:
      "Canlı doğum, çocuk sırası, vatandaşlık, ikamet ve KPS kaydı gibi temel bilgiler doğum yardımı ön değerlendirmesinin ana başlıklarını oluşturur.",
  },
  {
    title: "Testte hangi bilgiler sorulur?",
    body:
      "Canlı doğum durumu, doğum tarihi, çocuğun kaçıncı çocuk olduğu, başvuru sahibinin vatandaşlık ve ikamet bilgisi ile KPS kaydı bu akışta kullanılır.",
  },
  {
    title: "Sonuç ekranı nasıl okunmalı?",
    body:
      "Olumlu sonuç resmî onay anlamına gelmez. Olumsuz veya eksik sonuçlarda ise hangi bilgi veya koşulun sonucu etkilediğine odaklanmak gerekir.",
  },
  {
    title: "Başvuru öncesi ne hazırlıklı olmalı?",
    body:
      "Doğum tarihi, KPS kaydı, vatandaşlık ve ikamet bilgilerinin güncel ve tutarlı olması başvuru kanalını daha net anlamaya yardımcı olur.",
  },
];

export const birthGrantFaqItems: BirthGrantFaqItem[] = [
  {
    question: "Doğum yardımı gelir testine bağlı mı?",
    answer:
      "Hayır. Bu hak için temel eksen gelir değil; doğum, çocuk sırası, vatandaşlık, ikamet ve kayıt bilgileridir.",
  },
  {
    question: "Olumlu sonuç alırsam ödeme kesinleşmiş olur mu?",
    answer:
      "Hayır. Sonuç ekranı yalnızca ön değerlendirme sunar. Resmî başvuru ve kurum kontrolü devam eder.",
  },
  {
    question: "KPS kaydı neden önemli?",
    answer:
      "KPS kaydı, doğum bilgisinin nüfus sisteminde görünmesini anlatır. Başvuru kanalı ve kayıt kontrolü için önemli başlıklardan biridir.",
  },
  {
    question: "Emin olmadığım sorularda ne yapmalıyım?",
    answer:
      "Bilmiyorum seçeneğini kullanabilirsiniz. Bu durumda sistem sonucu eksik bilgi olarak değerlendirebilir.",
  },
];

export const birthGrantEdevletGuide: BirthGrantActionPageModel = {
  title: "e-Devlet doğum yardımı başvurusu",
  summary:
    "Bu sayfa, e-Devlet üzerinden başvuru düşünen kişiler için kısa bir hazırlık özeti sunar. Resmî ekranların görünümü değişebilir.",
  steps: [
    "Önce kimlik ve iletişim bilgilerinizin güncel olduğundan emin olun.",
    "Doğum bilgisi ve KPS kaydı görünüyorsa e-Devlet üzerinden ilgili hizmeti arayın.",
    "Başvuru ekranında istenen temel bilgileri kontrol ederek işlemi tamamlayın.",
  ],
  note:
    "e-Devlet ekranında farklı bir yönlendirme görürseniz güncel resmî ekrandaki açıklamayı esas alın.",
};

export const birthGrantPaymentCalendarGuide: BirthGrantActionPageModel = {
  title: "Doğum yardımı ödeme takvimi",
  summary:
    "Bu sayfa, olumlu ön değerlendirme sonrası ödemenin ne zaman ve nasıl takip edilebileceğini sade biçimde açıklar.",
  steps: [
    "Önce başvurunun alındığından emin olun.",
    "Ödeme durumu için e-Devlet veya ilgili kurum duyurularını takip edin.",
    "Ödeme günü ve aktarım bilgisi için resmî kaynaktaki güncel açıklamayı esas alın.",
  ],
  note:
    "Ödeme günü kurum yoğunluğu ve resmî işlem sırasına göre değişebilir. Bu sayfa yalnızca yön gösterir.",
};
