import assert from "node:assert/strict";
import test from "node:test";
import { homeCareApplicationGuide } from "./home-care-application-guide.ts";

test("home care application guide stays preparation-oriented", () => {
  assert.match(homeCareApplicationGuide.title, /başvuru hazırlık rehberi/i);
  assert.ok(homeCareApplicationGuide.steps.length >= 3);
  assert.ok(homeCareApplicationGuide.documents.length >= 3);
  assert.match(homeCareApplicationGuide.caution, /resmî karar vermez/i);
});

