
import { extractImageText } from "../../services/extraction/imageExtractor.js";

export async function photoHandler(update, context) {
    context.session = context.session || {};

    const photo = update.message?.photo;

    if (!photo || photo.length === 0) {
        return;
    }

    const waitingFor = context.session.waitingFor;

    // Check whether the user specified what the image contains
    if (!waitingFor) {
        await update.message.reply_text(
            "⚠️ Please tell me what you are uploading first.\n\n" +
            "Use /add_jd for a Job Description.\n" +
            "Use /add_resume for a Resume."
        );

        return;
    }

    await update.message.reply_text(
        "🖼️ <b>Image received!</b>\n\n" +
        "🔍 Extracting text using OCR...",
        {
            parse_mode: "HTML"
        }
    );

    try {
        // Telegram provides multiple image sizes.
        // The last one is normally the highest resolution.
        const largestPhoto = photo[photo.length - 1];

        // Get Telegram file information
        const file = await context.api.getFile(
            largestPhoto.file_id
        );

        // Extract text using OCR
        const extractedText = await extractImageText(
            file.file_path
        );

        if (!extractedText || !extractedText.trim()) {
            await update.message.reply_text(
                "❌ I couldn't extract any text from this image.\n\n" +
                "Please upload a clearer image."
            );

            return;
        }

        // Save Job Description
        if (waitingFor === "jd") {
            context.session.jdText = extractedText;

            delete context.session.waitingFor;

            await update.message.reply_text(
                "✅ <b>Job Description saved successfully!</b>\n\n" +
                "Now use /add_resume to upload your resume.",
                {
                    parse_mode: "HTML"
                }
            );

            return;
        }

        // Save Resume
        if (waitingFor === "resume") {
            context.session.resumeText = extractedText;

            if (!context.session.resumes) {
                context.session.resumes = [];
            }

            context.session.resumes.push({
                name: `Resume ${context.session.resumes.length + 1}`,
                text: extractedText
            });

            delete context.session.waitingFor;

            await update.message.reply_text(
                "✅ <b>Resume saved successfully!</b>\n\n" +
                "Use /analyze to analyze this resume.\n" +
                "Use /compare to compare candidates.",
                {
                    parse_mode: "HTML"
                }
            );

            return;
        }

    } catch (error) {
        console.error("Image OCR error:", error);

        await update.message.reply_text(
            "❌ Failed to extract text from the image.\n\n" +
            "Please try a clearer image or upload a PDF/DOCX instead."
        );
    }
}