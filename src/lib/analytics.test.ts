import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAnalyticsEnvelope,
  trackAnalyticsEvent,
  type AnalyticsEnvelope,
} from "./analytics.ts";

test("buildAnalyticsEnvelope returns only allowed result fields", () => {
  assert.deepEqual(buildAnalyticsEnvelope({
    name: "result_received",
    tool: "gss",
    surface: "result",
    status: "NEEDS_INFO",
  }), {
    event: "result_received",
    tool: "gss",
    surface: "result",
    status: "NEEDS_INFO",
  });
});

test("buildAnalyticsEnvelope includes guide target information", () => {
  assert.deepEqual(buildAnalyticsEnvelope({
    name: "guide_link_clicked",
    tool: "old-age",
    surface: "guidance",
    target_kind: "guide",
    target_href: "/65-yas-ayligi-uygunluk-testi/rehber",
  }), {
    event: "guide_link_clicked",
    tool: "old-age",
    surface: "guidance",
    target_kind: "guide",
    target_href: "/65-yas-ayligi-uygunluk-testi/rehber",
  });
});

test("trackAnalyticsEvent dispatches a browser event and pushes strings to dataLayer", () => {
  const dispatchedEvents: AnalyticsEnvelope[] = [];
  const dataLayer: Array<Record<string, string>> = [];
  const originalWindow = globalThis.window;

  const fakeWindow = {
    dataLayer,
    dispatchEvent: (event: Event) => {
      const customEvent = event as CustomEvent<AnalyticsEnvelope>;
      dispatchedEvents.push(customEvent.detail);
      return true;
    },
  } as Window & { dataLayer: Array<Record<string, string>> };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: fakeWindow,
  });

  try {
    trackAnalyticsEvent({
      name: "result_received",
      tool: "home-care",
      surface: "result",
      status: "ELIGIBLE",
    });
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  }

  assert.equal(dispatchedEvents.length, 1);
  assert.deepEqual(dispatchedEvents[0], {
    event: "result_received",
    tool: "home-care",
    surface: "result",
    status: "ELIGIBLE",
  });
  assert.deepEqual(dataLayer[0], {
    event: "result_received",
    tool: "home-care",
    surface: "result",
    status: "ELIGIBLE",
  });
});

test("trackAnalyticsEvent is a safe no-op on the server", () => {
  const originalWindow = globalThis.window;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: undefined,
  });

  try {
    assert.doesNotThrow(() =>
      trackAnalyticsEvent({
        name: "form_submitted",
        tool: "gss",
        surface: "tool-page",
      }),
    );
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  }
});
