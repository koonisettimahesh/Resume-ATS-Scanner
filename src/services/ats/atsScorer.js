
import { matchSkills } from "./skillMatcher.js";
import { matchKeywords } from "./keywordMatcher.js";
import { matchExperience } from "./experienceMatcher.js";
import { matchEducation } from "./educationMatcher.js";

export function calculateAtsScore(jdData, resumeText) {
    // Match skills
    const skillResult = matchSkills(
        jdData.skills || [],
        resumeText
    );

    // Match keywords
    const keywordResult = matchKeywords(
        jdData.keywords || [],
        resumeText
    );

    // Match experience
    const experienceResult = matchExperience(
        jdData.requiredYears,
        resumeText
    );

    // Match education
    const educationResult = matchEducation(
        jdData.education || [],
        resumeText
    );

    // Weighted score
    const skillScore =
        skillResult.score * 0.50;

    const keywordScore =
        keywordResult.score * 0.20;

    const experienceScore =
        experienceResult.score * 0.20;

    const educationScore =
        educationResult.score * 0.10;

    const finalScore = Math.round(
        skillScore +
        keywordScore +
        experienceScore +
        educationScore
    );

    return {
        score: Math.min(100, Math.max(0, finalScore)),

        breakdown: {
            skills: {
                score: skillResult.score,
                weightedScore: Math.round(skillScore),
                matched: skillResult.matchedSkills,
                missing: skillResult.missingSkills
            },

            keywords: {
                score: keywordResult.score,
                weightedScore: Math.round(keywordScore),
                matched: keywordResult.matchedKeywords,
                missing: keywordResult.missingKeywords
            },

            experience: {
                score: experienceResult.score,
                weightedScore: Math.round(experienceScore),
                requiredYears: experienceResult.requiredYears,
                detectedYears: experienceResult.detectedYears,
                meetsRequirement:
                    experienceResult.meetsRequirement
            },

            education: {
                score: educationResult.score,
                weightedScore: Math.round(educationScore),
                matched: educationResult.matchedEducation,
                missing: educationResult.missingEducation
            }
        }
    };
}