import { siteProfile } from "@/lib/site-profile";
import type {
  ApprovalRegistryEntry,
  ContentRegistryEntry,
  SourceRegistryEntry,
} from "@/lib/admin-types";

export const contentRegistry: ContentRegistryEntry[] = [
  {
    id: "content-homepage",
    slug: "homepage",
    section: "homepage",
    title: "Ana sayfa",
    body: "Dijital Sosyal Hak Rehberi konumlandırması, test seçimi ve hızlı yönlendirme akışı.",
    seo_title: "Dijital Sosyal Hak Rehberi",
    seo_description:
      "Sosyal hak testlerine ve rehberlere hızlı ulaşmak için sade, güven veren ve açıklayıcı bir başlangıç sayfası.",
    canonical_path: "/",
    status: "published",
    updated_at: "2026-04-02",
  },
  {
    id: "content-about",
    slug: "hakkimizda",
    section: "about",
    title: "Hakkımızda sayfası",
    body: `${siteProfile.founderName} için profesyonel geçmiş, uzmanlık ve iletişim kanallarını sade biçimde toplar.`,
    seo_title: "Hakkımızda | Sosyal Hak Rehberi",
    seo_description:
      "Projenin amacı, güven yaklaşımı, profesyonel geçmiş ve doğrudan iletişim kanalları.",
    canonical_path: "/hakkimizda",
    status: "published",
    updated_at: "2026-04-02",
  },
  {
    id: "content-methodology",
    slug: "methodology",
    section: "methodology",
    title: "Yöntem ve sınırlar",
    body: "Ön değerlendirme akışının ne yaptığı, neyi yapmadığı ve güven sınırları.",
    seo_title: "Yöntem ve Sınırlar | Sosyal Hak Rehberi",
    seo_description:
      "Ön değerlendirme motorunun nasıl çalıştığını ve sonuçların neden resmi karar olmadığını açıklar.",
    canonical_path: "/methodology",
    status: "published",
    updated_at: "2026-04-02",
  },
  {
    id: "content-blog",
    slug: "blog",
    section: "blog",
    title: "Blog ve rehberler",
    body: "Test sonrası yönlendirme, kaynaklı içerik ve sosyal hak açıklamaları.",
    seo_title: "Blog ve Rehberler | Sosyal Hak Rehberi",
    seo_description:
      "Sosyal hak testlerinden sonra okunabilecek rehberler, açıklamalar ve sonraki adım içerikleri.",
    canonical_path: "/blog",
    status: "published",
    updated_at: "2026-04-02",
  },
  {
    id: "content-home-care",
    slug: "evde-bakim-maasi",
    section: "tool",
    title: "Evde bakım maaşı",
    body: "Ön değerlendirme, şartlar ve başvuru rehberi için ana sayfa.",
    seo_title: "Evde Bakım Maaşı | Sosyal Hak Rehberi",
    seo_description:
      "Evde bakım maaşı için ön değerlendirme, rehber ve sonuç açıklamaları tek yerde.",
    canonical_path: "/evde-bakim-maasi",
    status: "published",
    updated_at: "2026-04-02",
  },
  {
    id: "content-gss",
    slug: "gss-gelir-testi",
    section: "tool",
    title: "GSS gelir testi",
    body: "Sağlık güvencesi ve gelir testi için hızlı yol.",
    seo_title: "GSS Gelir Testi | Sosyal Hak Rehberi",
    seo_description:
      "GSS gelir testi için ön değerlendirme ve rehber yönlendirmesi.",
    canonical_path: "/gss-gelir-testi",
    status: "published",
    updated_at: "2026-04-02",
  },
  {
    id: "content-old-age",
    slug: "65-yas-ayligi-uygunluk-testi",
    section: "tool",
    title: "65 yaş aylığı",
    body: "Daha büyük yazı ve sade akış ile uygunluk testi.",
    seo_title: "65 Yaş Aylığı Uygunluk Testi | Sosyal Hak Rehberi",
    seo_description:
      "65 yaş aylığı için uygunluk testi, rehber ve sonraki adım yönlendirmesi.",
    canonical_path: "/65-yas-ayligi-uygunluk-testi",
    status: "published",
    updated_at: "2026-04-02",
  },
  {
    id: "content-birth-grant",
    slug: "dogum-yardimi-uygunluk-testi",
    section: "tool",
    title: "Doğum yardımı",
    body: "Başvuru, ödeme takvimi ve SSS ile tamamlanan akış.",
    seo_title: "Doğum Yardımı Uygunluk Testi | Sosyal Hak Rehberi",
    seo_description:
      "Doğum yardımı için uygunluk testi, başvuru rehberi ve ödeme takvimi.",
    canonical_path: "/dogum-yardimi-uygunluk-testi",
    status: "published",
    updated_at: "2026-04-02",
  },
];

export const sourceRegistry: SourceRegistryEntry[] = [
  {
    id: "source-site",
    kind: "web",
    title: "Sosyal Hak Rehberi ana sitesi",
    url: "https://sosyalhakrehberi.com",
    topic_tags: ["homepage", "seo", "guide"],
    trust_level: "internal",
    status: "active",
  },
  {
    id: "source-instagram",
    kind: "web",
    title: "Instagram iletişim kanalı",
    url: "https://www.instagram.com/sosyalhizmet.danismanligi/",
    topic_tags: ["contact", "brand", "community"],
    trust_level: "internal",
    status: "active",
  },
  {
    id: "source-linkedin",
    kind: "web",
    title: "LinkedIn profesyonel profil",
    url: "https://www.linkedin.com/in/senih25/",
    topic_tags: ["about", "trust", "founder"],
    trust_level: "internal",
    status: "active",
  },
  {
    id: "source-cv",
    kind: "pdf",
    title: "Kurucu özgeçmişi",
    file_path: "C:/Users/YeniKullanici/OneDrive/Desktop/KAPSAMLI/SB/Karışık önml/CV SENİH BAYANKULU #1 (1).pdf",
    topic_tags: ["about", "trust", "experience"],
    trust_level: "internal",
    status: "active",
  },
];

export const approvalRegistry: ApprovalRegistryEntry[] = [
  {
    id: "approval-homepage-refresh",
    subject_type: "content",
    subject_id: "content-homepage",
    action: "publish",
    status: "approved",
    created_at: "2026-04-02",
    note: "Ana konumlandırma güncellemesi için hazır.",
  },
  {
    id: "approval-about-refresh",
    subject_type: "content",
    subject_id: "content-about",
    action: "publish",
    status: "pending",
    created_at: "2026-04-02",
    note: "Kişisel ama profesyonel bio güncellemesi bekliyor.",
  },
  {
    id: "approval-analytics",
    subject_type: "analytics",
    subject_id: "provider-integration",
    action: "update",
    status: "pending",
    created_at: "2026-04-02",
    note: "GA4, Search Console ve Clarity anahtarları eklendiğinde aktif hale gelecek.",
  },
];

export function getContentRegistrySummary(): {
  published: number;
  draft: number;
  ready: number;
  archived: number;
} {
  return contentRegistry.reduce(
    (summary, entry) => {
      summary[entry.status] += 1;
      return summary;
    },
    {
      published: 0,
      draft: 0,
      ready: 0,
      archived: 0,
    },
  );
}
