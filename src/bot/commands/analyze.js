
import { parseJobDescription } from "../../services/ai/jdParser.js";
import { calculateAtsScore } from "../../services/ats/atsScorer.js";
import { analyzeResume } from "../../services/ai/analysisService.js";

export async function analyze(ctx) {
    ctx.session = ctx.session || {};

    const jdText = ctx.session.jdText;
    const resumeText = ctx.session.resumeText;

    if (!jdText) {
        await ctx.reply(
            "⚠️ Please add a Job Description first.\n\n" +
            "Use /add_jd"
        );
        return;
    }

    if (!resumeText) {
        await ctx.reply(
            "⚠️ Please add a Resume first.\n\n" +
            "Use /add_resume"
        );
        return;
    }

    await ctx.reply(
        "🔍 <b>Analyzing your resume...</b>\n\n" +
        "Please wait.",
        {
            parse_mode: "HTML"
        }
    );

    try {
        const jdData = await parseJobDescription(jdText);

        const atsResult = calculateAtsScore(
            jdData,
            resumeText
        );

        const analysis = await analyzeResume(
            jdText,
            resumeText,
            atsResult
        );

        await ctx.reply(
            `📊 <b>ATS Score: ${atsResult.score}/100</b>\n\n` +
            analysis,
            {
                parse_mode: "HTML"
            }
        );

    } catch (error) {
        console.error("Analysis error:", error);

        await ctx.reply(
            "❌ Something went wrong while analyzing the resume.\n\n" +
            "Please try again."
        );
    }
}
