
import fs from "fs/promises";

export async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
}

export function getFileExtension(fileName) {
    return fileName
        .split(".")
        .pop()
        .toLowerCase();
}