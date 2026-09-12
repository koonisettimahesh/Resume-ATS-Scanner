
import Tesseract from "tesseract.js";

export async function extractImageText(filePath) {
    try {
        const result = await Tesseract.recognize(
            filePath,
            "eng"
        );

        return result.data.text.trim();

    } catch (error) {
        console.error("Image OCR error:", error);

        throw new Error(
            "Failed to extract text from image."
        );
    }
}