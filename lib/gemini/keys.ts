/**
 * Server-only: load Gemini API keys from environment.
 *
 * Supported formats (first match wins):
 * 1. `GEMINI_API_KEYS` — comma-separated list (e.g. `key1,key2,key3`)
 * 2. `GEMINI_API_KEY` plus optional `GEMINI_API_KEY_2` … `GEMINI_API_KEY_32` (in order)
 *
 * Keys are deduplicated while preserving order. Never expose these to the client.
 */

let cachedKeys: readonly string[] | null = null;

function dedupePreserveOrder(keys: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of keys) {
    if (!seen.has(k)) {
      seen.add(k);
      out.push(k);
    }
  }
  return out;
}

function loadFromEnv(): string[] {
  const list = process.env.GEMINI_API_KEYS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (list?.length) return dedupePreserveOrder(list);

  const keys: string[] = [];
  const primary = process.env.GEMINI_API_KEY?.trim();
  if (primary) keys.push(primary);
  for (let i = 2; i <= 32; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`]?.trim();
    if (key) keys.push(key);
  }
  return dedupePreserveOrder(keys);
}

/** Returns non-empty readonly list of API keys. Call only on the server. */
export function getGeminiApiKeys(): readonly string[] {
  if (cachedKeys) return cachedKeys;
  const keys = loadFromEnv();
  if (keys.length === 0) {
    throw new Error(
      "No Gemini API keys configured. Set GEMINI_API_KEY and/or GEMINI_API_KEYS or GEMINI_API_KEY_2, …",
    );
  }
  cachedKeys = Object.freeze(keys);
  return cachedKeys;
}

/** For tests / hot reload in dev. */
export function resetGeminiApiKeysCache(): void {
  cachedKeys = null;
}

/** Safe for logs; never log full keys. */
export function maskGeminiKey(key: string): string {
  if (!key) return "****";
  if (key.length <= 8) return "****";
  return `***${key.slice(-4)}`;
}
