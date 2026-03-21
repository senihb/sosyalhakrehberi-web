import assert from "node:assert/strict";
import test from "node:test";
import { getHomeCareFormFieldErrors } from "./home-care-form-validation.ts";

test("requires the report rate for the home care form", () => {
  assert.deepEqual(getHomeCareFormFieldErrors({ disabilityRate: "" }), {
    care_recipient_disability_rate: ["Sağlık raporundaki oran zorunludur."],
  });
});

test("returns no field errors when the report rate is provided", () => {
  assert.equal(getHomeCareFormFieldErrors({ disabilityRate: "75" }), null);
});
