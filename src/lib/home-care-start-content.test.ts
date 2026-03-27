import test from "node:test";
import assert from "node:assert/strict";
import { homeCareStartContent } from "./home-care-start-content.ts";

test("home care start content stays within the pre-flight scope", () => {
  assert.equal(homeCareStartContent.eyebrow, "Başlangıç");
  assert.equal(homeCareStartContent.checklist.length, 3);
  assert.equal(homeCareStartContent.primaryHref, "/evde-bakim-maasi/hesaplama");
  assert.equal(homeCareStartContent.secondaryHref, "/methodology");
  assert.match(homeCareStartContent.disclaimerBody.join(" "), /resmî karar vermez/i);
});

