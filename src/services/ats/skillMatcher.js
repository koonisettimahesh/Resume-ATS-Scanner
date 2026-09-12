import { normalizeText, containsWord } from "../../utils/textUtils.js";

export function matchSkills(requiredSkills, resumeText) {
    const resume = normalizeText(resumeText);

    const matchedSkills = [];
    const missingSkills = [];

    for (const skill of requiredSkills) {
        const normalizedSkill = normalizeText(skill);

        if (containsWord(resume, normalizedSkill)) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    }

    const totalSkills = requiredSkills.length;

    const score =
        totalSkills === 0
            ? 0
            : (matchedSkills.length / totalSkills) * 100;

    return {
        score: Math.round(score),
        matchedSkills,
        missingSkills
    };
}