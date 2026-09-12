
import { normalizeText } from "../../utils/textUtils.js";

export function matchExperience(requiredYears, resumeText) {
    const resume = normalizeText(resumeText);

    // If the JD doesn't specify experience requirements
    if (
        requiredYears === null ||
        requiredYears === undefined ||
        requiredYears <= 0
    ) {
        return {
            score: 100,
            requiredYears: 0,
            detectedYears: 0,
            meetsRequirement: true
        };
    }

    // Look for patterns such as:
    // "3 years"
    // "3+ years"
    // "3 yrs"
    // "3 years of experience"

    const patterns = [
        /(\d+(?:\.\d+)?)\s*\+?\s*years?/i,
        /(\d+(?:\.\d+)?)\s*\+?\s*yrs?/i
    ];

    let detectedYears = 0;

    for (const pattern of patterns) {
        const match = resume.match(pattern);

        if (match) {
            detectedYears = parseFloat(match[1]);
            break;
        }
    }

    const meetsRequirement = detectedYears >= requiredYears;

    let score;

    if (meetsRequirement) {
        score = 100;
    } else if (detectedYears > 0) {
        score = Math.round(
            (detectedYears / requiredYears) * 100
        );

        score = Math.min(score, 100);
    } else {
        score = 0;
    }

    return {
        score,
        requiredYears,
        detectedYears,
        meetsRequirement
    };
}