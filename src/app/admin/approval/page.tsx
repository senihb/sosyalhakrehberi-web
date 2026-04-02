import type { Metadata } from "next";
import { approvalRegistry } from "@/lib/content-registry";

export const metadata: Metadata = {
  title: "Approval Queue",
  description: "Yayın öncesi onay ve kontrol kaydı.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminApprovalPage() {
  return (
    <section className="card-panel">
      <h2 className="text-2xl font-semibold text-slate-950">Onay kuyruğu</h2>
      <div className="mt-5 grid gap-4">
        {approvalRegistry.map((item) => (
          <article key={item.id} className="rounded-2xl bg-slate-50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {item.subject_type} • {item.action}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.subject_id}</h3>
              </div>
              <span className="tool-status">{item.status}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">{item.note}</p>
            <p className="mt-4 text-xs text-slate-500">{item.created_at}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
