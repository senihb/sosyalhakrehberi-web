"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ToolGuidanceSurface } from "@/components/ToolGuidanceSurface";
import { ApiClientError, checkEligibility } from "@/lib/api";
import {
  birthGrantFaqItems,
  birthGrantGuideSections,
  birthGrantPageInfoBlocks,
  birthGrantScenarioItems,
} from "@/lib/birth-grant-content";
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

const statusLabelCopy: Record<EligibilityStatus, string> = {
  ELIGIBLE: "Uygun görünüyor",
  NOT_ELIGIBLE: "Uygun görünmüyor",
  NEEDS_INFO: "Daha fazla bilgi gerekli",
};

const triStateOptions: Array<{ label: string; value: TriStateAttestation }> = [
  { label: "Evet", value: true },
  { label: "Hayır", value: false },
  { label: "Emin değilim", value: null },
];

const childOrderOptions: Array<{ label: string; value: BirthGrantChildOrder }> = [
  { label: "1. çocuk", value: "1" },
  { label: "2. çocuk", value: "2" },
  { label: "3 veya daha fazla", value: "3+" },
];

type WizardStepId =
  | "childIsLiveBirth"
  | "childBirthDate"
  | "childOrder"
  | "applicantIsTurkishCitizen"
  | "applicantResidesInTr"
  | "childResidesInTr"
  | "childIsKpsRegistered"
  | "childIsAlive"
  | "review";

type WizardStep = {
  id: WizardStepId;
  title: string;
  summary: string;
};

type TriStateFieldProps = {
  legend: string;
  name: string;
  value: TriStateAttestation;
  onChange: (value: TriStateAttestation) => void;
  helperText?: string;
};

const fieldLabelMap: Record<string, string> = {
  child_is_live_birth: "Çocuk doğdu mu?",
  child_birth_date: "Doğum tarihi",
  previous_live_children_count: "Bu çocuk kaçıncı çocuk?",
  applicant_is_turkish_citizen: "Başvuruyu yapacak kişi T.C. vatandaşı mı?",
  applicant_resides_in_tr: "Başvuruyu yapacak kişi Türkiye'de ikamet ediyor mu?",
  child_resides_in_tr: "Çocuk Türkiye'de ikamet ediyor mu?",
  child_is_kps_registered: "Çocuğun KPS kaydı tamamlandı mı?",
  child_is_alive: "Çocuk başvuru anında sağ mı?",
};

function buildWizardSteps(form: BirthGrantFormState): WizardStep[] {
  const steps: WizardStep[] = [
    {
      id: "childIsLiveBirth",
      title: "Doğum durumu",
      summary: "Canlı doğum bilgisini seçin.",
    },
  ];

  if (form.childIsLiveBirth === true) {
    steps.push({
      id: "childBirthDate",
      title: "Doğum tarihi",
      summary: "Doğum tarihini girin ya da bilmiyorsanız bunu belirtin.",
    });
  }

  steps.push(
    {
      id: "childOrder",
      title: "Çocuk sırası",
      summary: "Bu çocuğun sırasını seçin.",
    },
    {
      id: "applicantIsTurkishCitizen",
      title: "Vatandaşlık",
      summary: "Başvuruyu yapacak kişi için vatandaşlık bilgisini seçin.",
    },
    {
      id: "applicantResidesInTr",
      title: "Başvuru sahibinin ikameti",
      summary: "Başvuruyu yapacak kişinin Türkiye'de yaşayıp yaşamadığını seçin.",
    },
    {
      id: "childResidesInTr",
      title: "Çocuğun ikameti",
      summary: "Çocuğun Türkiye'de yaşayıp yaşamadığını seçin.",
    },
    {
      id: "childIsKpsRegistered",
      title: "KPS kaydı",
      summary: "Doğum bilgisinin nüfus sistemine işlenip işlenmediğini seçin.",
    },
    {
      id: "childIsAlive",
      title: "Başvuru anındaki durum",
      summary: "Çocuğun başvuru anındaki durumunu seçin.",
    },
    {
      id: "review",
      title: "Son kontrol",
      summary: "Bilgileri gözden geçirip değerlendirmeyi başlatın.",
    },
  );

  return steps;
}

