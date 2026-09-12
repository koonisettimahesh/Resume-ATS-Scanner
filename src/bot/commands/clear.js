
export async function clear(ctx) {
    ctx.session = ctx.session || {};

    delete ctx.session.jdText;
    delete ctx.session.jdData;
    delete ctx.session.resumeText;
    delete ctx.session.resumes;
    delete ctx.session.waitingFor;

    await ctx.reply(
        "🗑️ <b>All uploaded data has been cleared.</b>\n\n" +
        "📋 Job Description: Removed\n" +
        "📄 Resume: Removed\n" +
        "👥 Comparison resumes: Removed\n\n" +
        "You can start again using /add_jd.",
        {
            parse_mode: "HTML"
        }
    );
}
