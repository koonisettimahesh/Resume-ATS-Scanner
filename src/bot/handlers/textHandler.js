import { parseJobDescription } from "../../services/ai/jdParser.js";

export async function textHandler(update, context) {
    context.session = context.session || {};

    const text = update.message?.text?.trim();

    if (!text) {
        return;
    }

    const waitingFor = context.session.waitingFor;

    // ==========================================
    // USER IS ENTERING A JOB DESCRIPTION
    // ==========================================

    if (waitingFor === "jd") {

        await update.message.reply_text(
            "🔍 <b>Processing Job Description...</b>\n\n" +
            "Please wait.",
            {
                parse_mode: "HTML"
            }
        );

        try {
            // Save raw JD
            context.session.jdText = text;

            // Parse JD only once
            const jdData = await parseJobDescription(text);

            // Save structured JD
            context.session.jdData = jdData;

            // Clear waiting state
            delete context.session.waitingFor;

            await update.message.reply_text(
                "✅ <b>Job Description saved successfully!</b>\n\n" +
                "📋 Requirements extracted.\n\n" +
                "Now use /add_resume to upload your resume.",
                {
                    parse_mode: "HTML"
                }
            );

        } catch (error) {
            console.error("JD parsing error:", error);

            // Don't leave invalid JD data in the session
            delete context.session.jdText;
            delete context.session.jdData;

            await update.message.reply_text(
                "❌ Failed to process the Job Description.\n\n" +
                "Please try sending it again."
            );
        }

        return;
    }


    // ==========================================
    // USER IS ENTERING A RESUME
    // ==========================================

    if (waitingFor === "resume") {

        // Save resume text
        context.session.resumeText = text;

        // Create resumes array if it doesn't exist
        if (!context.session.resumes) {
            context.session.resumes = [];
        }

        // Add resume for comparison
        context.session.resumes.push({
            name: `Resume ${context.session.resumes.length + 1}`,
            text: text
        });

        // Clear waiting state
        delete context.session.waitingFor;

        await update.message.reply_text(
            "✅ <b>Resume saved successfully!</b>\n\n" +
            "Use /analyze to analyze this resume.\n" +
            "Use /compare to compare multiple resumes.",
            {
                parse_mode: "HTML"
            }
        );

        return;
    }


    // ==========================================
    // NO ACTIVE INPUT MODE
    // ==========================================

    await update.message.reply_text(
        "ℹ️ Please use one of these commands first:\n\n" +
        "/add_jd - Add Job Description\n" +
        "/add_resume - Add Resume\n" +
        "/analyze - Analyze Resume\n" +
        "/compare - Compare Candidates\n" +
        "/status - Check Status\n" +
        "/clear - Clear Data"
    );
}

