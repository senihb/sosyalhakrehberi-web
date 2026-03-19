import test from "node:test";
import assert from "node:assert/strict";
import { getSiteUrl, isProductionSite } from "./site.ts";

test("isProductionSite returns true for the canonical public hostname", () => {
  const url = new URL("https://sosyalhakrehberi.com");

  assert.equal(isProductionSite(url), true);
});

test("isProductionSite returns false for localhost", () => {
  const url = new URL("http://localhost:3000");

  assert.equal(isProductionSite(url), false);
});

test("getSiteUrl prefers NEXT_PUBLIC_SITE_URL when present", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://sosyalhakrehberi.com/some/path?x=1";

  try {
    const siteUrl = getSiteUrl();
    assert.equal(siteUrl.toString(), "https://sosyalhakrehberi.com/");
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  }
});
