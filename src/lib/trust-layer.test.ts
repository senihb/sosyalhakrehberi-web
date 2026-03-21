import test from "node:test";
import assert from "node:assert/strict";
import { buildTrustLayerModel } from "./trust-layer.ts";

test("builds a trust layer from backend metadata without exposing raw engine internals", () => {
  const trustLayer = buildTrustLayerModel({
    status: "ELIGIBLE",
    metadata: {
      engine_version: "1.2.3",
      evaluation_mode: "canonical",
      policy_code: "TR_HOME_CARE_ALLOWANCE",
      policy_version: "2026.03",
      jurisdiction: "TR",
      evaluation_date: "2026-03-19",
    },
  });

  assert.equal(trustLayer.heading, "Bu sonuç nasıl okunmalı?");
  assert.equal(trustLayer.items.length, 4);
  assert.match(trustLayer.items[3]?.body ?? "", /2026\.03/);
  assert.equal(trustLayer.items[1]?.body.includes("1.2.3"), false);
  assert.equal(
    trustLayer.links.some((link) => link.href === "/methodology"),
    true,
  );
});

test("uses a stable fallback when evaluation date is missing", () => {
  const trustLayer = buildTrustLayerModel({
    status: "NEEDS_INFO",
    metadata: {
      engine_version: "1.2.3",
      evaluation_mode: "canonical",
      policy_code: "TR_HOME_CARE_ALLOWANCE",
      policy_version: "2026.03",
      jurisdiction: "TR",
      evaluation_date: null,
    },
  });

  assert.match(trustLayer.items[3]?.body ?? "", /Belirtilmedi/);
});
