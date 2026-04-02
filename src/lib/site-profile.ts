export type ContactChannelKind = "instagram" | "email" | "whatsapp" | "linkedin";

export type ContactChannel = {
  kind: ContactChannelKind;
  label: string;
  href: string;
  value: string;
  note: string;
};

export type SiteProfile = {
  siteName: string;
  tagline: string;
  mission: string;
  founderName: string;
  founderRole: string;
  founderSummary: string;
  professionalSummary: string;
  expertise: string[];
  education: string[];
  certificates: string[];
  contactChannels: ContactChannel[];
  trustPoints: string[];
};

export const siteProfile: SiteProfile = {
  siteName: "Sosyal Hak Rehberi",
  tagline: "Dijital Sosyal Hak Rehberi",
  mission:
    "Sosyal haklara erişimi sade, anlaşılır ve güvenilir bir rehberlik deneyimine dönüştürmek.",
  founderName: "Senih Bayankulu",
  founderRole: "Bireysel Sosyal Hizmet Danışmanı",
  founderSummary:
    "Engelli, yaşlı ve kronik hastalara sosyal haklar, SGK işlemleri, sağlık raporu ve itiraz süreçlerinde danışmanlık sunan; evrak takibi, raporlama ve danışan iletişimi tarafında deneyim sahibi bir uzman.",
  professionalSummary:
    "Adalet, kamu yönetimi, iktisat ve sosyal hizmet çizgisini birleştiren; sosyal hak başlıklarını dijital ortamda daha anlaşılır hale getirmeye odaklanan profesyonel rehberlik yaklaşımı.",
  expertise: [
    "UYAP ve e-Devlet süreçleri",
    "Evrak ve dosya takibi",
    "Sosyal hak bilgisi",
    "SGK ve sağlık raporu süreçleri",
    "Müzakere ve danışan iletişimi",
    "Analitik düşünme ve raporlama",
  ],
  education: [
    "Dokuz Eylül Üniversitesi - Adalet MYO",
    "Manisa Celal Bayar Üniversitesi - Kamu Yönetimi",
    "İzmir Demokrasi Üniversitesi - İktisat Yüksek Lisans",
    "Atatürk Üniversitesi - Sosyal Hizmetler Lisans (devam ediyor)",
  ],
  certificates: [
    "Sorumlu Emlak Danışmanı (Seviye 5) - MYK",
    "ISO 9001:2015 Kalite Yönetim Sistemi İç Denetçi Sertifikası",
    "Eğitim Koçluğu Sertifikası",
    "İŞKUR İş Kulübü Katılım Sertifikası",
  ],
  contactChannels: [
    {
      kind: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/sosyalhizmet.danismanligi/",
      value: "@sosyalhizmet.danismanligi",
      note: "Kısa duyurular ve güncel yönlendirmeler için.",
    },
    {
      kind: "email",
      label: "E-posta",
      href: "mailto:info@sosyalhizmetdanismani.com",
      value: "info@sosyalhizmetdanismani.com",
      note: "Detaylı başvuru ve bilgi talepleri için.",
    },
    {
      kind: "whatsapp",
      label: "WhatsApp",
      href: "https://wa.me/905451413294",
      value: "+90 545 141 32 94",
      note: "Hızlı iletişim ve kısa ön yönlendirme için.",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/senih25/",
      value: "senih25",
      note: "Profesyonel geçmiş ve deneyim özeti için.",
    },
  ],
  trustPoints: [
    "Site resmî kurum değildir; ön değerlendirme ve rehberlik sunar.",
    "Gereksiz kişisel veri istemeden, sade ve anlaşılır bir akış hedefler.",
    "Kararlar açıklanabilir biçimde gösterilir; sonuçlar kaynak ve gerekçe ile desteklenir.",
  ],
};
