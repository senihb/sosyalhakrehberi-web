"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToolGuidanceSurface } from "@/components/ToolGuidanceSurface";
import { ApiClientError, checkEligibility } from "@/lib/api";
import {
  buildBirthGrantDecisionViewModel,
  type BirthGrantExplanationItem,
} from "@/lib/birth-grant-explanations";
import {
  buildBirthGrantPayload,
  initialBirthGrantFormState,
  type BirthGrantChildOrder,
  type BirthGrantFormState,
  type TriStateAttestation,
} from "@/lib/birth-grant-form";
import { createToolAnalyticsSession } from "@/lib/tool-analytics";
import { getToolGuidanceModel } from "@/lib/tool-guidance";
import type { EligibilityCheckResponse, EligibilityStatus, GuidanceItem } from "@/lib/types";

const statusTone: Record<EligibilityStatus, string> = {
  ELIGIBLE: "border-emerald-200 bg-emerald-50 text-emerald-950",
  NOT_ELIGIBLE: "border-rose-200 bg-rose-50 text-rose-950",
  NEEDS_INFO: "border-amber-200 bg-amber-50 text-amber-950",
};

const statusBadgeCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Ön değerlendirme olumlu",
  NOT_ELIGIBLE: "Bilgileri tekrar kontrol edin",
  NEEDS_INFO: "Eksik bilgi tamamlanmalı",
};

const statusLabelCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Uygun görünüyor",
  NOT_ELIGIBLE: "Uygun görünmüyor",
  NEEDS_INFO: "Ek bilgi gerekli",
};

const triStateOptions: Array<{ label: string; value: TriStateAttestation }> = [
  { label: "Evet", value: true },
  { label: "Hayır", value: false },
  { label: "Bilmiyorum", value: null },
];

const childOrderOptions: Array<{ label: string; value: BirthGrantChildOrder }> = [
  { label: "1. çocuk", value: "1" },
  { label: "2. çocuk", value: "2" },
  { label: "3 veya daha fazla", value: "3+" },
];

type TriStateFieldProps = {
  legend: string;
  name: string;
  value: TriStateAttestation;
  onChange: (value: TriStateAttestation) => void;
  helperText?: string;
};

