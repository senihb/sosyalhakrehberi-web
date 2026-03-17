"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiClientError, checkEligibility } from "@/lib/api";
import type {
  EligibilityCheckRequest,
  EligibilityCheckResponse,
  EligibilityStatus,
  MissingFact,
  RuleResult,
} from "@/lib/types";

type FormState = {
  disabilityRate: string;
  householdIncome: string;
  householdSize: string;
  isTurkishCitizen: boolean;
  isResidentInTr: boolean;
};

const initialFormState: FormState = {
  disabilityRate: "",
  householdIncome: "",
  householdSize: "",
  isTurkishCitizen: true,
  isResidentInTr: true,
};

const statusCopy: Record<
  EligibilityStatus,
  {
    title: string;
    tone: string;
    description: string;
    nextStepTitle: string;
    nextStepBody: string;
  }
> = {
  ELIGIBLE: {
    title: "Ön değerlendirme olumlu görünüyor",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-950",
    description:
      "Backend motoru mevcut bilgilerle uygunluk yönünde bir ön karar üretti. Bu sonuç resmi hak sahipliği kararı değildir.",
    nextStepTitle: "Sonraki adım",
    nextStepBody:
      "Başvuru öncesinde gelir, hane ve bakım koşullarına ilişkin belgelerinizi düzenli biçimde hazırlamanız faydalı olur.",
  },
  NOT_ELIGIBLE: {
    title: "Ön değerlendirme olumsuz görünüyor",
    tone: "border-rose-200 bg-rose-50 text-rose-950",
    description:
      "Backend motoru girilen bilgilerle uygunluk yönünde sonuç üretmedi. Resmi değerlendirme için kurum incelemesi esastır.",
    nextStepTitle: "Sonraki adım",
    nextStepBody:
      "Girilen bilgileri tekrar kontrol edin. Özellikle gelir, hane kişi sayısı ve diğer temel alanların doğru olduğundan emin olun.",
  },
  NEEDS_INFO: {
    title: "Daha fazla bilgi gerekli",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
    description:
      "Mevcut bilgiler karar vermek için yeterli değil. Eksik alanları tamamladıktan sonra yeniden deneyebilirsiniz.",
    nextStepTitle: "Sonraki adım",
    nextStepBody:
      "Eksik görünen bilgileri tamamlayın ve ardından yeniden ön değerlendirme alın. Sonuç ekranındaki eksik bilgi listesi bunun için rehberdir.",
  },
};

function toNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeRuleResults(
  ruleResults: EligibilityCheckResponse["rule_results"],
): RuleResult[] {
  if (Array.isArray(ruleResults)) {
    return ruleResults;
  }

  return Object.values(ruleResults);
}

function resultPrimaryAction(status: EligibilityStatus) {
  if (status === "NEEDS_INFO") {
    return {
      label: "Eksik bilgileri tamamla ve tekrar dene",
      href: "#form-start",
    };
  }

  return {
    label: "Rehber sayfasına dön",
    href: "/evde-bakim-maasi",
  };
}

