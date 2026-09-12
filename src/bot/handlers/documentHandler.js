import fs from "fs/promises";
import path from "path";

import { extractPdfText } from "../../services/extraction/pdfExtractor.js";
import { extractDocxText } from "../../services/extraction/docxExtractor.js";

export async function documentHandler(ctx) {
    ctx.session = ctx.session || {};

    const document = ctx.message?.document;
    if (!document) return;

    const fileName = document.file_name || "unknown";
    const extension = fileName.split(".").pop().toLowerCase();
    const waitingFor = ctx.session.waitingFor;

    if (!waitingFor) {
        await ctx.reply(
            "⚠️ Please tell me what you are uploading first.\n\n" +
            "Use /add_jd for a Job Description.\n" +
            "Use /add_resume for a Resume."
        );
        return;
    }

    if (extension !== "pdf" && extension !== "docx") {
        await ctx.reply(
            "❌ Unsupported file type.\n\n" +
            "Please upload a PDF or DOCX file."
        );
        return;
    }

    await ctx.reply(
        "📥 <b>File received!</b>\n\n" +
        `📄 ${fileName}\n\n` +
        "🔍 Downloading and extracting text...",
        {
            parse_mode: "HTML"
        }
    );

    let localFilePath;

    try {
        const documentsDir = path.resolve("documents");

        await fs.mkdir(documentsDir, {
            recursive: true
        });

        localFilePath = path.join(
            documentsDir,
            `${Date.now()}-${fileName}`
        );

        // Get Telegram file information
        const file = await ctx.api.getFile(document.file_id);

        if (!file.file_path) {
            throw new Error("Telegram did not return a file path.");
        }

        // Download file from Telegram
        const fileUrl =
            `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`;

        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(
                `Failed to download file. HTTP ${response.status}`
            );
        }

        const buffer = Buffer.from(
            await response.arrayBuffer()
        );

        await fs.writeFile(
            localFilePath,
            buffer
        );

        let extractedText;

        if (extension === "pdf") {
            extractedText = await extractPdfText(
                localFilePath
            );
        } else {
            extractedText = await extractDocxText(
                localFilePath
            );
        }

        if (!extractedText || !extractedText.trim()) {
            await ctx.reply(
                "❌ I couldn't extract any text from this file.\n\n" +
                "Please make sure the file contains readable text."
            );
            return;
        }

        if (waitingFor === "jd") {
            ctx.session.jdText = extractedText;
            delete ctx.session.jdData;
            delete ctx.session.waitingFor;

            await ctx.reply(
                "✅ <b>Job Description saved successfully!</b>\n\n" +
                "Now use /add_resume to upload your resume.",
                {
                    parse_mode: "HTML"
                }
            );

            return;
        }

        if (waitingFor === "resume") {
            ctx.session.resumeText = extractedText;

            if (!ctx.session.resumes) {
                ctx.session.resumes = [];
            }

            ctx.session.resumes.push({
                name: fileName,
                text: extractedText
            });

            delete ctx.session.waitingFor;

            await ctx.reply(
                "✅ <b>Resume saved successfully!</b>\n\n" +
                "Use /analyze to analyze this resume.\n" +
                "Use /compare to compare candidates.",
                {
                    parse_mode: "HTML"
                }
            );
        }

    } catch (error) {
        console.error("Document processing error:", error);

        await ctx.reply(
            "❌ Failed to process the file.\n\n" +
            "Please try again with another PDF or DOCX file."
        );

    } finally {
        if (localFilePath) {
            try {
                await fs.unlink(localFilePath);
            } catch {
                // Ignore cleanup errors
            }
        }
    }
}
