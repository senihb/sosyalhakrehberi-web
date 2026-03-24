import assert from "node:assert/strict";
import test from "node:test";
import {
  homepageChooseItems,
  homepageGuideLinks,
  homepageHero,
} from "./homepage-entry-content.ts";

test("homepage hero keeps a single primary entry CTA", () => {
  assert.equal(homepageHero.primaryCtaLabel, "Uygunluk testine başla");
  assert.equal(homepageHero.primaryCtaHref, "#durumunu-sec");
});

test("homepage choose section presents direct paths to current tools", () => {
  assert.equal(homepageChooseItems.length, 4);
  assert.ok(homepageChooseItems.every((item) => item.href.startsWith("/")));
  assert.ok(homepageChooseItems.every((item) => item.cta.length > 0));
});

test("homepage guides remain secondary support surfaces", () => {
  assert.ok(homepageGuideLinks.length >= 3);
  assert.ok(homepageGuideLinks.every((item) => item.href.startsWith("/")));
});
