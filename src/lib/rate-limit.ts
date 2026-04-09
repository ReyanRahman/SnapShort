const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

type Bucket = {
  count: number;
  startedAt: number;
};

const buckets = new Map<string, Bucket>();

export function enforceRouteRateLimit(identifier: string) {
  const now = Date.now();
  const current = buckets.get(identifier);

  if (!current || now - current.startedAt > WINDOW_MS) {
    buckets.set(identifier, { count: 1, startedAt: now });
    return;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    throw new Error("Too many enhancement attempts from this account. Please try again later.");
  }

  current.count += 1;
  buckets.set(identifier, current);
}

export function checkRateLimit(identifier: string) {
  try {
    enforceRouteRateLimit(identifier);
    return true;
  } catch {
    return false;
  }
}
