
import { parseJobDescription } from "../../services/ai/jdParser.js";
import { calculateAtsScore } from "../../services/ats/atsScorer.js";
import { compareCandidates } from "../../services/ai/comparisonService.js";

export async function compare(ctx) {
    ctx.session = ctx.session || {};

    const jdText = ctx.session.jdText;
    const resumes = ctx.session.resumes;

    if (!jdText) {
        await ctx.reply(
            "⚠️ Please add a Job Description first.\n\n" +
            "Use /add_jd"
        );
        return;
    }

    if (!resumes || resumes.length === 0) {
        await ctx.reply(
            "⚠️ Please add at least one Resume first.\n\n" +
            "Use /add_resume"
        );
        return;
    }

    await ctx.reply(
        "🔍 <b>Comparing candidates...</b>\n\n" +
        "Please wait.",
        {
            parse_mode: "HTML"
        }
    );

    try {
        const jdData = await parseJobDescription(jdText);

        const candidates = resumes.map((resume, index) => {
            const atsResult = calculateAtsScore(
                jdData,
                resume.text
            );

            return {
                name: resume.name || `Candidate ${index + 1}`,
                text: resume.text,
                score: atsResult.score,
                breakdown: atsResult.breakdown
            };
        });

        candidates.sort((a, b) => b.score - a.score);

        let result = "🏆 <b>Candidate Ranking</b>\n\n";

        candidates.forEach((candidate, index) => {
            result +=
                `${index + 1}. <b>${candidate.name}</b> — ` +
                `<b>${candidate.score}/100</b>\n`;
        });

        await ctx.reply(
            result,
            {
                parse_mode: "HTML"
            }
        );

        const comparison = await compareCandidates(
            jdText,
            candidates
        );

        await ctx.reply(
            "🤖 <b>AI Comparison</b>\n\n" +
            comparison,
            {
                parse_mode: "HTML"
            }
        );

    } catch (error) {
        console.error("Comparison error:", error);

        await ctx.reply(
            "❌ Something went wrong while comparing candidates.\n\n" +
            "Please try again."
        );
    }
}
