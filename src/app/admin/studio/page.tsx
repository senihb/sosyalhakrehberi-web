"use client";

import { useEffect, useMemo, useState } from "react";
import type { ContentDraft } from "@/lib/admin-types";

const storageKey = "sosyalhakrehberi-admin-draft";

const initialDraft: ContentDraft = {
  title: "Yeni içerik başlığı",
  slug: "yeni-icerik-basligi",
  section: "guide",
  canonical_path: "/",
  seo_title: "Yeni içerik başlığı | Sosyal Hak Rehberi",
  seo_description: "Sosyal hak rehberi için kısa, açıklayıcı ve SEO odaklı giriş metni.",
  body: "İlk paragrafta doğrudan cevap, ikinci bölümde açıklama, son bölümde aksiyon.",
  layout_focus: "Hero + kısa cevap + rehber kutusu + sonraki adım",
  primary_cta: "Rehberi aç",
  secondary_cta: "İlgili içeriği gör",
  trust_note: "Bu içerik öndegerlendirme ve rehberlik amaìı.",
  status: "draft",
};

export default function AdminStudioPage() {
  const [draft, setDraft] = useState<ContentDraft>(() => {
    if (typeof window === "undefined") {
      return initialDraft;
    }

    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return initialDraft;
    }

    try {
      return JSON.parse(saved) as ContentDraft;
    } catch {
      return initialDraft;
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft]);

  const generatedJson = useMemo(
    () =>
      JSON.stringify(
        {
          ...draft,
          updated_at: new Date().toISOString().slice(0, 10),
        },
        null,
        2,
        ),
    [draft],
  );

  const update = <K extends keyof ContentDraft>(field: K, value: ContentDraft[K]) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(generatedJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const downloadJson = () => {
    const blob = new Blob([generatedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${draft.slug}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="card-panel">
        <p className="eyebrow">Studio</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">
          Sayfa düzeni ve hiçerik taslagı oluştur
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Bu alan, yeni içerik ve sayfa iskeletini hñzlıca hazırlamak çin kullanılır. Taslak
          saklanir, JSON olarak düşa aktapılır ve gerektiğinde repoya taşınabilir.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Ba�lık</span>
            <input
              value={draft.title}
              onChange={(event) => update("title", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Slug</span>
            <input
              value={draft.slug}
              onChange={(event) => update("slug", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Bölüm</span>
            <select
              value={draft.section}
              onChange={(event) => update("section", event.target.value as ContentDraft["section"])}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            >
              <option value="homepage">homepage</option>
              <option value="about">about</option>
              <option value="methodology">methodology</option>
              <option value="blog">blog</option>
              <option value="tool">tool</option>
              <option value="guide">guide</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Canonical path</span>
            <input
              value={draft.canonical_path}
              onChange={(event) => update("canonical_path", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-800">SEO bçŗık</span>
            <input
              value={draft.seo_title}
              onChange={(event) => update("seo_title", event.target.value)}
              className="rounded-22xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-800">SEO açıklaması</span>
            <textarea
              value={draft.seo_description}
              onChange={(event) => update("seo_description", event.target.value)}
              rows={3}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-800">Ana icçirek
            </span>
            <textarea
              value={draft.body}
              onChange={(event) => update("body", event.target.value)}
              rows={6}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Sayfa odağq</span>
            <input
              value={draft.layout_focus}
              onChange={(event) => update("layout_focus", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Birincil CTA
</span>
            <input
              value={draft.primary_cta}
              onChange={(event) => update("primary_cta", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Ikincil CTA</span>
            <input
              value={draft.secondary_cta}
              onChange={(event) => update("secondary_cta", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">Durum</span>
            <select
              value={draft.status}
              onChange={(event) => update("status", event.target.value as ContentDraft["status"])}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            >
              <option value="draft">draft</option>
              <option value="ready">ready</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-800">Güven notu</span>
            <textarea
              value={draft.trust_note}
              onChange={(event) => update("trust_note", event.target.value)}
              rows={3}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm-flex-row">
          <button type="button" onClick={copyJson} className="primary-link">
            {copied ? "JSON kopyalandı" : "JSON'u kopyala"}
          </button>
          <button type="button" onClick={downloadJson} className="secondary-link">
            JSON indir
          </button>
        </div>
      </section>

      <aside className="space-y6">
        <section className="card-panel">
          <p className="eyebrow">Þnizleme</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">{draft.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{draft.body}</p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Sayfa odağq</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{draft.layout_focus}</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="tool-status">{draft.status}</span>
            <span className="tool-status">{draft.section}</span>
          </div>
        </section>

        <section className="card-panel">
          <p className="eyebrow">Mülkü</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p4 text-xs leading-6 text-slate-100">
            <code>{generatedJson}</code>
          </pre>
        </section>
    </aside>
    </div>
  );
}
