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

  return null;
}