function TriStateField({ legend, name, value, onChange, helperText }: TriStateFieldProps) {
  return (
    <fieldset>
      <legend className="text-base font-semibold text-slate-950">{legend}</legend>
      {helperText ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{helperText}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3">
        {triStateOptions.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={`${name}-${option.label}`}
              className={`inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border px-4 py-3 text-base transition ${
                checked
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
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

function ExplanationList({
  title,
  items,
}: {
  title: string;
  items: BirthGrantExplanationItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl bg-white/70 p-4">
      <h4 className="text-base font-medium">{title}</h4>
      <ul className="mt-3 space-y-3 text-base leading-8">
        {items.map((item) => (
          <li key={`${item.title}-${item.body}`}>
            <span className="font-medium">{item.title}</span>
            <p className="mt-1">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GuidanceLinks({ items }: { items: GuidanceItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col gap-3">
      {items.map((item) => (
        <Link
          key={`${item.url}-${item.title}`}
          href={item.url}
          className="secondary-link inline-flex text-base"
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}

export function BirthGrantToolPageClient() {
  const [form, setForm] = useState<BirthGrantFormState>(initialBirthGrantFormState);
  const [result, setResult] = useState<EligibilityCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const analyticsRef = useRef(createToolAnalyticsSession("birth-grant"));

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

  const handleSubmit = async () => {
    analyticsRef.current.trackFormSubmitted();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors(null);
    setResult(null);

    try {
      const response = await checkEligibility(buildBirthGrantPayload(form, crypto.randomUUID()));
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

  const hasConfigError = Boolean(error?.includes("NEXT_PUBLIC_API_BASE_URL"));
  const decisionView = result
    ? buildBirthGrantDecisionViewModel({
        status: result.status,
        reasons: result.reasons,
        missingFacts: result.missing_facts,
        guidanceItems: result.guidance_items,
        benefitDetails: result.benefit_details,
        metadata: result.metadata,
        userMessage: result.user_message,
      })
    : null;
  const guidanceModel = getToolGuidanceModel("birth-grant");
  const displayError = hasConfigError
    ? "Değerlendirme sistemi şu anda hazır değil. Lütfen daha sonra tekrar deneyin."
    : error;

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="card-panel">
          <p className="eyebrow">Doğum Yardımı</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Doğum yardımı için sade ve eylem odaklı ön değerlendirme
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-700">
            Bu araç resmî karar vermez. 2026 güncel tutarlarına ve temel başvuru
            mantığına göre yol gösterir; sonuç ekranında bir sonraki adımı anlatır.
          </p>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-base leading-8 text-slate-700">
            Doğum yardımı gelir testi değildir. Bu sayfa daha çok hakka yakınlık ve
            başvuru yönlendirmesi üretir. Emin olmadığınız sorularda Bilmiyorum
            seçeneğini kullanabilirsiniz.
          </div>

          <div id="form-start" className="mt-8 grid gap-6">
            <TriStateField
              legend="Çocuk doğdu mu?"
              name="childIsLiveBirth"
              value={form.childIsLiveBirth}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  childIsLiveBirth: value,
                }));
              }}
            />

            {form.childIsLiveBirth === true ? (
              <label className="form-field text-lg">
                <span>Çocuğun doğum tarihi</span>
                <input
                  className="min-h-14 text-lg"
                  type="date"
                  value={form.childBirthDate}
                  onChange={(event) => {
                    markFormStarted();
                    setForm((current) => ({
                      ...current,
                      childBirthDate: event.target.value,
                    }));
                  }}
                />
              </label>
            ) : null}

            <fieldset>
              <legend className="text-base font-semibold text-slate-950">
                Bu çocuk kaçıncı çocuk?
              </legend>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                İlk çocuk, ikinci çocuk veya üçüncü çocuk ve üzeri bilgisini seçin.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {childOrderOptions.map((option) => {
                  const checked = form.childOrder === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border px-4 py-3 text-base transition ${
                        checked
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="childOrder"
                        checked={checked}
                        onChange={() => {
                          markFormStarted();
                          setForm((current) => ({
                            ...current,
                            childOrder: option.value,
                          }));
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <TriStateField
              legend="Başvuruyu yapacak kişi T.C. vatandaşı mı?"
              name="applicantIsTurkishCitizen"
              value={form.applicantIsTurkishCitizen}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  applicantIsTurkishCitizen: value,
                }));
              }}
            />

            <TriStateField
              legend="Başvuruyu yapacak kişi Türkiye'de ikamet ediyor mu?"
              name="applicantResidesInTr"
              value={form.applicantResidesInTr}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  applicantResidesInTr: value,
                }));
              }}
            />

            <TriStateField
              legend="Çocuk Türkiye'de ikamet ediyor mu?"
              name="childResidesInTr"
              value={form.childResidesInTr}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  childResidesInTr: value,
                }));
              }}
            />

            <TriStateField
              legend="Çocuğun KPS kaydı tamamlandı mı?"
              name="childIsKpsRegistered"
              value={form.childIsKpsRegistered}
              helperText="KPS kaydı, doğum bilgisinin nüfus sistemine işlendiğini gösterir."
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  childIsKpsRegistered: value,
                }));
              }}
            />

            <TriStateField
              legend="Çocuk başvuru anında sağ mı?"
              name="childIsAlive"
              value={form.childIsAlive}
              onChange={(value) => {
                markFormStarted();
                setForm((current) => ({
                  ...current,
                  childIsAlive: value,
                }));
              }}
            />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="primary-button text-lg"
            >
              {isSubmitting ? "Değerlendiriliyor..." : "Doğum yardımı testini çalıştır"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initialBirthGrantFormState);
                setResult(null);
                setError(null);
                setFieldErrors(null);
              }}
              className="secondary-button text-lg"
            >
              Formu temizle
            </button>
          </div>

          {error ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-base text-rose-900">
              <p className="font-semibold">İstek tamamlanamadı</p>
              <p className="mt-3 leading-8">{displayError}</p>
              {fieldErrors ? (
                <ul className="mt-4 space-y-2">
                  {Object.entries(fieldErrors).map(([field, messages]) => (
                    <li key={field}>
                      <span className="font-medium">{field}</span>: {messages.join(" ")}
                    </li>
                  ))}
                </ul>
              ) : null}
              {hasConfigError ? (
                <p className="mt-3 leading-8">
                  Sistem bağlantısı kurulmadan bu test canlıya alınmamalı.
                </p>
              ) : null}
            </div>
          ) : null}

          {result && decisionView ? (
            <section className={`mt-6 rounded-3xl border p-6 ${statusTone[result.status]}`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                    {statusLabelCopy[result.status]}
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold">{decisionView.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-8">{decisionView.summary}</p>
                </div>

                <div className="rounded-2xl bg-white/80 px-4 py-3 text-base font-medium">
                  {statusBadgeCopy[result.status]}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="text-lg font-semibold">Bu sonuç ne anlatıyor?</h3>
                  {decisionView.primaryReason ? (
                    <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 p-4">
                      <p className="text-base font-medium">{decisionView.primaryReason.title}</p>
                      <p className="mt-2 text-base leading-8">{decisionView.primaryReason.body}</p>
                    </div>
                  ) : null}

                  <ExplanationList title="Diğer açıklamalar" items={decisionView.secondaryReasons} />
                  <ExplanationList
                    title="Tamamlanması iyi olacak bilgiler"
                    items={decisionView.missingInformation}
                  />
                </div>

                <div className="rounded-2xl bg-white/70 p-5">
                  <h3 className="text-lg font-semibold">{decisionView.nextStepTitle}</h3>
                  <p className="mt-3 text-base leading-8">{decisionView.nextStepBody}</p>

                  {decisionView.paymentSummary ? (
                    <div className="mt-4 rounded-2xl border border-white/70 bg-white/70 p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                        Ödeme profili
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{decisionView.paymentSummary}</p>
                      {decisionView.paymentDetail ? (
                        <p className="mt-2 text-base leading-8">{decisionView.paymentDetail}</p>
                      ) : null}
                    </div>
                  ) : null}

                  <GuidanceLinks items={decisionView.helperLinks} />
                </div>
              </div>

              {result.disclaimer ? (
                <p className="mt-6 text-sm leading-7 text-slate-700">{result.disclaimer}</p>
              ) : null}

              <ToolGuidanceSurface model={guidanceModel} tool="birth-grant" />
            </section>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Kısa not</h2>
            <p className="mt-3 text-base leading-8 text-slate-700">
              Bu test resmî kurum kararı yerine geçmez. Özellikle vatandaşlık, ikamet
              ve doğum kaydı gibi bilgiler resmî başvuru sırasında yeniden kontrol edilir.
            </p>
          </div>

          <div className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Hazırlık listesi</h2>
            <ul className="mt-3 space-y-3 text-base leading-8 text-slate-700">
              <li>Doğum tarihini doğru girin.</li>
              <li>KPS kaydının tamamlanıp tamamlanmadığını kontrol edin.</li>
              <li>Kaçıncı çocuk olduğunu doğru seçin.</li>
            </ul>
          </div>

          <div className="card-panel">
            <h2 className="text-xl font-semibold text-slate-950">Diğer testler</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/" className="secondary-link inline-flex text-base">
                Diğer testlere dön
              </Link>
              <Link href="/gss-gelir-testi" className="secondary-link inline-flex text-base">
                GSS testini aç
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
