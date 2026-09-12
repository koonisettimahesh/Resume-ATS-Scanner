
export function normalizeText(text) {
    if (!text) {
        return "";
    }

    return text
        .toLowerCase()
        .replace(/[^\w\s+#.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


/**
 * Checks whether a complete word/phrase exists in the text.
 *
 * Examples:
 * containsWord("I know Java", "java")       → true
 * containsWord("I know JavaScript", "java") → false
 * containsWord("React developer", "react")  → true
 */
export function containsWord(text, word) {
    if (!text || !word) {
        return false;
    }

    const normalizedText = normalizeText(text);
    const normalizedWord = normalizeText(word);

    // Escape special regex characters
    const escapedWord = normalizedWord.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    // Word-boundary matching
    const regex = new RegExp(
        `(^|\\s)${escapedWord}(?=\\s|$)`,
        "i"
    );

    return regex.test(normalizedText);
}