import { GoogleGenerativeAI } from "@google/generative-ai";

interface GenerateWorkspaceParams {
  projectTitle: string;
  projectDescription: string;
  courses: string;
  userPrompt: string;
}

// Rotate through available keys if one fails
const GEMINI_KEYS = [
  process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

/* System Instruction - Core Identity */
const SYSTEM_INSTRUCTION = `Identity & Execution Authority: You are the Technical Execution Engine of "صرح". Your responsibility is to transform the EXACT student project into a structured technical workspace. You must remain 100% within the semantic meaning of the Project Title. All content in Arabic. Output strictly JSON.

Core Standards:
1. Objectivity: No conversational filler. Direct technical data only.
2. Structure: 10 technical tasks per phase. Every task MUST be actionable and professional.
3. Strict YouTube Link & Resource Policy:
   - YouTube links should be exclusively from verified high-quality channels (e.g., Brocode, FreeCodeCamp, Programming with Mosh, Elzero Web School, Khan Academy, AI/ML specialist channels).
   - Provide direct YouTube Video IDs only if 100% certain. Otherwise, provide a 'youtube_query' in smart_media.
   - For EACH task, you MUST provide 1-2 verified links in the "references" array (Documentation like MDN, W3Schools, technical articles, or professional courses on Coursera/Udemy).
4. Mandatory Resource Links:
   - Ensure a mix of video and text resources.
5. Logical Steps (Simplified Language):
   - The "pseudo_code" field should contain simple, non-technical steps in Arabic.
   - AVOID technical function names or syntax. Explain logic in natural language.

JSON Schema Requirement:
{
  "project_title": "string",
  "description": "string",
  "task_checklist": [
    {
      "title": "Task Name",
      "technical_why": "Why this matters",
      "pseudo_code": ["Step 1 in simple Arabic", "Step 2..."],
      "academic_reference": "How this relates to university subjects",
      "common_pitfalls": ["Mistake 1", "Mistake 2"],
      "smart_media": {
        "youtube_video_id": "ID or null",
        "references": [{"title": "Source Name", "url": "URL"}]
      }
    }
  ],
  "roadmap": [{"phase": "Stage Name", "tasks": ["Task 1", "Task 2"]}],
  "academic_links": [{"subject": "Subject Name", "chapters": ["Chapter 1"]}],
  "drive_note": "Sync status"
}`;

const WORKSPACE_STRUCTURE = `Output strictly the JSON defined in the schema above. Include all fields.`;

const PHASE_TASKS_STRUCTURE = `Output strictly the task_checklist array within a JSON object: {"phase_name": "string", "task_checklist": [...]}.`;


function extractJsonFromText(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in AI response");
  return text.substring(start, end + 1);
}

/**
 * Helper to try generating content with key rotation
 */
async function generateWithRotation(prompt: string, temp: number) {
  let lastError = null;
  
  for (const key of GEMINI_KEYS) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: { responseMimeType: "application/json", temperature: temp }
      });
      
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn(`Gemini key failed, trying next...`, err);
      lastError = err;
    }
  }
  
  throw lastError || new Error("All Gemini API keys failed");
}

export async function generateSarhWorkspace(params: GenerateWorkspaceParams): Promise<any> {
  const prompt = `
    Generate the initial workspace for: ${params.projectTitle}
    Description: ${params.projectDescription}
    Courses: ${params.courses}
    User Request: ${params.userPrompt}

    RULES:
    - Generate the full roadmap (3-5 phases).
    - Generate EXACTLY 10 technical tasks for the FIRST PHASE in task_checklist.
    - Task #3 MUST be 'كتابة الخوارزمية أو الدالة الأساسية'.
    - Output strictly JSON: ${WORKSPACE_STRUCTURE}
  `;

  try {
    console.log("Generating workspace with Gemini (Rotational Mode)...", { projectTitle: params.projectTitle });
    const responseText = await generateWithRotation(prompt, 0.3);
    console.log("Gemini response received");
    return JSON.parse(extractJsonFromText(responseText));
  } catch (error) {
    console.error("Gemini error detailed:", error);
    throw new Error("فشل إنشاء مساحة العمل بعد تجربة كافة المفاتيح");
  }
}

export async function generatePhaseTasks(
  projectTitle: string,
  phaseName: string,
  phaseGoals: string[],
  previousTasks: string[]
): Promise<any> {
  const prompt = `
    Project: ${projectTitle}
    Current Phase: ${phaseName}
    Phase Context/Goals: ${phaseGoals.join(", ")}
    Previously completed tasks: ${previousTasks.join(", ")}

    TASK:
    Generate EXACTLY 10 NEW technical tasks for this specific phase.
    Do not repeat previous tasks.
    Task #3 MUST be 'كتابة الخوارزمية أو الدالة الأساسية'.
    Output strictly JSON: ${PHASE_TASKS_STRUCTURE}
  `;

  try {
    console.log("Generating phase tasks with Gemini (Rotational Mode)...", { phaseName });
    const responseText = await generateWithRotation(prompt, 0.4);
    console.log("Gemini phase response received");
    return JSON.parse(extractJsonFromText(responseText));
  } catch (error) {
    console.error("Gemini Phase Task error detailed:", error);
    throw new Error("فشل توليد مهام المرحلة بعد تجربة كافة المفاتيح");
  }
}
