import { GEMINI_GENERATE_CONTENT_URL } from "./config";
import { geminiFetchWithRotation } from "./rotation";

export async function callGemini(prompt: string, userMessage: string) {
  const res = await geminiFetchWithRotation(
    GEMINI_GENERATE_CONTENT_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${prompt}\n\nالرسالة من الطالب:\n${userMessage}` }],
          },
        ],
      }),
    },
    "callGemini",
  );

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("\n") ?? "";

  return text;
}

export async function callGeminiJson<T>(prompt: string, userMessage: string): Promise<T> {
  const res = await geminiFetchWithRotation(
    GEMINI_GENERATE_CONTENT_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${prompt}\n\nالرسالة من الطالب:\n${userMessage}` }],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          responseMimeType: "application/json",
        },
      }),
    },
    "callGeminiJson",
  );

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("\n") ?? "";
  return JSON.parse(text) as T;
}
