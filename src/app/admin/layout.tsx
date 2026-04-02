import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
  description: "İç yönetim, içerik taslağı, onay ve yayın akışı.",
  robots: {
    index: false,
    follow: false,
  },
};

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/studio", label: "Studio" },
  { href: "/admin/content", label: "Content Registry" },
  { href: "/admin/analytics", label: "Analytics Registry" },
  { href: "/admin/approval", label: "Approval Queue" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen px-6 py-10 lg:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="card-panel">
          <p className="eyebrow">Internal</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                Sosyal Hak Rehberi Admin
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
                İçerik taslağı, sayfa düzeni, yayın onayı ve analitik kaydının toplandığı
                yönetim yüzeyi.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {sections.map((section) => (
                <Link key={section.href} href={section.href} className="secondary-link compact-link">
                  {section.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {children}
      </div>
    </main>
  );
}
