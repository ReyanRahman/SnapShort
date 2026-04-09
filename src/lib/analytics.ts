import { headers } from "next/headers";

export async function getVisitMetadata() {
  const incomingHeaders = await headers();
  const userAgent = incomingHeaders.get("user-agent") ?? undefined;
  const referrer = incomingHeaders.get("referer") ?? undefined;
  const ip = incomingHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? incomingHeaders.get("x-real-ip") ?? undefined;
  const country = incomingHeaders.get("x-vercel-ip-country") ?? undefined;
  const city = incomingHeaders.get("x-vercel-ip-city") ?? undefined;

  return {
    userAgent,
    referrer,
    ip,
    country,
    city,
    ...parseUserAgent(userAgent),
  };
}

function parseUserAgent(userAgent?: string) {
  const value = userAgent?.toLowerCase() ?? "";

  let deviceType = "Desktop";
  if (/mobile|iphone|android/.test(value)) {
    deviceType = "Mobile";
  }
  if (/ipad|tablet/.test(value)) {
    deviceType = "Tablet";
  }

  let browser = "Unknown";
  if (value.includes("edg")) browser = "Edge";
  else if (value.includes("chrome")) browser = "Chrome";
  else if (value.includes("firefox")) browser = "Firefox";
  else if (value.includes("safari")) browser = "Safari";

  let os = "Unknown";
  if (value.includes("windows")) os = "Windows";
  else if (value.includes("mac os")) os = "macOS";
  else if (value.includes("android")) os = "Android";
  else if (value.includes("iphone") || value.includes("ipad") || value.includes("ios")) os = "iOS";
  else if (value.includes("linux")) os = "Linux";

  return { deviceType, browser, os };
}
