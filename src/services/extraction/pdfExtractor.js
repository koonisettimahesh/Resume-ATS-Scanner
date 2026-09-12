import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export async function extractPdfText(filePath) {
    try {
        const data = await fs.readFile(filePath);

        const parser = new PDFParse({
            data
        });

        const result = await parser.getText();

        await parser.destroy();

        return result.text.trim();
    } catch (error) {
        console.error("PDF extraction error:", error);
        throw new Error("Failed to extract text from PDF.");
    }
}