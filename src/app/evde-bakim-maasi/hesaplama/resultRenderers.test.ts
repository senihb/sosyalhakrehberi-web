import test from "node:test";
import assert from "node:assert/strict";
import {
  formatEvaluationDateTR,
  getWhyFallbackCopy,
  groupMissingFactsByFactGroup,
  isValidHttpUrl,
  normalizeMissingFacts,
  normalizeReasons,
  normalizeRuleResults,
} from "./resultRenderers.ts";

test("normalizeReasons preserves backend order by default", () => {
  const reasons = [
    { code: "B", message: "ikinci", severity: "INFO" },
    { code: "A", message: "birinci", severity: "ERROR" },
  ];

  assert.deepEqual(normalizeReasons(reasons), reasons);
});

test("normalizeMissingFacts sorts by priority when present", () => {
  const facts = [
    { key: "two", message: "two", priority: 2 },
    { key: "one", message: "one", priority: 1 },
  ];

  const normalized = normalizeMissingFacts(facts);
  assert.equal(normalized[0]?.key, "one");
  assert.equal(normalized[1]?.key, "two");
});

test("groupMissingFactsByFactGroup falls back to Diğer", () => {
  const grouped = groupMissingFactsByFactGroup([
    { key: "a", message: "A", fact_group: "Gelir" },
    { key: "b", message: "B" },
  ]);

  assert.equal(grouped.length, 2);
  assert.equal(grouped[0]?.groupLabel, "Diğer");
  assert.equal(grouped[1]?.groupLabel, "Gelir");
});

test("normalizeRuleResults supports both array and record payloads", () => {
  const arrayRules = [{ rule_code: "A", passed: true, message: "ok" }];
  const recordRules = {
    A: { rule_code: "A", passed: false, message: "fail" },
  };

  assert.equal(normalizeRuleResults(arrayRules).length, 1);
  assert.equal(normalizeRuleResults(recordRules).length, 1);
});

test("formatEvaluationDateTR returns null for invalid dates", () => {
  assert.equal(formatEvaluationDateTR(null), null);
  assert.equal(formatEvaluationDateTR("not-a-date"), null);
});

test("fallback copy and URL validation are safe", () => {
  assert.match(getWhyFallbackCopy(), /ayrıntılı gerekçe/i);
  assert.equal(isValidHttpUrl("https://example.com"), true);
  assert.equal(isValidHttpUrl("ftp://example.com"), false);
});

