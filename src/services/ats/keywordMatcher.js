
import { normalizeText, containsWord } from "../../utils/textUtils.js";

export function matchKeywords(requiredKeywords, resumeText) {
    const resume = normalizeText(resumeText);

    const matchedKeywords = [];
    const missingKeywords = [];

    for (const keyword of requiredKeywords) {
        const normalizedKeyword = normalizeText(keyword);

        if (containsWord(resume, normalizedKeyword)) {
            matchedKeywords.push(keyword);
        } else {
            missingKeywords.push(keyword);
        }
    }

    const totalKeywords = requiredKeywords.length;

    const score =
        totalKeywords === 0
            ? 0
            : (matchedKeywords.length / totalKeywords) * 100;

    return {
        score: Math.round(score),
        matchedKeywords,
        missingKeywords
    };
}