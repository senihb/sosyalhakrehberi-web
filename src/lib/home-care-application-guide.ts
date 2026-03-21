export type HomeCareApplicationGuideStep = {
  title: string;
  body: string;
};

export type HomeCareApplicationGuideSection = {
  title: string;
  items: string[];
};

export type HomeCareApplicationGuideModel = {
  title: string;
  intro: string;
  institutionNote: string;
  caution: string;
  steps: HomeCareApplicationGuideStep[];
  documents: HomeCareApplicationGuideSection[];
};

export const homeCareApplicationGuide: HomeCareApplicationGuideModel = {
  title: "Evde bakım maaşı için başvuru hazırlık rehberi",
  intro:
    "Bu sayfa ön değerlendirme sonucundan sonra hangi kuruma nasıl hazırlanarak gitmeniz gerektiğini sade bir dille özetler. Nihai belge listesi il veya ilçe uygulamasına göre değişebilir.",
  institutionNote:
    "Başvuru süreci çoğunlukla Aile ve Sosyal Hizmetler il müdürlüğü, sosyal hizmet merkezi veya sizi yönlendiren resmî sosyal hizmet birimi üzerinden yürür. Gitmeden önce bulunduğunuz yerdeki güncel başvuru kanalını telefonla teyit etmeniz güvenlidir.",
  caution:
    "Bu ekran resmî karar vermez ve tam belge otomasyonu sunmaz. Belgeleri toplamadan önce resmî kanaldan güncel listeyi doğrulayın.",
  steps: [
    {
      title: "1. Başvuru kanalını teyit edin",
      body: "İlinizde veya ilçenizde hangi müdürlük ya da sosyal hizmet merkezinin başvuru aldığını öğrenin. Telefonla teyit etmek boş yönlendirme riskini azaltır.",
    },
    {
      title: "2. Bakım ihtiyacını destekleyen belgeleri toparlayın",
      body: "Sağlık kurulu raporu, bakım ihtiyacı tespiti ve varsa heyet teyidi gibi belgeleri güncel hâliyle hazırlayın.",
    },
    {
      title: "3. Hane ve gelir bilgisini dosyalayın",
      body: "Hanede yaşayan kişi bilgisi, gelir kaynakları ve istenebilecek destekleyici evraklar hazır olursa inceleme daha hızlı ilerler.",
    },
    {
      title: "4. Başvuru öncesi son kontrol yapın",
      body: "İkamet, vatandaşlık veya yabancı kimlik yolu, bakım verenle aynı evde yaşama durumu ve gelir bilgilerinizi tekrar gözden geçirin.",
    },
  ],
  documents: [
    {
      title: "Kimlik ve ikamet",
      items: [
        "T.C. kimlik kartı veya geçerli yabancı kimlik bilgileri",
        "İkamet durumunu destekleyen güncel kayıt veya adres bilgisi",
      ],
    },
    {
      title: "Sağlık ve bakım ihtiyacı",
      items: [
        "Sağlık kurulu raporu ve rapordaki oran bilgisi",
        "Bakım ihtiyacı tespiti veya heyet bakım raporu",
        "Bakım verenle aynı evde yaşamaya ilişkin destekleyici bilgi",
      ],
    },
    {
      title: "Hane ve gelir",
      items: [
        "Hanede yaşayan kişi sayısını destekleyen bilgiler",
        "Toplam hane gelirini açıklayan maaş, destek veya diğer gelir kayıtları",
        "İstenirse ek gelir veya varlık etkilerine ilişkin açıklayıcı belgeler",
      ],
    },
  ],
};
