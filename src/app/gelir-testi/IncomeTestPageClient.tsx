"use client";

import { useMemo, useState } from "react";
import { ApiClientError, evaluateIncome } from "@/lib/api";
import { trackIncomeEvaluationEvent } from "@/lib/income-evaluation-analytics";
import {
  buildIncomeEvaluationPayload,
  formatCurrency,
  getIncomeStatusTitle,
  initialIncomeFormState,
  type IncomeFormState,
} from "@/lib/income-evaluation";
import type {
  IncomeEvaluationResponse,
  EligibilityStatus,
} from "@/lib/types";

const statusTone: Record<EligibilityStatus, string> = {
  ELIGIBLE: "border-emerald-200 bg-emerald-50 text-emerald-950",
  NOT_ELIGIBLE: "border-amber-200 bg-amber-50 text-amber-950",
  NEEDS_INFO: "border-sky-200 bg-sky-50 text-sky-950",
};

const statusBadge: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Uygun görünüyor",
  NOT_ELIGIBLE: "Şartlar karşılanmıyor olabilir",
  NEEDS_INFO: "Ek bilgi gerekli",
};

function getFallbackMessage(status: EligibilityStatus): string {
  if (status === "ELIGIBLE") {
    return "Backend bu gelir bilgileriyle olumlu bir yön gösterdi.";
  }

  if (status === "NOT_ELIGIBLE") {
    return "Backend bu gelir bilgileriyle olumsuz bir yön gösterdi.";
  }

  return "Backend daha net bir sonuç için ek bilgi bekliyor.";
}

function getGuidanceText(result: IncomeEvaluationResponse): string {
  return result.ui_hints?.guidance_text?.trim() || result.message?.trim() || getFallbackMessage(result.status);
}

function getNextSteps(result: IncomeEvaluationResponse): string[] {
  return result.ui_hints?.next_steps?.filter((step) => step.trim().length > 0) ?? [];
}

export function IncomeTestPageClient() {
  const [form, setForm] = useState<IncomeFormState>(initialIncomeFormState);
  const [result, setResult] = useState<IncomeEvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  const handleSubmit = async () => {
    trackIncomeEvaluationEvent("income_test_started");
    setHasSubmittedOnce(true);
    setIsSubmitting(true);
    setError(null);
    setFieldErrors(null);
    setResult(null);

    try {
      const response = await evaluateIncome(buildIncomeEvaluationPayload(form));
      trackIncomeEvaluationEvent("income_test_completed");
      if (response.status === "ELIGIBLE") {
        trackIncomeEvaluationEvent("income_test_result_ELIGIBLE");
      }

      if (response.status === "NOT_ELIGIBLE") {
        trackIncomeEvaluationEvent("income_test_result_NOT_ELIGIBLE");
      }
      setResult(response);
    } catch (err) {
      trackIncomeEvaluationEvent("income_test_completed");
      if (err instanceof ApiClientError) {
        setError("Şu anda işlem yapılamıyor, lütfen tekrar deneyin.");
        setFieldErrors(err.details ?? null);
      } else {
        setError("Şu anda işlem yapılamıyor, lütfen tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const guidanceText = result ? getGuidanceText(result) : null;
  const nextSteps = result ? getNextSteps(result) : [];
  const perCapitaIncome = formatCurrency(result?.per_capita_income);
  const threshold = formatCurrency(result?.threshold);
  const showEmptyState = useMemo(
    () => !hasSubmittedOnce && !isSubmitting && !result && !error,
    [error, hasSubmittedOnce, isSubmitting, result],
  );

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="card-panel">
          <p className="eyebrow">Gelir Testi</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Gelir uygunluğunu kısa form ile değerlendirin
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            Hane kişi sayısı ve toplam gelir bilgisini gönderin. Sonuç yalnızca backend’in
            döndürdüğü uygunluk durumu, kişi başı gelir, eşik ve rehber ipuçlarıyla gösterilir.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
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
                placeholder="Örn. 3"
              />
            </label>

            <label className="form-field">
              <span>Toplam gelir</span>
              <input
                type="number"
                min="0"
                value={form.totalIncome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    totalIncome: event.target.value,
                  }))
                }
                placeholder="Örn. 15000"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="primary-button"
            >
              {isSubmitting ? "Değerlendiriliyor..." : "Gelir testini çalıştır"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialIncomeFormState);
                setResult(null);
                setError(null);
                setFieldErrors(null);
              }}
              className="secondary-button"
            >
              Formu temizle
            </button>
          </div>

          {showEmptyState ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-950">Bu test ne sağlar?</p>
              <p className="mt-2 leading-7">
                Bu test ile gelir durumunuza göre sosyal haklara uygunluğunuzu öğrenebilirsiniz.
              </p>
            </div>
          ) : null}

          {isSubmitting ? (
            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950">
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-sky-300 border-t-sky-700"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Geliriniz analiz ediliyor...</p>
                  <p className="mt-1 text-sm leading-7 text-sky-900">
                    Backend sonucu hazırlarken bu ekran otomatik güncellenecek.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

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
              <button
                type="button"
                onClick={handleSubmit}
                className="secondary-button mt-4"
              >
                Tekrar dene
              </button>
            </div>
          ) : null}

          {result ? (
            <section className={`mt-6 rounded-3xl border p-6 ${statusTone[result.status]}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                    {statusBadge[result.status]}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {getIncomeStatusTitle(result.status)}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7">{guidanceText}</p>
                </div>

                <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium">
                  {result.status}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <article className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold text-slate-950">Değerlendirme özeti</h3>
                  <dl className="mt-4 grid gap-4">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                        Kişi başı gelir
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-slate-950">
                        {perCapitaIncome ?? "Gösterilmedi"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                        Eşik
                      </dt>
                      <dd className="mt-1 text-lg font-semibold text-slate-950">
                        {threshold ?? "Gösterilmedi"}
                      </dd>
                    </div>
                  </dl>
                </article>

                <article className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold text-slate-950">Sonraki adımlar</h3>
                  {nextSteps.length > 0 ? (
                    <ol className="mt-4 space-y-3 text-sm leading-7">
                      {nextSteps.map((step) => (
                        <li key={step} className="rounded-2xl bg-white/70 p-4">
                          {step}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-slate-700">
                      Backend bu sonuç için ek bir yönlendirme döndürmedi.
                    </p>
                  )}
                  {result.status === "ELIGIBLE" ? (
                    <button
                      type="button"
                      onClick={() => console.log("income_test_cta_view_eligible_rights")}
                      className="secondary-button mt-4"
                    >
                      Uygun olduğunuz hakları gör
                    </button>
                  ) : null}
                </article>
              </div>
            </section>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Nasıl çalışır?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Frontend yalnız form verisini gönderir. Uygunluk kararı, kişi başı gelir,
              eşik ve rehber ipuçları backend tarafından üretilir.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Bu formda hangi bilgiler var?</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Hanedeki kişi sayısı</li>
              <li>Toplam gelir</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