function getStepReadyState(
  stepId: WizardStepId,
  touchedSteps: Partial<Record<WizardStepId, boolean>>,
): boolean {
  if (stepId === "review") {
    return true;
  }

  return Boolean(touchedSteps[stepId]);
}

function formatTriStateValue(value: TriStateAttestation): string {
  if (value === true) {
    return "Evet";
  }

  if (value === false) {
    return "Hayır";
  }

  return "Emin değilim";
}

function formatChildOrderValue(value: BirthGrantChildOrder | ""): string {
  if (value === "1") {
    return "1. çocuk";
  }

  if (value === "2") {
    return "2. çocuk";
  }

  if (value === "3+") {
    return "3 veya daha fazla";
  }

  return "Emin değilim";
}

function buildReviewRows(form: BirthGrantFormState): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [
    {
      label: "Çocuk doğdu mu?",
      value: formatTriStateValue(form.childIsLiveBirth),
    },
  ];

  if (form.childIsLiveBirth === true) {
    rows.push({
      label: "Doğum tarihi",
      value: form.childBirthDate || "Emin değilim",
    });
  }

  rows.push(
    {
      label: "Bu çocuk kaçıncı çocuk?",
      value: formatChildOrderValue(form.childOrder),
    },
    {
      label: "Başvuruyu yapacak kişi T.C. vatandaşı mı?",
      value: formatTriStateValue(form.applicantIsTurkishCitizen),
    },
    {
      label: "Başvuruyu yapacak kişi Türkiye'de ikamet ediyor mu?",
      value: formatTriStateValue(form.applicantResidesInTr),
    },
    {
      label: "Çocuk Türkiye'de ikamet ediyor mu?",
      value: formatTriStateValue(form.childResidesInTr),
    },
    {
      label: "Çocuğun KPS kaydı tamamlandı mı?",
      value: formatTriStateValue(form.childIsKpsRegistered),
    },
    {
      label: "Çocuk başvuru anında sağ mı?",
      value: formatTriStateValue(form.childIsAlive),
    },
  );

  return rows;
}

