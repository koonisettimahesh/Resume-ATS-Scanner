
import "dotenv/config";

export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env");
}

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is missing in .env");
}