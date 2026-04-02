import type { Metadata } from "next";
import Link from "next/link";
import { analyticsRegistry } from "@/lib/analytics-registry";
import {
  approvalRegistry,
  contentRegistry,
  getContentRegistrySummary,
  sourceRegistry,
} from "@/lib/content-registry";
import { siteOperations } from "@/lib/site-operations";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "İç yönetim özeti, içerik kayıtları, yayın kuyruğu ve iş dağılımı.",
  robots: {
    index: false,
    follow: false,
  },
};

const summary = getContentRegistrySummary();

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card-panel lg:col-span-2">
        <p className="eyebrow">Yönetim Özeti</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">
          Trafik, içerik ve onay akışı tek panelde
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Yayınlanmış içerik</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{summary.published}</p>
          </article>
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Bekleyen onay</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {approvalRegistry.filter((item) => item.status === "pending").length}
            </p>
          </article>
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Kaynak kaydı</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{sourceRegistry.length}</p>
          </article>
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Analytics olayı</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{analyticsRegistry.length}</p>
          </article>
        </div>
      </section>

      <section className="card-panel">
        <p className="eyebrow">Hızlı bağlantılar</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">İç çalışma alanı</h2>
        <div className="mt-5 flex flex-col gap-3">
          <Link href="/admin/studio" className="primary-link">
            Studio&apos;ya geç
          </Link>
          <Link href="/admin/content" className="secondary-link">
            Content Registry
          </Link>
          <Link href="/admin/analytics" className="secondary-link">
            Analytics Registry
          </Link>
          <Link href="/admin/approval" className="secondary-link">
            Approval Queue
          </Link>
        </div>
      </section>

      <section className="card-panel">
        <p className="eyebrow">Dağılım</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">Frontend / backend / admin</h2>
        <div className="mt-5 space-y-4">
          {siteOperations.workStreams.map((stream) => (
            <article key={stream.key} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {stream.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{stream.summary}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {stream.key}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-panel lg:col-span-2">
        <p className="eyebrow">Yayınlanmış içerikler</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">Temel yüzeyler</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contentRegistry.map((entry) => (
            <article key={entry.id} className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {entry.section}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">{entry.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{entry.body}</p>
              <p className="mt-4 text-xs text-slate-500">{entry.canonical_path}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
