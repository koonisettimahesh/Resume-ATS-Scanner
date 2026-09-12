export async function status(ctx) {
    ctx.session = ctx.session || {};

    const jdText = ctx.session.jdText;
    const resumeText = ctx.session.resumeText;
    const resumes = ctx.session.resumes || [];

    let message = "📊 <b>Current Status</b>\n\n";

    if (jdText) {
        message += "📋 <b>Job Description:</b> ✅ Added\n";
    } else {
        message += "📋 <b>Job Description:</b> ❌ Not added\n";
    }

    if (resumeText) {
        message += "📄 <b>Resume:</b> ✅ Added\n";
    } else {
        message += "📄 <b>Resume:</b> ❌ Not added\n";
    }

    message += `👥 <b>Resumes for comparison:</b> ${resumes.length}\n\n`;

    if (!jdText) {
        message += "👉 Use /add_jd to add a Job Description.";
    } else if (!resumeText && resumes.length === 0) {
        message += "👉 Use /add_resume to add a Resume.";
    } else {
        message += "✅ You can use /analyze.";

        if (resumes.length > 0) {
            message += "\n🏆 You can also use /compare.";
        }
    }

    await ctx.reply(
        message,
        {
            parse_mode: "HTML"
        }
    );
}
