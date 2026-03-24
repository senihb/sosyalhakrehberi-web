"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToolGuidanceSurface } from "@/components/ToolGuidanceSurface";
import { ApiClientError, checkEligibility } from "@/lib/api";
import {
  buildEligibilityPayload,
  initialEligibilityFormState,
  type EligibilityFormState,
  type TriStateAttestation,
} from "@/lib/eligibility-form";
import { createToolAnalyticsSession } from "@/lib/tool-analytics";
import { buildTrustLayerModel } from "@/lib/trust-layer";
import { getToolGuidanceModel } from "@/lib/tool-guidance";
import { getHomeCareFormFieldErrors } from "@/lib/home-care-form-validation";
import {
  getHomeCareFieldLabel,
  getHomeCareStatusLabel,
  getHomeCareVisitorErrorMessage,
  getHomeCareVisitorFieldMessages,
} from "@/lib/home-care-visitor-copy";
import type { EligibilityCheckResponse, EligibilityStatus } from "@/lib/types";
import {
  formatEvaluationDateTR,
  getWhyFallbackCopy,
  groupMissingFactsByFactGroup,
  isValidHttpUrl,
  normalizeMissingFacts,
  normalizeReasons,
  normalizeRuleResults,
} from "./resultRenderers";

const statusTone: Record<EligibilityStatus, string> = {
  ELIGIBLE: "border-emerald-200 bg-emerald-50 text-emerald-950",
  NOT_ELIGIBLE: "border-rose-200 bg-rose-50 text-rose-950",
  NEEDS_INFO: "border-amber-200 bg-amber-50 text-amber-950",
};

const statusBadgeCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Hazırlıkla devam edebilirsiniz",
  NOT_ELIGIBLE: "Bilgileri yeniden gözden geçirin",
  NEEDS_INFO: "Eksik bilgi tamamlanmalı",
};

const statusHeaderCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Ön değerlendirme olumlu görünüyor",
  NOT_ELIGIBLE: "Ön değerlendirme olumsuz görünüyor",
  NEEDS_INFO: "Sonuç için ek bilgi gerekiyor",
};

const statusSummaryCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE:
    "Girdiğiniz bilgilere göre sistem olumlu yönde bir ön sonuç üretti. Resmî değerlendirme belge ve kurum incelemesine bağlıdır.",
  NOT_ELIGIBLE:
    "Girdiğiniz bilgilere göre sistem olumsuz yönde bir ön sonuç üretti. Yine de resmî koşulları kurum kaynaklarından doğrulamanız gerekir.",
  NEEDS_INFO:
    "Sistem mevcut bilgilerle net bir sonuç üretemedi. Eksik görünen bilgileri tamamlamak değerlendirmeyi güçlendirir.",
};

const triStateOptions: Array<{
  label: string;
  value: TriStateAttestation;
}> = [
  { label: "Evet", value: true },
  { label: "Hayır", value: false },
  { label: "Bilmiyorum", value: null },
];

function resultPrimaryAction(status: EligibilityStatus) {
  if (status === "NEEDS_INFO") {
    return {
      label: "Eksik bilgileri tamamla ve tekrar dene",
      href: "#form-start",
    };
  }

  if (status === "ELIGIBLE") {
    return {
      label: "Başvuru rehberine git",
      href: "/evde-bakim-maasi/basvuru-rehberi",
    };
  }

  return {
    label: "Şartları rehber sayfasında incele",
    href: "/evde-bakim-maasi/sartlar",
  };
}

type TriStateFieldProps = {
  className?: string;
  legend: string;
  name: string;
  value: TriStateAttestation;
  onChange: (value: TriStateAttestation) => void;
};

