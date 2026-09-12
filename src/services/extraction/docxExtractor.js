
import mammoth from "mammoth";

export async function extractDocxText(filePath) {
    try {
        const result = await mammoth.extractRawText({
            path: filePath
        });

        return result.value.trim();

    } catch (error) {
        console.error("DOCX extraction error:", error);

        throw new Error(
            "Failed to extract text from DOCX."
        );
    }
}