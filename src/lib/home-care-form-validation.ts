import type { EligibilityFormState } from "@/lib/eligibility-form";

export function getHomeCareFormFieldErrors(
  form: Pick<EligibilityFormState, "disabilityRate">,
): Record<string, string[]> | null {
  const disabilityRate = form.disabilityRate.trim();

  if (!disabilityRate) {
    return {
      care_recipient_disability_rate: ["Sağlık raporundaki oran zorunludur."],
    };
  }

  const numericRate = Number(disabilityRate);
  if (!Number.isFinite(numericRate) || numericRate < 50) {
    return {
      care_recipient_disability_rate: [
        "Evde bakım maaşı testi için en az %50 oran girebilirsiniz.",
      ],
    };
  }

  return null;
}

