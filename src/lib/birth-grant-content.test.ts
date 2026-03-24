import assert from "node:assert/strict";
import test from "node:test";
import {
  birthGrantEdevletGuide,
  birthGrantFaqItems,
  birthGrantGuideIntro,
  birthGrantGuideSections,
  birthGrantPaymentCalendarGuide,
} from "./birth-grant-content.ts";

test("birth grant guide content stays guidance-oriented", () => {
  assert.match(birthGrantGuideIntro.title, /Doğum yardımı rehberi/i);
  assert.ok(birthGrantGuideSections.length >= 3);
  assert.ok(
    birthGrantGuideIntro.summary.includes("Resmî karar vermez"),
  );
});

test("birth grant faq content does not promise official approval", () => {
  assert.ok(birthGrantFaqItems.length >= 3);
  assert.ok(
    birthGrantFaqItems.some((item) =>
      item.answer.includes("ön değerlendirme") ||
      item.answer.includes("Resmî başvuru"),
    ),
  );
});

test("birth grant action pages stay guidance-oriented", () => {
  assert.ok(birthGrantEdevletGuide.steps.length >= 3);
  assert.ok(birthGrantPaymentCalendarGuide.steps.length >= 3);
  assert.match(birthGrantEdevletGuide.note, /resmî/i);
  assert.match(birthGrantPaymentCalendarGuide.note, /yön gösterir/i);
});
