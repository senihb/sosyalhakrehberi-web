"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToolGuidanceSurface } from "@/components/ToolGuidanceSurface";
import { ApiClientError, checkEligibility } from "@/lib/api";
import { buildDecisionViewModel } from "@/lib/eligibility-explanations";
import {
  buildEligibilityPayload,
  initialEligibilityFormState,
  type EligibilityFormState,
  type TriStateAttestation,
} from "@/lib/eligibility-form";
import {
  buildIncomeGateModel,
  getIncomeGateSnapshot,
  shouldPromptIncomeGate,
  type IncomeGateSnapshot,
} from "@/lib/income-gate";
import { createToolAnalyticsSession } from "@/lib/tool-analytics";
import { buildTrustLayerModel } from "@/lib/trust-layer";
import { getToolGuidanceModel } from "@/lib/tool-guidance";
import type { EligibilityCheckResponse, EligibilityStatus } from "@/lib/types";

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
      href: "/evde-bakim-maasi",
    };
  }

  return {
    label: "Şartları rehber sayfasında incele",
    href: "/evde-bakim-maasi",
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
  const [showIncomeGate, setShowIncomeGate] = useState(false);
  const [acknowledgedIncomeGateSnapshot, setAcknowledgedIncomeGateSnapshot] =
    useState<IncomeGateSnapshot | null>(null);
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

  const incomeGateModel = buildIncomeGateModel(form);

  const submitEligibilityCheck = async () => {
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
        setError(err.message);
        setFieldErrors(err.details ?? null);
      } else {
        setError("Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (shouldPromptIncomeGate(form, acknowledgedIncomeGateSnapshot)) {
      setShowIncomeGate(true);
      return;
    }

    setShowIncomeGate(false);
    await submitEligibilityCheck();
  };

  const hasConfigError = Boolean(error?.includes("NEXT_PUBLIC_API_BASE_URL"));
  const primaryAction = result ? resultPrimaryAction(result.status) : null;
  const decisionView = result
    ? buildDecisionViewModel({
        status: result.status,
        reasons: result.reasons,
        missingFacts: result.missing_facts,
      })
    : null;
  const trustLayer = result
    ? buildTrustLayerModel({
        status: result.status,
        metadata: result.metadata,
      })
    : null;
  const guidanceModel = getToolGuidanceModel("home-care");

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="card-panel">
          <p className="eyebrow">Hesaplama Aracı</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Evde bakım maaşı için backend destekli ön değerlendirme
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
            Bu araç frontend tarafında uygunluk hesabı yapmaz. SocialRightOS backend karar
            motoruna canonical endpoint üzerinden istek gönderir ve sonucu açıklayıcı biçimde
            sunar.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            Formda yalnızca gerekli temel bilgiler istenir. Kimlik numarası, açık adres veya belge
            yükleme bu aşamada istenmez.
          </div>

          <div id="form-start" className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="form-field">
              <span>Engellilik oranı</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.disabilityRate}
                onChange={(event) =>
                  {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      disabilityRate: event.target.value,
                    }));
                  }
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
                  {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      householdIncome: event.target.value,
                    }));
                  }
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
                  {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      householdSize: event.target.value,
                    }));
                  }
                }
                placeholder="Örn. 4"
              />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Temel doğrulamalar</p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                Emin değilseniz Bilmiyorum seçeneğini kullanın. Frontend tahmin üretmez; bilgi
                backend&apos;e bilinmiyor olarak gönderilir.
              </p>
              <TriStateField
                className="mt-4"
                legend="Türkiye Cumhuriyeti vatandaşlık durumu"
                name="isTurkishCitizen"
                value={form.isTurkishCitizen}
                onChange={(value) =>
                  {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      isTurkishCitizen: value,
                    }));
                  }
                }
              />
              <TriStateField
                className="mt-4"
                legend="Türkiye&apos;de ikamet durumu"
                name="isResidentInTr"
                value={form.isResidentInTr}
                onChange={(value) =>
                  {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      isResidentInTr: value,
                    }));
                  }
                }
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
                setShowIncomeGate(false);
                setAcknowledgedIncomeGateSnapshot(null);
              }}
              className="secondary-button"
            >
              Formu temizle
            </button>
          </div>

          {showIncomeGate && incomeGateModel ? (
            <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
              <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                Gelir bilgisi kontrolü
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Gelir ve hane bilgisini bir kez daha gözden geçirin
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7">
                Bu adım yalnızca rehberlik içindir. Nihai karar bu ekranda verilmez; değerlendirme
                yine backend motoru tarafından yapılır.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                    Toplam gelir
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {incomeGateModel.householdIncome.toLocaleString("tr-TR")} TL
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                    Hane kişi sayısı
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {incomeGateModel.householdSize}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                    Kişi başı gelir
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {incomeGateModel.perPersonIncome.toLocaleString("tr-TR", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    TL
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm leading-7">
                <li>Bu özet bilgilendirme amaçlıdır; uygunluk veya uygunsuzluk kararı vermez.</li>
                <li>Resmi eşik ve threshold davranışı backend tarafında authoritative olarak değerlendirilir.</li>
                <li>Bilgiler doğruysa yine de devam ederek backend ön değerlendirmesini alabilirsiniz.</li>
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={async () => {
                    setAcknowledgedIncomeGateSnapshot(getIncomeGateSnapshot(form));
                    setShowIncomeGate(false);
                    await submitEligibilityCheck();
                  }}
                  disabled={isSubmitting}
                  className="primary-button"
                >
                  Yine de devam et
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncomeGate(false)}
                  className="secondary-button"
                >
                  Bilgileri düzenle
                </button>
              </div>
            </section>
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
              {hasConfigError ? (
                <p className="mt-3 leading-7">
                  Frontend deploy ortamında backend base URL tanımlanmadan bu araç canlıya
                  alınmamalı.
                </p>
              ) : null}
            </div>
          ) : null}

          {result && decisionView ? (
            <section className={`mt-6 rounded-3xl border p-6 ${statusTone[result.status]}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                    {result.status}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">{decisionView.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7">{decisionView.summary}</p>
                </div>

                <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium">
                  {statusBadgeCopy[result.status]}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">Bu sonuç ne anlama geliyor?</h3>
                  {decisionView.primaryReason ? (
                    <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 p-4">
                      <p className="text-sm font-medium">{decisionView.primaryReason.title}</p>
                      <p className="mt-2 text-sm leading-7">
                        {decisionView.primaryReason.body}
                      </p>
                    </div>
                  ) : null}

                  {decisionView.secondaryReasons.length > 0 ? (
                    <ul className="mt-4 space-y-3 text-sm leading-7">
                      {decisionView.secondaryReasons.map((reason) => (
                        <li key={`${reason.title}-${reason.body}`} className="rounded-2xl bg-white/70 p-4">
                          <span className="font-medium">{reason.title}</span>
                          <p className="mt-1">{reason.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">{decisionView.nextStepTitle}</h3>
                  <p className="mt-3 text-sm leading-7">{decisionView.nextStepBody}</p>
                  {primaryAction ? (
                    <Link href={primaryAction.href} className="secondary-link mt-4 inline-flex">
                      {primaryAction.label}
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">{decisionView.checklistTitle}</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-7">
                    {decisionView.checklistItems.map((item) => (
                      <li key={item} className="rounded-2xl bg-white/70 px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">Yararlı yönlendirmeler</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {decisionView.helperLinks.map((link) => (
                      <Link key={`${link.href}-${link.label}`} href={link.href} className="secondary-link inline-flex">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {decisionView.missingInformation.length > 0 ? (
                <div className="mt-5 rounded-2xl bg-white/70 p-5">
                  <h3 className="font-semibold">Tamamlanması iyi olacak bilgiler</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-7">
                    {decisionView.missingInformation.map((fact) => (
                      <li key={`${fact.title}-${fact.body}`} className="rounded-2xl bg-white/70 p-4">
                        <span className="font-medium">{fact.title}</span>
                        <p className="mt-1">{fact.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

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
              Bu araç resmi kurum kararı yerine geçmez. Sonuçlar yalnızca başvuru öncesi ön
              değerlendirme ve bilgi amaçlıdır.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-lg font-semibold text-slate-950">Veri yaklaşımı</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Kimlik numarası, açık adres veya belge yükleme istenmez. MVP yalnızca gerekli temel
              değerlendirme alanlarını kullanır.
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

