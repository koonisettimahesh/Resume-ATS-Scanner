
export async function start(ctx) {
    const welcomeText =
        "👋 <b>ATS Resume Analyzer Bot</b>\n\n" +

        "<b>Commands:</b>\n" +
        "• /add_jd - Add Job Description\n" +
        "• /add_resume - Add Resume\n" +
        "• /analyze - Run ATS analysis\n" +
        "• /compare - Compare candidates\n" +
        "• /status - Show uploaded files\n" +
        "• /clear - Clear uploaded data\n\n" +

        "📄 <b>Supported files:</b>\n" +
        "• PDF\n" +
        "• Word DOCX\n" +
        "• Images\n" +
        "• Raw text\n\n" +

        "Select a mode and upload your files.";

    await ctx.reply(
        welcomeText,
        {
            parse_mode: "HTML"
        }
    );
}
