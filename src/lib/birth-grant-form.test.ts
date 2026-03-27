import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBirthGrantPayload,
  initialBirthGrantFormState,
  type BirthGrantFormState,
} from "./birth-grant-form.ts";

function makeFormState(
  overrides: Partial<BirthGrantFormState> = {},
): BirthGrantFormState {
  return {
    ...initialBirthGrantFormState,
    childIsLiveBirth: true,
    childBirthDate: "2026-02-10",
    childOrder: "2",
    applicantIsTurkishCitizen: true,
    applicantResidesInTr: true,
    childResidesInTr: true,
    childIsKpsRegistered: true,
    childIsAlive: true,
    ...overrides,
  };
}

test("buildBirthGrantPayload maps the expected backend facts", () => {
  const payload = buildBirthGrantPayload(makeFormState(), "req-birth-grant");

  assert.deepEqual(payload, {
    benefit_code: "TR_BIRTH_GRANT",
    facts: {
      child_is_live_birth: true,
      child_birth_date: "2026-02-10",
      previous_live_children_count: 1,
      applicant_is_turkish_citizen: true,
      applicant_resides_in_tr: true,
      child_resides_in_tr: true,
      child_is_kps_registered: true,
      child_is_alive: true,
    },
    context: {
      jurisdiction: "TR",
      request_id: "req-birth-grant",
    },
  });
});

test("buildBirthGrantPayload omits unknown tri-state answers", () => {
  const payload = buildBirthGrantPayload(
    makeFormState({
      applicantIsTurkishCitizen: null,
      applicantResidesInTr: null,
      childResidesInTr: null,
      childIsKpsRegistered: null,
      childIsAlive: null,
      childOrder: "",
    }),
    "req-birth-grant-unknown",
  );

  assert.equal("applicant_is_turkish_citizen" in payload.facts, false);
  assert.equal("applicant_resides_in_tr" in payload.facts, false);
  assert.equal("child_resides_in_tr" in payload.facts, false);
  assert.equal("child_is_kps_registered" in payload.facts, false);
  assert.equal("child_is_alive" in payload.facts, false);
  assert.equal("previous_live_children_count" in payload.facts, false);
});

