
import { Bot, session } from "grammy";

import { TELEGRAM_BOT_TOKEN } from "./config/env.js";

import { start } from "./bot/commands/start.js";
import { addJd } from "./bot/commands/addJd.js";
import { addResume } from "./bot/commands/addResume.js";
import { analyze } from "./bot/commands/analyze.js";
import { compare } from "./bot/commands/compare.js";
import { status } from "./bot/commands/status.js";
import { clear } from "./bot/commands/clear.js";

import { textHandler } from "./bot/handlers/textHandler.js";
import { documentHandler } from "./bot/handlers/documentHandler.js";
import { photoHandler } from "./bot/handlers/photoHandler.js";

const bot = new Bot(TELEGRAM_BOT_TOKEN);

// Session middleware
bot.use(
    session({
        initial: () => ({
            waitingFor: null,
            jdText: null,
            jdData: null,
            resumeText: null,
            resumes: []
        })
    })
);

// Commands
bot.command("start", start);
bot.command("add_jd", addJd);
bot.command("add_resume", addResume);
bot.command("analyze", analyze);
bot.command("compare", compare);
bot.command("status", status);
bot.command("clear", clear);

// Message handlers
bot.on("message:text", textHandler);
bot.on("message:document", documentHandler);
bot.on("message:photo", photoHandler);

// Start bot
bot.start();

