export type WorkStreamKey = "frontend" | "backend" | "admin";

export type WorkStream = {
  key: WorkStreamKey;
  title: string;
  summary: string;
  responsibilities: string[];
  output: string;
};

export const siteOperations: {
  mission: string;
  vision: string;
  trafficModel: string[];
  publishingRules: string[];
  workStreams: WorkStream[];
} = {
  mission:
    "Önce trafik, sonra veri, sonra satış modelini koruyarak sosyal hak bilgisini anlaşılır ve güven veren bir ürüne dönüştürmek.",
  vision:
    "Sosyal hak rehberini tekil içerik değil, ölçülebilir bir bilgi ve yönlendirme sistemi haline getirmek.",
  trafficModel: [
    "Google'da aranan konuları net, kısa ve yanıt veren sayfalara dönüştürürüz.",
    "Kullanıcıya ilk ekranda açıklık, güven ve sonraki adım veririz.",
    "Öğrenilen davranışı veri olarak tutar, tekrar gelen kullanıcı için akışı sadeleştiririz.",
  ],
  publishingRules: [
    "Her sayfa net bir arama niyetine cevap vermeli.",
    "İlk paragraf kısa cevap, ikinci bölüm açıklama, son bölüm aksiyon olmalı.",
    "Aşırı iddia yok; kaynak, gerekçe ve sınır açık olmalı.",
    "Yeni konu yeni proje değil, kontrollü ve ölçeklenebilir içerik bileşeni olmalı.",
  ],
  workStreams: [
    {
      key: "frontend",
      title: "Frontend",
      summary: "Ziyaretçinin ilk gördüğü deneyim, SEO görünürlüğü ve rehber akışı.",
      responsibilities: [
        "Ana sayfa, rehber sayfaları ve sonuç ekranlarının sade tasarımı",
        "SEO başlıkları, metadata ve okunabilirlik standardı",
        "Hızlı yönlendirme, güven notu ve aksiyon butonları",
      ],
      output: "Dönüşüm odaklı, okunaklı ve güven veren kullanıcı yüzeyi",
    },
    {
      key: "backend",
      title: "Backend",
      summary: "Karar mantığı, veri modeli, doğrulama ve yayın güveni.",
      responsibilities: [
        "Hak kuralları, veri şemaları ve karar açıklaması",
        "Kaynak, onay ve analytics kayıtlarının yapısal tutulması",
        "Tekrarlanabilir ve test edilebilir üretim akışı",
      ],
      output: "Deterministik, denetlenebilir ve yeniden kullanılabilir veri çekirdeği",
    },
    {
      key: "admin",
      title: "Admin",
      summary: "İçerik paylaşımı, sayfa düzeni, onay ve yayın kontrolü.",
      responsibilities: [
        "İçerik taslağı oluşturma ve düzenleme",
        "Sayfa düzeni, CTA ve trust notu güncelleme",
        "Yayın öncesi onay ve içerik kuyruğu yönetimi",
      ],
      output: "Düşük maliyetli ama kontrollü bir içerik yönetim yüzeyi",
    },
  ],
};
