import assert from "node:assert/strict";
import test from "node:test";
import {
  getHomeCareFieldLabel,
  getHomeCareStatusLabel,
  getHomeCareVisitorErrorMessage,
  getHomeCareVisitorFieldMessages,
} from "./home-care-visitor-copy.ts";

test("maps backend home care field keys into Turkish visitor labels", () => {
  assert.equal(
    getHomeCareFieldLabel("care_dependency_status"),
    "Tam bağımlılık durumu",
  );
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

test("translates invalid payload errors into Turkish visitor copy", () => {
  assert.equal(
    getHomeCareVisitorErrorMessage("The request payload is invalid.", 422),
    "Gönderilen bilgiler güncel değerlendirme kurallarına uymuyor. Lütfen alanları gözden geçirip yeniden deneyin.",
  );
});

test("translates technical field-level allowlist errors", () => {
  assert.deepEqual(
    getHomeCareVisitorFieldMessages("care_dependency_status", [
      "This fact is not allowed for the requested benefit.",
    ]),
    [
      "Tam bağımlılık durumu şu anda bu ön değerlendirmede kullanılamıyor. Lütfen bilgileri gözden geçirip yeniden deneyin.",
    ],
  );
});
