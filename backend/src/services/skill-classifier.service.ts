import { GoogleGenAI } from "@google/genai";

import { AppError } from "../errors/app-error.js";

type SkillName = "Frontend" | "Backend";

interface SkillClassification {
  skills: SkillName[];
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function classifyTaskSkills(
  title: string
): Promise<SkillName[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: `
Classify the software engineering skills required for this task.

Task:
"${title}"

Available skills:
- Frontend
- Backend

Classification rules:
- Frontend: browser UI, responsive layouts, React, CSS,
  client-side interaction, visual components.
- Backend: APIs, databases, authentication logic,
  server-side processing, audit logging, persistence.
- If both client-side and server-side work are clearly
  required, return both.
- Only return skills that are actually required.
`,

      config: {
        responseMimeType: "application/json",

        responseJsonSchema: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "Frontend",
                  "Backend",
                ],
              },
              minItems: 1,
              maxItems: 2,
            },
          },
          required: ["skills"],
          additionalProperties: false,
        },
      },
    });

    if (!response.text) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    const result = JSON.parse(
      response.text
    ) as SkillClassification;

    return [...new Set(result.skills)];
  } catch (error) {
    console.error(
      "Failed to classify task skills:",
      error
    );

    throw new AppError(
      502,
      "Failed to identify required skills"
    );
  }
}