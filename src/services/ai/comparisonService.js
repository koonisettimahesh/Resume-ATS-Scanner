import { groqClient } from "./groqClient.js";

const MODEL = "openai/gpt-oss-120b";

export async function compareCandidates(jdText, candidates) {
    const candidateData = candidates.map((candidate, index) => ({
        rank: index + 1,
        name: candidate.name,
        atsScore: candidate.score,
        resume: candidate.text
    }));

    const prompt = `
You are an expert ATS recruitment assistant.

Compare the candidates against the provided Job Description.

IMPORTANT:
- Candidate ATS scores have already been calculated by the application.
- Do NOT recalculate or change the scores.
- The ATS scores are the source of truth for ranking.
- Explain why the candidates received their scores.
- Do not invent qualifications or experience that are not present in the resumes.
- Do NOT use Markdown.
- Do NOT use Markdown tables.
- Do NOT use Markdown symbols such as #, ##, **, *, or - for formatting.
- Return ONLY Telegram-compatible HTML.
- Use only these HTML tags:
  <b>...</b>
  <i>...</i>
  <code>...</code>

For lists, use the bullet character:
•

Use normal line breaks instead of <br>.
Do not use <br>, <div>, <table>, <tr>, <td>, <ul>, <ol>, or other HTML tags.

JOB DESCRIPTION:
${jdText}

CANDIDATES:
${JSON.stringify(candidateData, null, 2)}

Provide the response in this structure:

<b>🏆 Candidate Comparison</b>

<b>1. Best Candidate</b>
Identify the highest-ranked candidate and briefly explain why.

<b>2. Candidate Analysis</b>

For each candidate:

<b>Candidate Name</b>

<b>Key Strengths</b>
• Strength 1
• Strength 2
• Strength 3

<b>Missing Skills</b>
• Missing skill 1
• Missing skill 2

<b>Relevant Experience</b>
• Relevant experience 1
• Relevant experience 2

<b>Important Weaknesses</b>
• Weakness 1
• Weakness 2

<b>3. Final Recommendation</b>
Explain which candidate appears strongest for this Job Description and why.

Keep the response concise, professional, and easy to read in a Telegram chat.
`;

    const response = await groqClient.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content:
                    "You are an expert recruitment and ATS analysis assistant. " +
                    "Never modify or recalculate the provided ATS scores. " +
                    "Always return Telegram-compatible HTML only. " +
                    "Never return Markdown. " +
                    "Never use unsupported HTML tags."
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
        "No comparison was generated."
    );
}
