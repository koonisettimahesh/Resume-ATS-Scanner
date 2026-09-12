
export async function addResume(ctx) {
    ctx.session = ctx.session || {};

    ctx.session.waitingFor = "resume";

    await ctx.reply(
        "📄 <b>Add Resume</b>\n\n" +
        "Please send me your Resume as:\n" +
        "• 📄 PDF\n" +
        "• 📝 DOCX\n" +
        "• 🖼️ Image\n" +
        "• ✍️ Plain text\n\n" +
        "I will save it and use it for ATS analysis.",
        {
            parse_mode: "HTML"
        }
    );
}
