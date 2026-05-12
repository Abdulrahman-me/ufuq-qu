import { getGeminiApiKeys, maskGeminiKey } from "./keys";

/** Hard cap so misconfiguration cannot cause unbounded retries. */
const DEFAULT_MAX_ROTATIONS = 16;

function maxRotationAttempts(): number {
  const raw = process.env.GEMINI_MAX_KEY_ROTATIONS?.trim();
  if (!raw) return DEFAULT_MAX_ROTATIONS;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_MAX_ROTATIONS;
  return Math.min(n, DEFAULT_MAX_ROTATIONS);
}

function appendApiKey(urlWithoutKey: string, key: string): string {
  const sep = urlWithoutKey.includes("?") ? "&" : "?";
  return `${urlWithoutKey}${sep}key=${encodeURIComponent(key)}`;
}

export function parseGeminiErrorPayload(bodyText: string): {
  code?: number;
  status?: string;
  message?: string;
} {
  try {
    const j = JSON.parse(bodyText) as {
      error?: { code?: number; status?: string; message?: string };
    };
    return j.error ?? {};
  } catch {
    return {};
  }
}

/**
 * Detect quota / rate-limit style failures where switching to another key may help.
 * Does not treat invalid API key (401/403) as rotatable unless message indicates quota.
 */
export function isQuotaOrRateLimitError(httpStatus: number, bodyText: string): boolean {
  if (httpStatus === 429) return true;

  const { code, status, message } = parseGeminiErrorPayload(bodyText);
  const combined = `${message ?? ""} ${bodyText}`.toLowerCase();

  if (status === "RESOURCE_EXHAUSTED" || code === 429) return true;
  if (/(quota|rate limit|resource exhausted|too many requests)/i.test(combined)) return true;

  if (httpStatus === 503 && /(overloaded|unavailable|try again|resource_exhausted)/i.test(combined)) {
    return true;
  }

  if (httpStatus === 403 && /(quota|rate|resource_exhausted|limit)/i.test(combined)) return true;

  return false;
}

/**
 * Calls the Gemini REST endpoint with API key rotation on quota/rate-limit errors.
 * Each key is tried at most once per invocation; total attempts ≤ min(keys, GEMINI_MAX_KEY_ROTATIONS).
 */
export async function geminiFetchWithRotation(
  urlWithoutKey: string,
  init: RequestInit,
  context: string,
): Promise<Response> {
  const keys = getGeminiApiKeys();
  const cap = maxRotationAttempts();
  const attempts = Math.min(keys.length, cap);

  let lastError: Error | null = null;

  for (let i = 0; i < attempts; i++) {
    const key = keys[i];
    const url = appendApiKey(urlWithoutKey, key);
    const masked = maskGeminiKey(key);

    console.info(`[Gemini] ${context} | keyIndex=${i + 1}/${keys.length} | keyMasked=${masked}`);

    const res = await fetch(url, init);
    if (res.ok) return res;

    const bodyText = await res.text();
    const canRotate = isQuotaOrRateLimitError(res.status, bodyText) && i < attempts - 1;

    if (canRotate) {
      console.warn(
        `[Gemini] ${context} | keyIndex=${i + 1} failed (${res.status}), rotating | ${bodyText.slice(0, 400)}`,
      );
      lastError = new Error(`Gemini HTTP ${res.status}: ${bodyText.slice(0, 2000)}`);
      continue;
    }

    throw new Error(`Gemini error: ${res.status} ${bodyText}`);
  }

  throw lastError ?? new Error("Gemini: all configured API keys exhausted or failed");
}
