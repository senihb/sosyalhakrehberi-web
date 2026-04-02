import type { Metadata } from "next";
import Link from "next/link";
import { analyticsRegistry } from "@/lib/analytics-registry";
import {
  approvalRegistry,
  contentRegistry,
  getContentRegistrySummary,
  sourceRegistry,
} from "@/lib/content-registry";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "İç yönetim özeti, içerik kayıtları ve publish onay durumu.",
  robots: {
    index: false,
    follow: false,
  },
};

const summary = getContentRegistrySummary();

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card-panel">
        <h2 className="text-2xl font-semibold text-slate-950">Özet</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
        <h2 className="text-2xl font-semibold text-slate-950">Hızlı bağlantılar</h2>
        <div className="mt-5 flex flex-col gap-3">
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

      <section className="card-panel lg:col-span-2">
        <h2 className="text-2xl font-semibold text-slate-950">Yayınlanmış içerikler</h2>
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