export default function HesaplamaPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [result, setResult] = useState<EligibilityCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors(null);
    setResult(null);

    const payload: EligibilityCheckRequest = {
      benefit_code: "TR_HOME_CARE_ALLOWANCE",
      facts: {
        disability_rate: toNumber(form.disabilityRate),
        household_income: toNumber(form.householdIncome),
        household_size: toNumber(form.householdSize),
        is_turkish_citizen: form.isTurkishCitizen,
        is_resident_in_tr: form.isResidentInTr,
      },
      context: {
        jurisdiction: "TR",
        request_id: crypto.randomUUID(),
      },
    };

    try {
      const response = await checkEligibility(payload);
      setResult(response);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        setFieldErrors(err.details ?? null);
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusPanel = result ? statusCopy[result.status] : null;
  const missingFacts = result?.missing_facts ?? [];
  const ruleResults = result ? normalizeRuleResults(result.rule_results) : [];
  const hasConfigError = Boolean(error?.includes("NEXT_PUBLIC_API_BASE_URL"));
  const primaryAction = result ? resultPrimaryAction(result.status) : null;

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="card-panel">
          <p className="eyebrow">Hesaplama Aracı</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Evde bakım maaşı için backend destekli ön değerlendirme
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
            Bu araç frontend tarafında uygunluk hesabı yapmaz. SocialRightOS backend
            karar motoruna canonical endpoint üzerinden istek gönderir ve sonucu
            açıklayıcı biçimde sunar.
          </p>

          <div
            id="form-start"
            className="mt-8 grid gap-5 md:grid-cols-2"
          >
            <label className="form-field">
              <span>Engellilik oranı</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.disabilityRate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    disabilityRate: event.target.value,
                  }))
                }
                placeholder="Örn. 80"
              />
            </label>

            <label className="form-field">
              <span>Toplam hane geliri (aylık)</span>
              <input
                type="number"
                min="0"
                value={form.householdIncome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    householdIncome: event.target.value,
                  }))
                }
                placeholder="Örn. 10000"
              />
            </label>

            <label className="form-field">
              <span>Hanedeki kişi sayısı</span>
              <input
                type="number"
                min="1"
                value={form.householdSize}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    householdSize: event.target.value,
                  }))
                }
                placeholder="Örn. 4"
              />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Temel doğrulamalar</p>
              <label className="mt-3 flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isTurkishCitizen}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isTurkishCitizen: event.target.checked,
                    }))
                  }
                />
                Türkiye Cumhuriyeti vatandaşı
              </label>
              <label className="mt-3 flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isResidentInTr}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isResidentInTr: event.target.checked,
                    }))
                  }
                />
                Türkiye&apos;de ikamet ediyor
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="primary-button"
            >
              {isSubmitting ? "Değerlendiriliyor..." : "Ön değerlendirmeyi çalıştır"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialFormState);
                setResult(null);
                setError(null);
                setFieldErrors(null);
              }}
              className="secondary-button"
            >
              Formu temizle
            </button>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <p className="font-semibold">İstek tamamlanamadı</p>
              <p className="mt-2 leading-7">{error}</p>
              {fieldErrors ? (
                <ul className="mt-3 space-y-1">
                  {Object.entries(fieldErrors).map(([field, messages]) => (
                    <li key={field}>
                      <span className="font-medium">{field}</span>: {messages.join(" ")}
                    </li>
                  ))}
                </ul>
              ) : null}
              {hasConfigError ? (
                <p className="mt-3 leading-7">
                  Frontend deploy ortamında backend base URL tanımlanmadan bu araç canlıya
                  alınmamalı.
                </p>
              ) : null}
            </div>
          ) : null}

          {result && statusPanel ? (
            <section className={`mt-6 rounded-3xl border p-6 ${statusPanel.tone}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                {result.status}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{statusPanel.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7">{statusPanel.description}</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-4">
                  <h3 className="font-semibold">Backend nedenleri</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-7">
                    {result.reasons.map((reason) => (
                      <li key={`${reason.code}-${reason.message}`}>
                        <span className="font-medium">{reason.code}</span>: {reason.message}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-white/70 p-4">
                  <h3 className="font-semibold">{statusPanel.nextStepTitle}</h3>
                  <p className="mt-3 text-sm leading-7">{statusPanel.nextStepBody}</p>
                  {primaryAction ? (
                    <Link href={primaryAction.href} className="secondary-link mt-4 inline-flex">
                      {primaryAction.label}
                    </Link>
                  ) : null}
                </div>
              </div>

              {missingFacts.length > 0 ? (
                <div className="mt-5 rounded-2xl bg-white/70 p-4">
                  <h3 className="font-semibold">Eksik bilgiler</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-7">
                    {missingFacts.map((fact: MissingFact) => (
                      <li key={fact.key}>
                        <span className="font-medium">{fact.key}</span>: {fact.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {ruleResults.length > 0 ? (
                <div className="mt-5 rounded-2xl bg-white/70 p-4">
                  <h3 className="font-semibold">Kural sonuçları</h3>
                  <ul className="mt-3 space-y-3 text-sm leading-7">
                    {ruleResults.map((rule: RuleResult) => (
                      <li key={rule.rule_code}>
                        <span className="font-medium">{rule.rule_code}</span>: {rule.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-5 rounded-2xl bg-white/70 p-4">
                <h3 className="font-semibold">Değerlendirme metadata</h3>
                <dl className="mt-3 grid gap-3 text-sm leading-7 md:grid-cols-2">
                  <div>
                    <dt className="font-medium">Request ID</dt>
                    <dd>{result.request_id}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Policy code</dt>
                    <dd>{result.metadata.policy_code}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Policy version</dt>
                    <dd>{result.metadata.policy_version}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Engine version</dt>
                    <dd>{result.metadata.engine_version}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Evaluation date</dt>
                    <dd>{result.metadata.evaluation_date ?? "Belirtilmedi"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Jurisdiction</dt>
                    <dd>{result.metadata.jurisdiction}</dd>
                  </div>
                </dl>
              </div>
            </section>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Önemli not</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Bu araç resmi kurum kararı yerine geçmez. Sonuçlar yalnızca başvuru öncesi
              ön değerlendirme ve bilgi amaçlıdır.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Veri yaklaşımı</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Kimlik numarası, açık adres veya belge yükleme istenmez. MVP yalnızca gerekli
              temel değerlendirme alanlarını kullanır.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Hızlı hazırlık listesi</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Gelir bilgisini netleştirin.</li>
              <li>Hanedeki kişi sayısını doğru girin.</li>
              <li>Eksik sonuç aldıysanız gerekli alanları tamamlayın.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
