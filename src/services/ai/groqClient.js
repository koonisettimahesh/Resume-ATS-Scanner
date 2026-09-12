
import OpenAI from "openai";
import { GROQ_API_KEY } from "../../config/env.js";

export const groqClient = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});