
import { groqClient } from "./groqClient.js";

const MODEL = "openai/gpt-oss-120b";

export async function analyzeResume(jdText, resumeText, atsResult) {
    const prompt = `
You are an ATS resume analysis assistant.

Analyze the resume against the Job Description.

IMPORTANT:
- The ATS score has already been calculated by the application.
- Do NOT change, recalculate, or invent the ATS score.
- Use the provided ATS result as the source of truth.
- Focus on explaining the result and giving useful recommendations.
- Do NOT use Markdown.
- Return ONLY Telegram-compatible HTML.
- Do NOT use Markdown symbols such as #, ##, **, *, or - for formatting.

Use these HTML tags when appropriate:
<b>bold headings</b>
<i>italic text</i>
<code>code or technical terms</code>

For lists, use simple lines beginning with:
• 

JOB DESCRIPTION:
${jdText}

RESUME:
${resumeText}

DETERMINISTIC ATS RESULT:
${JSON.stringify(atsResult, null, 2)}

Provide the response in this structure:

<b>📊 ATS Analysis</b>

<b>1. Score Breakdown</b>
Explain the strengths and weaknesses based on the provided score breakdown.

<b>2. Matched Skills</b>
List the important skills found in the resume.

<b>3. Missing Skills</b>
List the important skills that are missing.

<b>4. Resume Strengths</b>
Give the strongest parts of the resume for this job.

<b>5. Resume Weaknesses</b>
Give the most important weaknesses.

<b>6. Recommendations</b>
Give specific changes the candidate should make to improve the resume.

Keep the response concise, clean, professional, and easy to read in a Telegram chat.
`;

    const response = await groqClient.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content:
                    "You are an expert ATS resume reviewer. " +
                    "Never modify the deterministic ATS score. " +
                    "Always return valid Telegram-compatible HTML. " +
                    "Never return Markdown."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0
    });

    return (
        response.choices[0]?.message?.content?.trim() ||
        "No analysis was generated."
    );
}
