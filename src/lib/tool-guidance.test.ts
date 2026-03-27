import test from "node:test";
import assert from "node:assert/strict";
import { getToolGuidanceModel } from "./tool-guidance.ts";

test("returns existing Home Care guides and other tool links", () => {
  const model = getToolGuidanceModel("home-care");

  assert.equal(model.relatedGuides[0]?.href, "/evde-bakim-maasi");
  assert.equal(model.otherTests[0]?.href, "/gss-gelir-testi");
});

test("returns a dedicated GSS companion guide", () => {
  const model = getToolGuidanceModel("gss");

  assert.equal(model.relatedGuides[0]?.href, "/gss-gelir-testi/rehber");
});

test("returns a dedicated old-age companion guide", () => {
  const model = getToolGuidanceModel("old-age");

  assert.equal(model.relatedGuides[0]?.href, "/65-yas-ayligi-uygunluk-testi/rehber");
});

test("returns filled guidance destinations for birth grant", () => {
  const model = getToolGuidanceModel("birth-grant");

  assert.equal(model.relatedGuides[0]?.href, "/dogum-yardimi-uygunluk-testi/rehber");
  assert.equal(model.relatedGuides[1]?.href, "/dogum-yardimi-uygunluk-testi/e-devlet-basvurusu");
  assert.equal(model.relatedGuides[2]?.href, "/dogum-yardimi-uygunluk-testi/odeme-takvimi");
  assert.equal(model.relatedGuides[3]?.href, "/dogum-yardimi-uygunluk-testi/sss");
});

