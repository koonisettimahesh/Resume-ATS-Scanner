
import { normalizeText, containsWord } from "../../utils/textUtils.js";

export function matchEducation(requiredEducation, resumeText) {
    const resume = normalizeText(resumeText);

    // If the JD doesn't specify an education requirement
    if (
        !requiredEducation ||
        requiredEducation.length === 0
    ) {
        return {
            score: 100,
            requiredEducation: [],
            matchedEducation: [],
            missingEducation: []
        };
    }

    const matchedEducation = [];
    const missingEducation = [];

    for (const education of requiredEducation) {
        const normalizedEducation = normalizeText(education);

        if (containsWord(resume, normalizedEducation)) {
            matchedEducation.push(education);
        } else {
            missingEducation.push(education);
        }
    }

    const totalEducation = requiredEducation.length;

    const score =
        totalEducation === 0
            ? 100
            : Math.round(
                (matchedEducation.length / totalEducation) * 100
            );

    return {
        score,
        requiredEducation,
        matchedEducation,
        missingEducation
    };
}