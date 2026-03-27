import test from "node:test";
import assert from "node:assert/strict";
import { homeCareMethodologyContent } from "./methodology-content.ts";

test("home care methodology content remains guidance-only and Turkish-first", () => {
  assert.equal(homeCareMethodologyContent.eyebrow, "Yöntem ve Sınırlar");
  assert.equal(homeCareMethodologyContent.sections.length >= 4, true);
  assert.match(homeCareMethodologyContent.disclaimer, /resmî karar vermez/i);
  assert.equal(
    homeCareMethodologyContent.links.some(
      (link) => link.href === "/evde-bakim-maasi/hesaplama",
    ),
    true,
  );
});

