const LOCAL_SITE_URL = "http://localhost:3000";
const PUBLIC_SITE_HOSTNAME = "sosyalhakrehberi.com";

function normalizeSiteUrl(value: string, fallback: string): URL {
  try {
    const url = new URL(value);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return new URL(fallback);
  }
}

export function getSiteUrl(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, LOCAL_SITE_URL);
  }

  if (process.env.VERCEL_URL) {
    return normalizeSiteUrl(`https://${process.env.VERCEL_URL}`, LOCAL_SITE_URL);
  }

  return new URL(LOCAL_SITE_URL);
}

export function isProductionSite(url = getSiteUrl()): boolean {
  return url.hostname === PUBLIC_SITE_HOSTNAME;
}
