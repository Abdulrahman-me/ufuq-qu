/** Server-only Gemini REST endpoints (used with API key query param). */
export const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
export const GEMINI_MODEL = "gemini-2.5-flash";
export const GEMINI_GENERATE_CONTENT_URL = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent`;
