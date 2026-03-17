const DEFAULT_SITE_URL = "https://sosyalhakrehberi.com";
const PRODUCTION_HOSTNAME = "sosyalhakrehberi.com";

function normalizeSiteUrl(value?: string): URL {
  if (!value) {
    return new URL(DEFAULT_SITE_URL);
  }

  try {
    const url = new URL(value);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getSiteUrl(): URL {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function isProductionSite(url = getSiteUrl()): boolean {
  return process.env.VERCEL_ENV === "production" || url.hostname === PRODUCTION_HOSTNAME;
}
