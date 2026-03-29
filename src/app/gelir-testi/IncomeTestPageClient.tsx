"use client";

import { useMemo, useState } from "react";
import {
  BenefitCard,
} from "@/components/result/BenefitCard";
import { DecisionExplanationBlock } from "@/components/result/DecisionExplanationBlock";
import { PrimaryActionBlock } from "@/components/result/PrimaryActionBlock";
import { RiskBlock } from "@/components/result/RiskBlock";
import { StepByStepGuidance } from "@/components/result/StepByStepGuidance";
import { ApiClientError, createLead, evaluateIncome } from "@/lib/api";
import { trackIncomeEvaluationEvent } from "@/lib/income-evaluation-analytics";
import {
  buildIncomeEvaluationPayload,
  buildIncomeLeadPayload,
  formatCurrency,
  getIncomeStatusTitle,
  initialIncomeLeadFormState,
  initialIncomeFormState,
  type IncomeFormState,
  type IncomeLeadFormState,
} from "@/lib/income-evaluation";
import {
  adaptEligibleBenefits,
  adaptGuidanceSteps,
  adaptPrimaryBenefit,
  adaptReasonMessages,
  adaptRiskMessages,
  adaptRuleTraceMessages,
} from "@/lib/income-result-view";
import type { EligibilityStatus, IncomeEvaluationResponse } from "@/lib/types";

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

