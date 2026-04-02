import type { AnalyticsRegistryEntry } from "@/lib/admin-types";

export const analyticsRegistry: AnalyticsRegistryEntry[] = [
  {
    id: "event-tool-opened",
    event_name: "tool_opened",
    surface: "tool-page",
    enabled: true,
  },
  {
    id: "event-form-started",
    event_name: "form_started",
    surface: "tool-page",
    enabled: true,
  },
  {
    id: "event-form-submitted",
    event_name: "form_submitted",
    surface: "tool-page",
    enabled: true,
  },
  {
    id: "event-result-received",
    event_name: "result_received",
    surface: "result",
    enabled: true,
  },
  {
    id: "event-guide-link-clicked",
    event_name: "guide_link_clicked",
    surface: "guidance",
    enabled: true,
  },
];

export const analyticsProviderRegistry = [
  {
    id: "ga4",
    label: "Google Analytics 4",
    env: "NEXT_PUBLIC_GA4_ID",
    purpose: "Traffic, dönüşüm ve sayfa performansı",
  },
  {
    id: "search-console",
    label: "Google Search Console",
    env: "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
    purpose: "Arama görünürlüğü ve doğrulama",
  },
  {
    id: "tag-manager",
    label: "Google Tag Manager",
    env: "NEXT_PUBLIC_GTM_ID",
    purpose: "Etiket yönetimi ve esnek olay takibi",
  },
  {
    id: "clarity",
    label: "Microsoft Clarity",
    env: "NEXT_PUBLIC_CLARITY_ID",
    purpose: "Isı haritası ve oturum analizi",
  },
] as const;
