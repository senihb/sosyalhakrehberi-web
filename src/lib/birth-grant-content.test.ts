import assert from "node:assert/strict";
import test from "node:test";
import {
  birthGrantEdevletGuide,
  birthGrantFaqItems,
  birthGrantGuideIntro,
  birthGrantGuideSections,
  birthGrantPageInfoBlocks,
  birthGrantPaymentCalendarGuide,
  birthGrantScenarioItems,
} from "./birth-grant-content.ts";

test("birth grant guide content stays guidance-oriented", () => {
  assert.match(birthGrantGuideIntro.title, /Doğum yardımı rehberi/i);
  assert.ok(birthGrantGuideSections.length >= 3);
  assert.ok(birthGrantGuideIntro.summary.includes("Resmi karar vermez"));
});

test("birth grant page helper blocks stay explanatory and calm", () => {
  assert.equal(birthGrantPageInfoBlocks.length, 3);
  assert.ok(birthGrantScenarioItems.length >= 3);
  assert.match(birthGrantPageInfoBlocks[1].title, /Bu test ne yapmaz/i);
});

test("birth grant faq content does not promise official approval", () => {
  assert.ok(birthGrantFaqItems.length >= 3);
  assert.ok(
    birthGrantFaqItems.some(
      (item) =>
        item.answer.includes("ön değerlendirme") ||
        item.answer.includes("Resmi başvuru"),
    ),
  );
});

test("birth grant action pages stay guidance-oriented", () => {
  assert.ok(birthGrantEdevletGuide.steps.length >= 3);
  assert.ok(birthGrantPaymentCalendarGuide.steps.length >= 3);
  assert.match(birthGrantEdevletGuide.note, /resmi/i);
  assert.match(birthGrantPaymentCalendarGuide.note, /yön gösterir/i);
});

