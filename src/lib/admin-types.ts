export type RegistrySection = "homepage" | "about" | "methodology" | "blog" | "tool" | "guide";

export type RegistryStatus = "draft" | "ready" | "published" | "archived";

export type ContentRegistryEntry = {
  id: string;
  slug: string;
  section: RegistrySection;
  title: string;
  body: string;
  seo_title?: string;
  seo_description?: string;
  canonical_path: string;
  status: RegistryStatus;
  updated_at: string;
};

export type SourceRegistryEntry = {
  id: string;
  kind: "web" | "pdf" | "note" | "internal";
  title: string;
  url?: string;
  file_path?: string;
  topic_tags: string[];
  trust_level: "official" | "secondary" | "internal";
  status: "active" | "archived";
};

export type AnalyticsRegistryEntry = {
  id: string;
  event_name: string;
  surface: "homepage" | "tool-page" | "result" | "guidance" | "admin";
  tool?: "home-care" | "gss" | "old-age" | "birth-grant";
  enabled: boolean;
};

export type ApprovalRegistryEntry = {
  id: string;
  subject_type: "content" | "source" | "seo" | "analytics";
  subject_id: string;
  action: "create" | "update" | "publish";
  status: "pending" | "approved" | "rejected";
  created_at: string;
  note: string;
};
