import test from "node:test";
import assert from "node:assert/strict";
import { createToolAnalyticsSession } from "./tool-analytics-core.ts";

test("tool analytics session tracks open only once", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("gss", (event) => trackedEvents.push(event));

  session.trackOpened();
  session.trackOpened();

  assert.deepEqual(trackedEvents, [
    {
      name: "tool_opened",
      tool: "gss",
      surface: "tool-page",
    },
  ]);
});

test("tool analytics session tracks form start only once and submits every time", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("old-age", (event) => trackedEvents.push(event));

  session.trackFormStarted();
  session.trackFormStarted();
  session.trackFormSubmitted();
  session.trackFormSubmitted();

  assert.deepEqual(trackedEvents, [
    {
      name: "form_started",
      tool: "old-age",
      surface: "tool-page",
    },
    {
      name: "form_submitted",
      tool: "old-age",
      surface: "tool-page",
    },
    {
      name: "form_submitted",
      tool: "old-age",
      surface: "tool-page",
    },
  ]);
});

test("tool analytics session deduplicates result_received by decision id", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("home-care", (event) => trackedEvents.push(event));

  session.trackResultReceived("decision-1", "NEEDS_INFO");
  session.trackResultReceived("decision-1", "NEEDS_INFO");
  session.trackResultReceived("decision-2", "ELIGIBLE");

  assert.deepEqual(trackedEvents, [
    {
      name: "result_received",
      tool: "home-care",
      surface: "result",
      status: "NEEDS_INFO",
    },
    {
      name: "result_received",
      tool: "home-care",
      surface: "result",
      status: "ELIGIBLE",
    },
  ]);
});

test("tool analytics session tracks link clicks with surface metadata", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("gss", (event) => trackedEvents.push(event));

  session.trackLinkClick("guidance", "guide", "/gss-gelir-testi/rehber");

  assert.deepEqual(trackedEvents, [
    {
      name: "guide_link_clicked",
      tool: "gss",
      surface: "guidance",
      target_kind: "guide",
      target_href: "/gss-gelir-testi/rehber",
    },
  ]);
});

