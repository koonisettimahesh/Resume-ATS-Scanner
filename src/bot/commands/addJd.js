
export async function addJd(ctx) {
    ctx.session = ctx.session || {};

    ctx.session.waitingFor = "jd";

    await ctx.reply(
        "📋 <b>Add Job Description</b>\n\n" +
        "Please send me the Job Description as:\n" +
        "• 📄 PDF\n" +
        "• 📝 DOCX\n" +
        "• 🖼️ Image\n" +
        "• ✍️ Plain text\n\n" +
        "I will save and process it for ATS analysis.",
        {
            parse_mode: "HTML"
        }
    );
}
