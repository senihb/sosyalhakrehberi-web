import type { EligibilityCheckRequest } from "@/lib/types";

export type TriStateAttestation = true | false | null;
export type BirthGrantChildOrder = "1" | "2" | "3+";

export type BirthGrantFormState = {
  childIsLiveBirth: TriStateAttestation;
  childBirthDate: string;
  childOrder: BirthGrantChildOrder | "";
  applicantIsTurkishCitizen: TriStateAttestation;
  applicantResidesInTr: TriStateAttestation;
  childResidesInTr: TriStateAttestation;
  childIsKpsRegistered: TriStateAttestation;
  childIsAlive: TriStateAttestation;
};

export const initialBirthGrantFormState: BirthGrantFormState = {
  childIsLiveBirth: null,
  childBirthDate: "",
  childOrder: "",
  applicantIsTurkishCitizen: null,
  applicantResidesInTr: null,
  childResidesInTr: null,
  childIsKpsRegistered: null,
  childIsAlive: null,
};

function mapChildOrderToPreviousCount(value: BirthGrantChildOrder | ""): number | null {
  if (value === "1") {
    return 0;
  }

  if (value === "2") {
    return 1;
  }

  if (value === "3+") {
    return 2;
  }

  return null;
}

export function buildBirthGrantPayload(
  form: BirthGrantFormState,
  requestId: string,
): EligibilityCheckRequest {
  const facts: EligibilityCheckRequest["facts"] = {};

  if (form.childIsLiveBirth !== null) {
    facts.child_is_live_birth = form.childIsLiveBirth;
  }

  if (form.childBirthDate.trim()) {
    facts.child_birth_date = form.childBirthDate;
  }

  const previousLiveChildrenCount = mapChildOrderToPreviousCount(form.childOrder);
  if (previousLiveChildrenCount !== null) {
    facts.previous_live_children_count = previousLiveChildrenCount;
  }

  if (form.applicantIsTurkishCitizen !== null) {
    facts.applicant_is_turkish_citizen = form.applicantIsTurkishCitizen;
  }

  if (form.applicantResidesInTr !== null) {
    facts.applicant_resides_in_tr = form.applicantResidesInTr;
  }

  if (form.childResidesInTr !== null) {
    facts.child_resides_in_tr = form.childResidesInTr;
  }

  if (form.childIsKpsRegistered !== null) {
    facts.child_is_kps_registered = form.childIsKpsRegistered;
  }

  if (form.childIsAlive !== null) {
    facts.child_is_alive = form.childIsAlive;
  }

  return {
    benefit_code: "TR_BIRTH_GRANT",
    facts,
    context: {
      jurisdiction: "TR",
      request_id: requestId,
    },
  };
}