function TriStateField({ legend, name, value, onChange, helperText }: TriStateFieldProps) {
  return (
    <fieldset>
      <legend className="text-xl font-semibold text-slate-950">{legend}</legend>
      {helperText ? <p className="mt-3 text-base leading-8 text-slate-600">{helperText}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        {triStateOptions.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={`${name}-${option.label}`}
              className={`inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border px-5 py-3 text-base transition ${
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

function HintDisclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900">
        {title}
      </summary>
      <div className="mt-3 text-sm leading-7 text-slate-700">{children}</div>
    </details>
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
    <section className="rounded-3xl bg-white/70 p-5">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <ul className="mt-4 space-y-4 text-base leading-8 text-slate-700">
        {items.map((item) => (
          <li key={`${item.title}-${item.body}`} className="rounded-2xl bg-white/80 p-4">
            <p className="font-semibold text-slate-950">{item.title}</p>
            <p className="mt-2">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [touchedSteps, setTouchedSteps] = useState<Partial<Record<WizardStepId, boolean>>>({});
  const [stepNotice, setStepNotice] = useState<string | null>(null);
  const analyticsRef = useRef(createToolAnalyticsSession("birth-grant"));

  const steps = useMemo(() => buildWizardSteps(form), [form]);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    analyticsRef.current.trackOpened();
  }, []);

  useEffect(() => {
    if (!result) {
      return;
    }

    analyticsRef.current.trackResultReceived(result.decision_id, result.status);
  }, [result]);

  useEffect(() => {
    if (currentStepIndex > steps.length - 1) {
      setCurrentStepIndex(steps.length - 1);
    }
  }, [currentStepIndex, steps.length]);

  const guidanceModel = getToolGuidanceModel("birth-grant");
  const hasConfigError = Boolean(error?.includes("NEXT_PUBLIC_API_BASE_URL"));
  const displayError = hasConfigError
    ? "Değerlendirme sistemi şu anda hazır değil. Lütfen daha sonra tekrar deneyin."
    : error;

  const decisionView = result
    ? buildBirthGrantDecisionViewModel({
        status: result.status,
        reasons: result.reasons,
        missingFacts: result.missing_facts,
        guidanceItems: result.guidance_items,
        benefitDetails: result.benefit_details,
        metadata: result.metadata,
        userMessage: result.user_message,
        disclaimer: result.disclaimer,
      })
    : null;

  const reviewRows = useMemo(() => buildReviewRows(form), [form]);

  const markFormStarted = () => {
    analyticsRef.current.trackFormStarted();
  };

  const markStepTouched = (stepId: WizardStepId) => {
    setTouchedSteps((current) => ({
      ...current,
      [stepId]: true,
    }));
  };

  const handleBack = () => {
    setStepNotice(null);
    setCurrentStepIndex((current) => Math.max(0, current - 1));
  };

  const handleNext = () => {
    if (!currentStep) {
      return;
    }

    if (!getStepReadyState(currentStep.id, touchedSteps)) {
      setStepNotice(
        currentStep.id === "childBirthDate"
          ? "Tarihi biliyorsanız girin. Emin değilseniz 'Tarihi bilmiyorum' düğmesini seçin."
          : "Emin değilseniz 'Emin değilim' seçeneğini işaretleyerek devam edebilirsiniz.",
      );
      return;
    }

    setStepNotice(null);
    setCurrentStepIndex((current) => Math.min(steps.length - 1, current + 1));
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

  const resetForm = () => {
    setForm(initialBirthGrantFormState);
    setResult(null);
    setError(null);
    setFieldErrors(null);
    setTouchedSteps({});
    setCurrentStepIndex(0);
    setStepNotice(null);
  };

  const renderStepBody = () => {
    if (!currentStep) {
      return null;
    }

    switch (currentStep.id) {
      case "childIsLiveBirth":
        return (
          <TriStateField
            legend="Çocuk doğdu mu?"
            name="childIsLiveBirth"
            value={form.childIsLiveBirth}
            helperText="Bu test, canlı doğum bilgisini baştan netleştirerek ilerler."
            onChange={(value) => {
              markFormStarted();
              markStepTouched("childIsLiveBirth");
              setForm((current) => ({
                ...current,
                childIsLiveBirth: value,
                childBirthDate: value === true ? current.childBirthDate : "",
              }));
            }}
          />
        );

      case "childBirthDate":
        return (
          <div className="space-y-5">
            <label className="form-field text-lg">
              <span>Çocuğun doğum tarihi</span>
              <input
                className="min-h-14 text-lg"
                type="date"
                value={form.childBirthDate}
                onChange={(event) => {
                  markFormStarted();
                  markStepTouched("childBirthDate");
                  setForm((current) => ({
                    ...current,
                    childBirthDate: event.target.value,
                  }));
                }}
              />
            </label>

            <button
              type="button"
              className="secondary-button text-base"
              onClick={() => {
                markFormStarted();
                markStepTouched("childBirthDate");
                setForm((current) => ({
                  ...current,
                  childBirthDate: "",
                }));
              }}
            >
              Tarihi bilmiyorum
            </button>
          </div>
        );

      case "childOrder":
        return (
          <div className="space-y-5">
            <fieldset>
              <legend className="text-xl font-semibold text-slate-950">
                Bu çocuk kaçıncı çocuk?
              </legend>
              <p className="mt-3 text-base leading-8 text-slate-600">
                İlk çocuk, ikinci çocuk ya da üçüncü çocuk ve üzeri bilgisini seçin.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {childOrderOptions.map((option) => {
                  const checked = form.childOrder === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border px-5 py-3 text-base transition ${
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
                          markStepTouched("childOrder");
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

                <button
                  type="button"
                  className={`inline-flex min-h-12 items-center rounded-full border px-5 py-3 text-base transition ${
                    touchedSteps.childOrder && form.childOrder === ""
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-800 hover:border-slate-400"
                  }`}
                  onClick={() => {
                    markFormStarted();
                    markStepTouched("childOrder");
                    setForm((current) => ({
                      ...current,
                      childOrder: "",
                    }));
                  }}
                >
                  Emin değilim
                </button>
              </div>
            </fieldset>

            <div className="space-y-3">
              <HintDisclosure title="Çocuk sırası nasıl anlaşılır?">
                Aynı anne için canlı doğum sırasına bakılır. Emin değilseniz nüfus kaydı veya aile
                içindeki doğum sırasını kontrol ederek ilerleyin.
              </HintDisclosure>
              <HintDisclosure title="Çoğul doğum varsa neye dikkat edilir?">
                İkiz veya çoğul doğum gibi durumlarda sıra bilgisini resmi kayıt ve başvuru
                açıklamasıyla birlikte kontrol etmek daha güvenlidir.
              </HintDisclosure>
            </div>
          </div>
        );

      case "applicantIsTurkishCitizen":
        return (
          <div className="space-y-5">
            <TriStateField
              legend="Başvuruyu yapacak kişi T.C. vatandaşı mı?"
              name="applicantIsTurkishCitizen"
              value={form.applicantIsTurkishCitizen}
              onChange={(value) => {
                markFormStarted();
                markStepTouched("applicantIsTurkishCitizen");
                setForm((current) => ({
                  ...current,
                  applicantIsTurkishCitizen: value,
                }));
              }}
            />

            <div className="space-y-3">
              <HintDisclosure title="Baba üzerinden başvuru olabilir mi?">
                Bazı başvurularda anne yerine baba üzerinden işlem yapılabilir. Böyle bir özel durum
                varsa resmi başvuru yolundaki güncel açıklamayı ayrıca kontrol edin.
              </HintDisclosure>
              <HintDisclosure title="Yasal temsilci ya da vasi başvurusu nedir?">
                Başvuruyu hak sahibi yerine yasal temsilci yapıyorsa kurum ek belge isteyebilir.
                Sonuç ekranındaki yönlendirmeleri bu nedenle dikkatle okuyun.
              </HintDisclosure>
              <HintDisclosure title="Evlat edinme durumunda ne olur?">
                Evlat edinme gibi özel durumlarda başvuru yolu farklılaşabilir. Bu test yalnız ön
                değerlendirme verir; resmi inceleme ayrıca yapılır.
              </HintDisclosure>
            </div>
          </div>
        );

      case "applicantResidesInTr":
        return (
          <TriStateField
            legend="Başvuruyu yapacak kişi Türkiye'de ikamet ediyor mu?"
            name="applicantResidesInTr"
            value={form.applicantResidesInTr}
            onChange={(value) => {
              markFormStarted();
              markStepTouched("applicantResidesInTr");
              setForm((current) => ({
                ...current,
                applicantResidesInTr: value,
              }));
            }}
          />
        );

      case "childResidesInTr":
        return (
          <TriStateField
            legend="Çocuk Türkiye'de ikamet ediyor mu?"
            name="childResidesInTr"
            value={form.childResidesInTr}
            onChange={(value) => {
              markFormStarted();
              markStepTouched("childResidesInTr");
              setForm((current) => ({
                ...current,
                childResidesInTr: value,
              }));
            }}
          />
        );

      case "childIsKpsRegistered":
        return (
          <div className="space-y-4">
            <TriStateField
              legend="Çocuğun KPS kaydı tamamlandı mı?"
              name="childIsKpsRegistered"
              value={form.childIsKpsRegistered}
              helperText="KPS kaydı, doğum bilgisinin nüfus sistemine işlendiğini gösterir."
              onChange={(value) => {
                markFormStarted();
                markStepTouched("childIsKpsRegistered");
                setForm((current) => ({
                  ...current,
                  childIsKpsRegistered: value,
                }));
              }}
            />
            <HintDisclosure title="KPS kaydı neden soruluyor?">
              Doğum kaydı nüfus sistemine işlendiğinde başvuru kanalı daha net anlaşılır. Emin
              değilseniz bu bilgiyi sonradan da netleştirebilirsiniz.
            </HintDisclosure>
          </div>
        );

      case "childIsAlive":
        return (
          <TriStateField
            legend="Çocuk başvuru anında sağ mı?"
            name="childIsAlive"
            value={form.childIsAlive}
            onChange={(value) => {
              markFormStarted();
              markStepTouched("childIsAlive");
              setForm((current) => ({
                ...current,
                childIsAlive: value,
              }));
            }}
          />
        );

      case "review":
        return (
          <div className="space-y-4">
            <p className="text-base leading-8 text-slate-700">
              Aşağıdaki özet yalnız girdiğiniz bilgileri gösterir. Son kararı sistem ve ilgili kurum
              incelemesi verir.
            </p>
            <div className="grid gap-3">
              {reviewRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium text-slate-700">{row.label}</span>
                  <span className="text-base font-semibold text-slate-950">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="card-panel">
          <p className="eyebrow">Doğum Yardımı</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Doğum yardımı için adım adım ön değerlendirme
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-9 text-slate-700">
            Bu sayfa, başvurunun ilk bakışta açık görünüp görünmediğini anlamanıza yardım eder.
            Resmi karar vermez; hangi bilgiye bakmanız gerektiğini ve sıradaki adımı anlatır.
          </p>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-base leading-8 text-slate-700">
            Bu sonuç ön değerlendirme niteliğindedir; nihai değerlendirme ilgili kurumun
            incelemesine göre belirlenir.
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-8">
            {!result ? (
              <section className="card-panel">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Adım {currentStepIndex + 1} / {steps.length}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                        {currentStep?.title}
                      </h2>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      {currentStep?.summary}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {steps.map((step, index) => {
                      const isActive = index === currentStepIndex;
                      const isDone = index < currentStepIndex;

                      return (
                        <div
                          key={step.id}
                          className={`h-2 flex-1 rounded-full ${
                            isActive || isDone ? "bg-slate-900" : "bg-slate-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                  {renderStepBody()}

                  {stepNotice ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
                      {stepNotice}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStepIndex === 0}
                        className="secondary-button text-base disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Geri
                      </button>
                      <button type="button" onClick={resetForm} className="secondary-button text-base">
                        Formu temizle
                      </button>
                    </div>

                    {currentStep?.id === "review" ? (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="primary-button text-base"
                      >
                        {isSubmitting ? "Değerlendiriliyor..." : "Ön değerlendirmeyi çalıştır"}
                      </button>
                    ) : (
                      <button type="button" onClick={handleNext} className="primary-button text-base">
                        Devam et
                      </button>
                    )}
                  </div>
                </div>

                {error ? (
                  <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-base text-rose-900">
                    <p className="font-semibold">İstek tamamlanamadı</p>
                    <p className="mt-3 leading-8">{displayError}</p>
                    {fieldErrors ? (
                      <ul className="mt-4 space-y-2">
                        {Object.entries(fieldErrors).map(([field, messages]) => (
                          <li key={field}>
                            <span className="font-medium">
                              {fieldLabelMap[field] ?? "İlgili bilgi alanı"}
                            </span>
                            : {messages.join(" ")}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {hasConfigError ? (
                      <p className="mt-3 leading-8">
                        Sistem bağlantısı kurulmadan bu test canlıya alınmamalıdır.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </section>
            ) : null}

            {result && decisionView ? (
              <section className={`card-panel border ${statusTone[result.status]}`}>
                <div className="flex flex-col gap-4 border-b border-white/70 pb-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                      {statusLabelCopy[result.status]}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-950">{decisionView.title}</h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
                      {decisionView.summary}
                    </p>
                  </div>
                  <button type="button" onClick={() => setResult(null)} className="secondary-button text-base">
                    Bilgileri yeniden gözden geçir
                  </button>
                </div>

                {decisionView.specialReviewNotes.length > 0 ? (
                  <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                      Ek belge veya inceleme gerekebilir
                    </p>
                    <div className="mt-4 space-y-3">
                      {decisionView.specialReviewNotes.map((item) => (
                        <div key={`${item.title}-${item.body}`} className="rounded-2xl bg-white/70 p-4">
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-2 text-base leading-8">{item.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <ExplanationList
                    title="Bu sonuç neden çıktı?"
                    items={
                      decisionView.primaryReason
                        ? [decisionView.primaryReason, ...decisionView.secondaryReasons]
                        : decisionView.secondaryReasons
                    }
                  />
                  <ExplanationList
                    title="Eksik ya da kritik bilgiler"
                    items={decisionView.missingInformation}
                  />
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                  <section className="rounded-3xl bg-white/70 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">Şimdi ne yapmalısınız?</h3>
                    <p className="mt-3 text-base leading-8 text-slate-700">{decisionView.nextStepBody}</p>

                    {decisionView.applicationPathHint ? (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Başvuru yolu
                        </p>
                        <p className="mt-2 text-base leading-8 text-slate-700">
                          {decisionView.applicationPathHint}
                        </p>
                      </div>
                    ) : null}

                    <GuidanceLinks items={decisionView.helperLinks} />
                  </section>

                  <section className="rounded-3xl bg-white/70 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">Ödeme profili</h3>
                    {decisionView.paymentSummary ? (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
                        <p className="text-2xl font-semibold text-slate-950">
                          {decisionView.paymentSummary}
                        </p>
                        {decisionView.paymentDetail ? (
                          <p className="mt-2 text-base leading-8 text-slate-700">
                            {decisionView.paymentDetail}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mt-4 text-base leading-8 text-slate-700">
                        Bu aşamada net bir ödeme profili gösterilemiyor. Sonuç ekranındaki yönlendirme
                        ve resmi başvuru yolunu birlikte okuyun.
                      </p>
                    )}

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                      {decisionView.trustNote}
                    </div>
                  </section>
                </div>

                <ToolGuidanceSurface model={guidanceModel} tool="birth-grant" showNextStep={false} />
              </section>
            ) : null}

            <section className="card-panel">
              <h2 className="text-2xl font-semibold text-slate-950">Doğum yardımı testi hakkında kısa bilgiler</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {birthGrantPageInfoBlocks.map((block) => (
                  <article key={block.title} className="rounded-3xl bg-slate-50 p-5">
                    <h3 className="text-lg font-semibold text-slate-950">{block.title}</h3>
                    <p className="mt-3 text-base leading-8 text-slate-700">{block.body}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <article className="rounded-3xl bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-950">Sık sorulan sorular</h3>
                  <div className="mt-4 space-y-3">
                    {birthGrantFaqItems.map((item) => (
                      <details key={item.question} className="rounded-2xl bg-white p-4">
                        <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">
                          {item.question}
                        </summary>
                        <p className="mt-3 text-base leading-8 text-slate-700">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl bg-slate-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-950">Örnek senaryolar</h3>
                  <div className="mt-4 space-y-3">
                    {birthGrantScenarioItems.map((item) => (
                      <div key={item.title} className="rounded-2xl bg-white p-4">
                        <p className="font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-2 text-base leading-8 text-slate-700">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </section>
          </section>

          <aside className="space-y-6">
            <div className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">Bu testte hangi bilgiler kullanılır?</h2>
              <ul className="mt-4 space-y-3 text-base leading-8 text-slate-700">
                {birthGrantGuideSections.map((section) => (
                  <li key={section.title}>
                    <span className="font-semibold text-slate-950">{section.title}</span>
                    <p className="mt-1">{section.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-panel">
              <h2 className="text-xl font-semibold text-slate-950">Hazırlık listesi</h2>
              <ul className="mt-4 space-y-3 text-base leading-8 text-slate-700">
                <li>Doğum tarihini biliyorsanız doğru girin.</li>
                <li>KPS kaydının tamamlanıp tamamlanmadığını kontrol edin.</li>
                <li>Çocuk sırasından emin değilseniz resmi kaydı gözden geçirin.</li>
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
      </div>
    </main>
  );
}

