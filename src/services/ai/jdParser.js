import { groqClient } from "./groqClient.js";

const MODEL = "openai/gpt-oss-120b";

export async function parseJobDescription(jdText) {
    const prompt = `
Extract the important requirements from the following Job Description.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

Use exactly this structure:

{
    "skills": [],
    "keywords": [],
    "requiredYears": null,
    "education": []
}

Rules:

1. "skills"
   - Include technical and professional skills explicitly required.
   - Examples: Python, Java, React, SQL, Docker, AWS.

2. "keywords"
   - Include important ATS keywords and phrases from the JD.
   - Examples: REST API, Agile, CI/CD, Git, Microservices.

3. "requiredYears"
   - Extract the minimum years of experience required.
   - Examples:
     "3+ years of experience" → 3
     "minimum 2 years" → 2
     "2-4 years" → 2
   - If no experience requirement exists, return null.

4. "education"
   - Include explicitly required degrees or fields.
   - Examples: B.Tech, Bachelor's degree, Computer Science.
   - If no education requirement exists, return [].

Do not invent requirements.

JOB DESCRIPTION:

${jdText}
`;

    const response = await groqClient.chat.completions.create({
        model: MODEL,

        messages: [
            {
                role: "system",
                content:
                    "You extract structured requirements from job descriptions. " +
                    "Return only valid JSON."
            },
            {
                role: "user",
                content: prompt
            }
        ],

        temperature: 0,

        response_format: {
            type: "json_object"
        }
    });

    const content =
        response.choices[0]?.message?.content;

    if (!content) {
        throw new Error(
            "Groq returned an empty JD analysis."
        );
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        console.error(
            "JD parsing JSON error:",
            error
        );

        throw new Error(
            "Failed to parse Job Description."
        );
    }
}