export function IncomeTestPageClient() {
  const [form, setForm] = useState<IncomeFormState>(initialIncomeFormState);
  const [leadForm, setLeadForm] = useState<IncomeLeadFormState>(
    initialIncomeLeadFormState,
  );
  const [result, setResult] = useState<IncomeEvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  const [conversionIntent, setConversionIntent] = useState<
    "detailed-analysis" | "consultation" | null
  >(null);
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSuccess, setLeadSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    trackIncomeEvaluationEvent("income_test_started");
    setHasSubmittedOnce(true);
    setIsSubmitting(true);
    setError(null);
    setFieldErrors(null);
    setResult(null);
    setConversionIntent(null);
    setLeadError(null);
    setLeadSuccess(null);
    setLeadForm(initialIncomeLeadFormState);

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
        setError(
          err.correlationId
            ? `${err.message} (İzleme kodu: ${err.correlationId})`
            : err.message,
        );
        setFieldErrors(err.details ?? null);
      } else {
        setError("Şu anda işlem yapılamıyor, lütfen tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConversionClick = (intent: "detailed-analysis" | "consultation") => {
    trackIncomeEvaluationEvent("conversion_cta_clicked", { intent });
    setConversionIntent(intent);
    setLeadError(null);
    setLeadSuccess(null);
  };

  const handleLeadSubmit = async () => {
    if (!result) {
      return;
    }

    setIsLeadSubmitting(true);
    setLeadError(null);
    setLeadSuccess(null);

    try {
      await createLead(buildIncomeLeadPayload(leadForm, result.status));
      trackIncomeEvaluationEvent("consultation_requested", {
        has_name: leadForm.name.trim().length > 0,
        has_contact: leadForm.contact.trim().length > 0,
      });
      setLeadSuccess(
        "Talebiniz alındı. En kısa sürede sizinle iletişime geçilecektir.",
      );
      setLeadForm(initialIncomeLeadFormState);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setLeadError(
          err.correlationId
            ? `${err.message} (İzleme kodu: ${err.correlationId})`
            : err.message,
        );
      } else {
        setLeadError("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } finally {
      setIsLeadSubmitting(false);
    }
  };

  const showEmptyState = useMemo(
    () => !hasSubmittedOnce && !isSubmitting && !result && !error,
    [error, hasSubmittedOnce, isSubmitting, result],
  );

  const guidanceText = result?.ui_hints?.guidance_text?.trim() || result?.message?.trim() || null;
  const perCapitaIncome = formatCurrency(result?.per_capita_income);
  const threshold = formatCurrency(result?.threshold);

  const benefits = useMemo(
    () => adaptEligibleBenefits(result?.eligible_benefits),
    [result?.eligible_benefits],
  );
  const primaryBenefit = useMemo(
    () => adaptPrimaryBenefit(result?.eligible_benefits),
    [result?.eligible_benefits],
  );
  const reasonMessages = useMemo(
    () => adaptReasonMessages(result?.reasons),
    [result?.reasons],
  );
  const ruleTraceMessages = useMemo(
    () => adaptRuleTraceMessages(result?.rule_trace),
    [result?.rule_trace],
  );
  const riskReasons = useMemo(
    () => (result?.status === "NOT_ELIGIBLE" ? adaptRiskMessages(result.reasons) : []),
    [result?.reasons, result?.status],
  );
  const guidanceSteps = useMemo(
    () => adaptGuidanceSteps(result?.ui_hints, result?.eligible_benefits),
    [result?.eligible_benefits, result?.ui_hints],
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
            Hane kişi sayısı ve toplam gelir bilgisini gönderin. Sonuç yalnızca
            değerlendirme sisteminden gelen uygunluk durumu, kişi başı gelir,
            eşik ve rehber ipuçlarıyla gösterilir.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="form-field">
              <span>Hanedeki kişi sayısı</span>
              <input
                type="number"
                id="householdSize"
                name="householdSize"
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
                id="totalIncome"
                name="totalIncome"
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
                setLeadForm(initialIncomeLeadFormState);
                setResult(null);
                setError(null);
                setFieldErrors(null);
                setConversionIntent(null);
                setLeadError(null);
                setLeadSuccess(null);
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
                Bu test ile gelir durumunuza göre sosyal haklara uygunluğunuzu
                öğrenebilirsiniz.
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
                    Sonuç hazırlanırken bu ekran otomatik güncellenecek.
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
                      <span className="font-medium">{field}</span>:{" "}
                      {messages.join(" ")}
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
              <div className="rounded-3xl bg-white/70 p-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                      {statusBadge[result.status]}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">
                      {getIncomeStatusTitle(result.status)}
                    </h2>
                    {guidanceText ? (
                      <p className="mt-3 max-w-2xl text-sm leading-7">
                        {guidanceText}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                      Kişi başı gelir: {perCapitaIncome ?? "Gösterilmedi"}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                      Eşik: {threshold ?? "Gösterilmedi"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <PrimaryActionBlock benefit={primaryBenefit} />

                <DecisionExplanationBlock
                  reasons={reasonMessages}
                  ruleTraceItems={ruleTraceMessages}
                />

                {result.status === "NOT_ELIGIBLE" ? (
                  <RiskBlock reasons={riskReasons} />
                ) : null}

                <StepByStepGuidance steps={guidanceSteps} />

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">
                        Size uygun olabilecek haklar
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        Değerlendirme sisteminin sıralamasına göre öncelikli haklar aşağıda listelenir.
                      </p>
                    </div>
                  </div>

                  {benefits.length > 0 ? (
                    <div className="mt-4 grid gap-4">
                      {benefits.map((benefit, index) => (
                        <BenefitCard
                          key={`${benefit.name}-${benefit.priority}-${benefit.reason}`}
                          benefit={benefit}
                          isRecommended={index === 0}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-slate-700">
                      Bu aşamada uygun bir sosyal hak bulunamadı.
                    </p>
                  )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white/80 p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <h3 className="text-xl font-semibold text-slate-950">
                        Bu süreci birlikte yönetelim
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">
                        Başvurunuzu daha doğru planlamak için detaylı analiz veya
                        danışman desteği talep edebilirsiniz.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleConversionClick("detailed-analysis")}
                        className="secondary-button"
                      >
                        Detaylı analiz al
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConversionClick("consultation")}
                        className="primary-button"
                      >
                        Başvurunu doğru yap
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Uzman desteği ile süreci hızlandırabilirsiniz.
                  </p>

                  {conversionIntent ? (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="form-field">
                          <span>Ad soyad (isteğe bağlı)</span>
                          <input
                            type="text"
                            value={leadForm.name}
                            onChange={(event) =>
                              setLeadForm((current) => ({
                                ...current,
                                name: event.target.value,
                              }))
                            }
                            placeholder="Adınızı yazabilirsiniz"
                          />
                        </label>

                        <label className="form-field">
                          <span>Telefon veya e-posta (isteğe bağlı)</span>
                          <input
                            type="text"
                            value={leadForm.contact}
                            onChange={(event) =>
                              setLeadForm((current) => ({
                                ...current,
                                contact: event.target.value,
                              }))
                            }
                            placeholder="Telefon veya e-posta"
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <button
                          type="button"
                          onClick={handleLeadSubmit}
                          disabled={isLeadSubmitting}
                          className="primary-button"
                        >
                          {isLeadSubmitting ? "Gönderiliyor..." : "Talep bırak"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConversionIntent(null);
                            setLeadError(null);
                            setLeadSuccess(null);
                          }}
                          className="secondary-button"
                        >
                          Daha sonra karar ver
                        </button>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-slate-500">
                        Bilgileriniz yalnızca sizinle iletişime geçmek için kullanılır.
                      </p>

                      {leadError ? (
                        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-900">
                          {leadError}
                        </p>
                      ) : null}

                      {leadSuccess ? (
                        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-950">
                          {leadSuccess}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </section>
              </div>
            </section>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Nasıl çalışır?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Bu sayfa yalnız form verisini gönderir. Uygunluk kararı, kişi başı
              gelir, eşik ve rehber ipuçları değerlendirme sistemi tarafından hazırlanır.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">
              Bu formda hangi bilgiler var?
            </h2>
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

