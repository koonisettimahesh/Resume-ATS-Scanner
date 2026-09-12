# ATS Resume Analyzer Bot

A Telegram bot that analyzes resumes against Job Descriptions and provides a deterministic ATS score with AI-powered explanations and recommendations.

## Features

- Add Job Description
- Add Resume
- Support PDF files
- Support DOCX files
- Support image-based resumes/JDs using OCR
- Support plain text input
- Calculate deterministic ATS scores
- Compare multiple candidates
- Get AI-powered resume recommendations
- View current session status
- Clear uploaded data

## ATS Scoring

The ATS score is calculated by the application rather than by the AI model.

| Category | Weight |
|---|---:|
| Skills | 50% |
| Keywords | 20% |
| Experience | 20% |
| Education | 10% |
| **Total** | **100%** |

The deterministic scoring approach ensures that the same extracted Job Description and resume text produce the same ATS score.

Groq is used only for:

- Job Description requirement extraction
- Score explanation
- Resume improvement recommendations
- Candidate comparison

## Project Structure

```text
ats-resume-bot/
├── src/
│   ├── bot/
│   │   ├── commands/
│   │   │   ├── start.js
│   │   │   ├── addJd.js
│   │   │   ├── addResume.js
│   │   │   ├── analyze.js
│   │   │   ├── compare.js
│   │   │   ├── status.js
│   │   │   └── clear.js
│   │   │
│   │   └── handlers/
│   │       ├── textHandler.js
│   │       ├── documentHandler.js
│   │       └── photoHandler.js
│   │
│   ├── services/
│   │   ├── ats/
│   │   │   ├── atsScorer.js
│   │   │   ├── skillMatcher.js
│   │   │   ├── keywordMatcher.js
│   │   │   ├── experienceMatcher.js
│   │   │   └── educationMatcher.js
│   │   │
│   │   ├── ai/
│   │   │   ├── groqClient.js
│   │   │   ├── jdParser.js
│   │   │   ├── analysisService.js
│   │   │   └── comparisonService.js
│   │   │
│   │   └── extraction/
│   │       ├── pdfExtractor.js
│   │       ├── docxExtractor.js
│   │       └── imageExtractor.js
│   │
│   ├── utils/
│   │   ├── textUtils.js
│   │   ├── htmlUtils.js
│   │   └── fileUtils.js
│   │
│   ├── config/
│   │   └── env.js
│   │
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
````

## Requirements

* Node.js
* Telegram Bot Token
* Groq API Key

## Installation

Clone the project and install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

Never commit the `.env` file to Git.

## Run the Bot

Start the application with:

```bash
node src/app.js
```

## Telegram Commands

### `/start`

Displays the available commands and supported file types.

### `/add_jd`

Starts Job Description input.

The user can provide:

* PDF
* DOCX
* Image
* Plain text

### `/add_resume`

Starts Resume input.

The user can provide:

* PDF
* DOCX
* Image
* Plain text

### `/analyze`

Analyzes the current resume against the Job Description.

The result contains:

* ATS score
* Score breakdown
* Matched skills
* Missing skills
* Resume strengths
* Resume weaknesses
* Recommendations

### `/compare`

Compares multiple uploaded resumes against the same Job Description.

Candidates are ranked according to their deterministic ATS scores.

### `/status`

Shows whether a Job Description and resumes have been added.

### `/clear`

Clears the current Job Description, resume, comparison resumes, and waiting state.

## Processing Flow

```text
User
 ↓
Telegram Bot
 ↓
Command / Handler
 ↓
File or Text Extraction
 ↓
Job Description / Resume Text
 ↓
JD Requirement Extraction
 ↓
Deterministic ATS Scoring
 ↓
Groq AI Explanation
 ↓
Telegram Response
```

## Technologies

* Node.js
* JavaScript
* grammY
* Groq API
* OpenAI Node.js SDK
* pdf-parse
* Mammoth
* Tesseract.js

## Security

Keep API keys and Telegram credentials in environment variables.

Do not place secrets directly inside source code.

Add `.env` to `.gitignore`:

```gitignore
node_modules/
.env
```

## License

This project is for educational and development purposes.