function TriStateField({
  className,
  legend,
  name,
  value,
  onChange,
}: TriStateFieldProps) {
  return (
    <fieldset className={className}>
      <legend className="text-sm font-medium text-slate-900">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {triStateOptions.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={`${name}-${option.label}`}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                checked
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function HesaplamaPage() {
  const [form, setForm] = useState<EligibilityFormState>(initialEligibilityFormState);
  const [result, setResult] = useState<EligibilityCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const analyticsRef = useRef(createToolAnalyticsSession("home-care"));

  useEffect(() => {
    analyticsRef.current.trackOpened();
  }, []);

  useEffect(() => {
    if (!result) {
      return;
    }

    analyticsRef.current.trackResultReceived(result.decision_id, result.status);
  }, [result]);

  const markFormStarted = () => {
    analyticsRef.current.trackFormStarted();
  };

  const submitEligibilityCheck = async () => {
    const clientFieldErrors = getHomeCareFormFieldErrors(form);

    if (clientFieldErrors) {
      setError("Lütfen zorunlu alanları tamamlayın.");
      setFieldErrors(clientFieldErrors);
      setResult(null);
      return;
    }

    analyticsRef.current.trackFormSubmitted();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors(null);
    setResult(null);
    const payload = buildEligibilityPayload(form, crypto.randomUUID());

    try {
      const response = await checkEligibility(payload);
      setResult(response);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(getHomeCareVisitorErrorMessage(err.message, err.status));
        setFieldErrors(err.details ?? null);
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    await submitEligibilityCheck();
  };

  const hasConfigError = Boolean(error?.includes("NEXT_PUBLIC_API_BASE_URL"));
  const displayError = hasConfigError
    ? "Değerlendirme sistemi şu anda hazır değil. Lütfen daha sonra tekrar deneyin."
    : error;
  const primaryAction = result ? resultPrimaryAction(result.status) : null;
  const trustLayer = result
    ? buildTrustLayerModel({
        status: result.status,
        metadata: result.metadata,
      })
    : null;
  const guidanceModel = getToolGuidanceModel("home-care");
  const reasonsNorm = useMemo(
    () => normalizeReasons(result?.reasons, { sortBySeverity: false }),
    [result?.reasons],
  );
  const primaryReason = reasonsNorm[0] ?? null;
  const additionalReasons = reasonsNorm.slice(1);
  const missingNorm = useMemo(
    () => normalizeMissingFacts(result?.missing_facts),
    [result?.missing_facts],
  );
  const missingGrouped = useMemo(
    () => groupMissingFactsByFactGroup(missingNorm),
    [missingNorm],
  );
  const rulesNorm = useMemo(
    () => normalizeRuleResults(result?.rule_results),
    [result?.rule_results],
  );
  const evaluationDateLabel = useMemo(
    () => formatEvaluationDateTR(result?.metadata?.evaluation_date),
    [result?.metadata?.evaluation_date],
  );

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="card-panel">
          <p className="eyebrow">Hesaplama Aracı</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Evde bakım maaşı için ön değerlendirme
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
            Bu araç resmî karar vermez. Tam bağımlı bakım ihtiyacına yönelik sorularla ön
            değerlendirme yapar ve sonucu açıklayıcı biçimde sunar.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            Formda yalnızca gerekli temel bilgiler istenir. Bakım ihtiyacı, sağlık raporu oranı,
            yerleşim, gelir ve hane bilgileri dışında kimlik numarası, açık adres veya belge
            yükleme bu aşamada istenmez.
          </div>

          <div id="form-start" className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm font-medium text-slate-900">Yerleşim ve kimlik yolu</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                Emin değilseniz Bilmiyorum seçeneğini kullanın. Bilinmeyen alanlar değerlendirme
                sistemine eksik bilgi olarak gönderilir.
              </p>
              <TriStateField
                className="mt-4"
                legend="Türkiye'de ikamet ediyor mu?"
                name="isResidentInTr"
                value={form.isResidentInTr}
                onChange={(value) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    isResidentInTr: value,
                  }));
                }}
              />
              <TriStateField
                className="mt-4"
                legend="Türk vatandaşı mı?"
                name="isTurkishCitizen"
                value={form.isTurkishCitizen}
                onChange={(value) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    isTurkishCitizen: value,
                    hasValidForeignerIdentityNumber:
                      value === false ? current.hasValidForeignerIdentityNumber : null,
                    hasValidResidencePermit:
                      value === false ? current.hasValidResidencePermit : null,
                  }));
                }}
              />

              {form.isTurkishCitizen === false ? (
                <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
                  <TriStateField
                    legend="Geçerli yabancı kimlik numarası var mı?"
                    name="hasValidForeignerIdentityNumber"
                    value={form.hasValidForeignerIdentityNumber}
                    onChange={(value) => {
                      markFormStarted();
                      setForm((current) => ({
                        ...current,
                        hasValidForeignerIdentityNumber: value,
                      }));
                    }}
                  />
                  <TriStateField
                    legend="Geçerli oturma izni var mı?"
                    name="hasValidResidencePermit"
                    value={form.hasValidResidencePermit}
                    onChange={(value) => {
                      markFormStarted();
                      setForm((current) => ({
                        ...current,
                        hasValidResidencePermit: value,
                      }));
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm font-medium text-slate-900">Sağlık ve bakım ihtiyacı</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                Bu bölümde bakım ihtiyacı ve heyet teyidi ana sorulardır. Sağlık raporundaki oran
                tek başına yeterli karar üretmez.
              </p>

              <label className="form-field mt-4">
                <span>Sağlık raporundaki oran</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={form.disabilityRate}
                  onChange={(event) => {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      disabilityRate: event.target.value,
                    }));
                  }}
                  placeholder="Örn. 80"
                />
              </label>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                Ayrı bir “geçerli sağlık raporu” sorusu gösterilmez. Bu oranı girmeniz
                sağlık raporu bilgisini bu aşama için tamamlar.
              </p>

              <TriStateField
                className="mt-5"
                legend="Tam bağımlı mı?"
                name="isFullyDependent"
                value={form.isFullyDependent}
                onChange={(value) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    isFullyDependent: value,
                  }));
                }}
              />
              <p className="mt-2 text-xs leading-6 text-slate-600">
                Evet derseniz tam bağımlı bakım ihtiyacı bulunduğunu, Hayır derseniz bulunmadığını,
                Bilmiyorum derseniz bu bilginin eksik olduğunu bildirirsiniz.
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <TriStateField
                    legend="Heyet bakım raporu veya bakım ihtiyacı tespiti var mı?"
                    name="careNeedConfirmedByBoard"
                    value={form.careNeedConfirmedByBoard}
                    onChange={(value) => {
                      markFormStarted();
                      setForm((current) => ({
                        ...current,
                        careNeedConfirmedByBoard: value,
                      }));
                    }}
                  />
                  <p className="mt-2 text-xs leading-6 text-slate-600">
                    Bu soru 2026 uygulamasındaki bakım ihtiyacı teyidini yansıtır.
                  </p>
                </div>

                <TriStateField
                  legend="Bakım verenle aynı evde yaşıyor mu?"
                  name="caregiverSameResidence"
                  value={form.caregiverSameResidence}
                  onChange={(value) => {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      caregiverSameResidence: value,
                    }));
                  }}
                />
              </div>
            </div>

            <label className="form-field">
              <span>Hanedeki kişi sayısı</span>
              <input
                type="number"
                min="1"
                value={form.householdSize}
                onChange={(event) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    householdSize: event.target.value,
                  }));
                }}
                placeholder="Örn. 4"
              />
            </label>

            <label className="form-field">
              <span>Toplam hane geliri (aylık)</span>
              <input
                type="number"
                min="0"
                value={form.householdIncome}
                onChange={(event) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    householdIncome: event.target.value,
                  }));
                }}
                placeholder="Örn. 10000"
              />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm font-medium text-slate-900">Ek gelir veya varlık etkisi</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                Bu alan şu an yalnız bilgilendirme amaçlıdır. Tek başına formu durdurmaz; sonucu
                açıklarken ek rehberlik sağlayabilir.
              </p>
              <TriStateField
                className="mt-4"
                legend="Ek gelir veya varlık etkileri var mı?"
                name="hasAdditionalIncomeOrAssets"
                value={form.hasAdditionalIncomeOrAssets}
                onChange={(value) => {
                  markFormStarted();
                  setForm((current) => ({
                    ...current,
                    hasAdditionalIncomeOrAssets: value,
                  }));
                }}
              />
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
                setForm(initialEligibilityFormState);
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
              <p className="mt-2 leading-7">{displayError}</p>
              {fieldErrors ? (
                <ul className="mt-3 space-y-1">
                  {Object.entries(fieldErrors).map(([field, messages]) => (
                    <li key={field}>
                      <span className="font-medium">{getHomeCareFieldLabel(field)}</span>:{" "}
                      {getHomeCareVisitorFieldMessages(field, messages).join(" ")}
                    </li>
                  ))}
                </ul>
              ) : null}
              {hasConfigError ? (
                <p className="mt-3 leading-7">
                  Değerlendirme bağlantısı tanımlanmadan bu araç canlıya alınmamalı.
                </p>
              ) : null}
            </div>
          ) : null}

          {result ? (
            <section className={`mt-6 rounded-3xl border p-6 ${statusTone[result.status]}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                    {getHomeCareStatusLabel(result.status)}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">Evde Bakım Maaşı Sonucu</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7">
                    {statusHeaderCopy[result.status]}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-7">
                    {statusSummaryCopy[result.status]}
                  </p>
                  {evaluationDateLabel ? (
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-700">
                      Değerlendirme zamanı: {evaluationDateLabel}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium">
                  {statusBadgeCopy[result.status]}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white/75 p-5 text-sm leading-7 text-slate-700">
                <p className="font-semibold text-slate-950">Bu sonuç resmî karar değildir.</p>
                <p className="mt-2">
                  Sonuç, girdiğiniz bilgilerle üretilen ön değerlendirme çıktısıdır. Aracın nasıl
                  çalıştığını ve sınırlarını görmek için yöntem sayfasını açabilirsiniz.
                </p>
                <div className="mt-4">
                  <Link href="/methodology" className="secondary-link inline-flex">
                    Yöntem ve sınırları oku
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="rounded-2xl bg-white/70 p-5" id="why">
                  <h3 className="font-semibold">Neden bu sonuç çıktı?</h3>
                  {reasonsNorm.length > 0 ? (
                    <div className="mt-4 space-y-4 text-sm leading-7">
                      {primaryReason ? (
                        <div
                          className={`rounded-2xl border p-4 ${
                            result.status === "NOT_ELIGIBLE"
                              ? "border-rose-200 bg-rose-50/70"
                              : "border-white/70 bg-white/70"
                          }`}
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                            {result.status === "NOT_ELIGIBLE"
                              ? "Birincil neden"
                              : "Öne çıkan açıklama"}
                          </p>
                          <p className="mt-2 font-medium text-slate-950">{primaryReason.message}</p>
                        </div>
                      ) : null}

                      {result.status === "NOT_ELIGIBLE" && additionalReasons.length > 0 ? (
                        <div className="rounded-2xl border border-rose-200 bg-white/70 p-4">
                          <h4 className="font-medium text-slate-950">
                            Sonucu etkileyen diğer nedenler
                          </h4>
                          <ul className="mt-3 space-y-2">
                            {additionalReasons.map((reason) => (
                              <li key={`${reason.code}-${reason.message}`} className="rounded-2xl bg-rose-50/70 p-3">
                                {reason.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : additionalReasons.length > 0 ? (
                        <ul className="space-y-2">
                          {additionalReasons.map((reason) => (
                            <li
                              key={`${reason.code}-${reason.message}`}
                              className="rounded-2xl border border-white/70 bg-white/70 p-4"
                            >
                              {reason.message}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-2xl bg-white/70 p-4 text-sm leading-7">
                      {getWhyFallbackCopy()}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl bg-white/70 p-5" id="next-steps">
                  <h3 className="font-semibold">Sonraki adımlar</h3>
                  <ol className="mt-4 space-y-4 text-sm leading-7">
                    <li className="rounded-2xl bg-white/70 p-4">
                      <span className="font-medium">1. Belgeleri hazırlayın</span>
                      <p className="mt-1">
                        Aşağıdaki genel hazırlık listesini kullanarak kurum incelemesi öncesi temel
                        belgeleri gözden geçirin.
                      </p>
                    </li>
                    <li className="rounded-2xl bg-white/70 p-4">
                      <span className="font-medium">2. Rehber sayfasından şartları doğrulayın</span>
                      <p className="mt-1">
                        Resmî başvuruya geçmeden önce şartları ve başvuru akışını rehber üzerinden
                        yeniden kontrol edin.
                      </p>
                    </li>
                    <li className="rounded-2xl bg-white/70 p-4">
                      <span className="font-medium">3. Durum değişirse tekrar kontrol edin</span>
                      <p className="mt-1">
                        Gelir, hane yapısı veya bakım ihtiyacı değişirse aynı akışı yeniden
                        çalıştırın.
                      </p>
                    </li>
                  </ol>
                  {primaryAction ? (
                    <Link href={primaryAction.href} className="secondary-link mt-4 inline-flex">
                      {primaryAction.label}
                    </Link>
                  ) : null}
                </div>
              </div>

              {missingGrouped.length > 0 ? (
                <div className="mt-5 rounded-2xl bg-white/70 p-5" id="missing-info">
                  <h3 className="font-semibold">Eksik bilgiler</h3>
                  <p className="mt-3 text-sm leading-7">
                    Sonucun güvenilirliğini artırmak için sistem şu bilgileri tamamlamanızı istiyor:
                  </p>
                  <div className="mt-4 space-y-4">
                    {missingGrouped.map((group) => (
                      <div key={group.groupLabel} className="rounded-2xl bg-white/70 p-4">
                        <h4 className="text-sm font-medium text-slate-950">{group.groupLabel}</h4>
                        <ul className="mt-3 space-y-3 text-sm leading-7">
                          {group.items.map((fact) => (
                            <li key={`${fact.key}-${fact.message}`}>
                              <p>{fact.message}</p>
                              {isValidHttpUrl(fact.how_to_obtain_url) ? (
                                <a
                                  href={fact.how_to_obtain_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="secondary-link mt-2 inline-flex"
                                >
                                  Nasıl temin edilir?
                                </a>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {rulesNorm.length > 0 ? (
                <details className="mt-5 rounded-2xl bg-white/70 p-5">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-950">
                    Kural ayrıntıları
                  </summary>
                  <div className="mt-4 space-y-3 text-sm leading-7">
                    {rulesNorm.map((rule) => (
                      <article
                        key={`${rule.rule_code}-${rule.message}`}
                        className="rounded-2xl bg-white/70 p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-slate-950">Değerlendirme ayrıntısı</h4>
                          <span className="rounded-full border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700">
                            {rule.passed ? "Koşul karşılanmış görünüyor" : "Koşul henüz karşılanmıyor"}
                          </span>
                        </div>
                        <p className="mt-2">{rule.message}</p>
                        <dl className="mt-3 grid gap-2 sm:grid-cols-3">
                          {rule.value !== undefined ? (
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                                Değer
                              </dt>
                              <dd>{rule.value ?? "—"}</dd>
                            </div>
                          ) : null}
                          {rule.threshold !== undefined ? (
                            <div>
                              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                                Eşik
                              </dt>
                              <dd>{rule.threshold ?? "—"}</dd>
                            </div>
                          ) : null}
                        </dl>
                      </article>
                    ))}
                  </div>
                </details>
              ) : null}

              <div className="mt-5 grid gap-4 lg:grid-cols-2" id="documents">
                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">Hazırlanabilecek belgeler</h3>
                  <p className="mt-3 text-sm leading-7">
                    Bu liste genel hazırlık içindir. Resmî belge talepleri başvuru kanalına göre
                    değişebilir.
                  </p>
                  <div className="mt-4 space-y-4 text-sm leading-7">
                    <div className="rounded-2xl bg-white/70 px-4 py-3">
                      <span className="font-medium">Kimlik ve ikamet</span>
                      <p className="mt-1">
                        Kimlik, adres ve ikamet bilgilerini güncel tutmak süreci hızlandırır.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/70 px-4 py-3">
                      <span className="font-medium">Hane ve gelir</span>
                      <p className="mt-1">
                        Hane gelirini destekleyen belgeleri ve hanede yaşayan kişi bilgisini hazır
                        bulundurun.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/70 px-4 py-3">
                      <span className="font-medium">Sağlık ve bakım ihtiyacı</span>
                      <p className="mt-1">
                        Engellilik ve bakım ihtiyacını gösteren güncel sağlık ve bakım belgelerini
                        gözden geçirin.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">Yararlı yönlendirmeler</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    <Link
                      href="/evde-bakim-maasi/basvuru-rehberi"
                      className="secondary-link inline-flex"
                    >
                      Başvuru rehberini aç
                    </Link>
                    <Link
                      href="/evde-bakim-maasi/hesaplama#form-start"
                      className="secondary-link inline-flex"
                    >
                      Bilgileri yeniden gözden geçir
                    </Link>
                  </div>
                </div>
              </div>

              {trustLayer ? (
                <div className="mt-5 rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">{trustLayer.heading}</h3>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {trustLayer.items.map((item) => (
                      <article key={`${item.title}-${item.body}`} className="rounded-2xl bg-white/70 p-4">
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="mt-2 text-sm leading-7">{item.body}</p>
                      </article>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {trustLayer.links.map((link) => (
                      <Link key={`${link.href}-${link.label}`} href={link.href} className="secondary-link inline-flex">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              <ToolGuidanceSurface model={guidanceModel} tool="home-care" showNextStep={false} />
            </section>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Önemli not</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Bu araç resmî kurum kararı yerine geçmez. Sonuçlar yalnızca başvuru öncesi ön
              değerlendirme ve bilgi amaçlıdır.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Veri yaklaşımı</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Kimlik numarası, açık adres veya belge yükleme istenmez. Bu akış bakım ihtiyacı,
              sağlık raporu oranı, hane ve gelir için gerekli temel değerlendirme alanlarını kullanır.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Hızlı hazırlık listesi</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
              <li>Bakım ihtiyacı ve heyet teyidi bilgisini gözden geçirin.</li>
              <li>Hanedeki kişi sayısı ve toplam geliri doğru girin.</li>
              <li>Eksik sonuç aldıysanız Bilmiyorum bıraktığınız alanları tamamlayın.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
