import assert from "node:assert/strict";
import test from "node:test";
import {
  getHomeCareFieldLabel,
  getHomeCareStatusLabel,
} from "./home-care-visitor-copy.ts";

test("maps backend home care field keys into Turkish visitor labels", () => {
  assert.equal(getHomeCareFieldLabel("care_dependency_status"), "Tam bağımlılık durumu");
  assert.equal(
    getHomeCareFieldLabel("has_valid_foreigner_identity_number"),
    "Geçerli yabancı kimlik numarası",
  );
});

test("falls back safely for unknown field keys", () => {
  assert.equal(getHomeCareFieldLabel("unknown_backend_field"), "İlgili bilgi alanı");
});

test("maps eligibility statuses into visitor-safe Turkish labels", () => {
  assert.equal(getHomeCareStatusLabel("ELIGIBLE"), "Uygun görünüyor");
  assert.equal(getHomeCareStatusLabel("NOT_ELIGIBLE"), "Uygun görünmüyor");
  assert.equal(getHomeCareStatusLabel("NEEDS_INFO"), "Ek bilgi gerekli");
});
