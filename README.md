# MTV Portal System

### National Meat Inspection Service – Central Luzon Region

A production-ready government web application for Meat Transportation Vehicle (MTV) Accreditation, built with **Next.js 14**. All services used are **100% free**.

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local
# Edit .env.local — leave NEXT_PUBLIC_DEMO_MODE=true for local testing

# 3. Run development server
npm run dev
# Open http://localhost:3000
```

> Demo mode works immediately — no Google account needed.

---

## Why This Is Free

| Service                | Usage                                    | Cost                    |
| ---------------------- | ---------------------------------------- | ----------------------- |
| **Google Sheets API**  | Read/write accredited & banned MTV lists | Free (within quota)     |
| **Google Drive API**   | Store MTV application documents          | Free (15 GB included)   |
| **Gmail + Nodemailer** | Send GHP certificates & acknowledgements | Free (500/day via SMTP) |
| **Vercel**             | Hosting + serverless API routes          | Free tier               |
| **Next.js**            | Framework                                | Open source             |

> You only need a Google account and a free Gmail address. No billing required.

---

## Free Services Setup

### A. Gmail App Password (for sending certificates)

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification** (required for App Passwords)
3. Go to **Security → App Passwords**
4. Select app: **Mail**, device: **Other** → name it "MTV Portal"
5. Copy the 16-character password → paste into `GMAIL_APP_PASSWORD` in `.env.local`

### C. Google OAuth 2.0 (for Google Drive + Sheets)

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → Create a free project
2. Enable **Google Drive API** and **Google Sheets API** (both free)
3. Go to **APIs & Services → Credentials** → **Create Credentials → OAuth 2.0 Client IDs**
4. Choose **Desktop application** → Name it "MTV Portal"
5. Download the JSON file → copy `client_id` and `client_secret`
6. Copy your **Spreadsheet ID** from the Sheet URL → `GOOGLE_SHEET_ID`
7. Copy your **Drive folder ID** from the folder URL → `GOOGLE_DRIVE_FOLDER_ID`
8. **Share** both the spreadsheet and Drive folder with your Gmail address (Editor access)
9. Run the refresh token script:
   ```bash
   node get-refresh-token.js
   ```
   Follow the prompts to get your `GOOGLE_REFRESH_TOKEN`

---

## Google Sheets Structure

Create a spreadsheet with **five tabs**:

### `Accredited` (existing MTV records — edit manually or import CSV)

```
plate | business | type | owner | expiry | status
```

### `Banned`

```
plate | business | owner | reason | date | status
```

### `Applications` (written automatically by the system)

```
ref_number | timestamp | firstname | lastname | email | contact |
address | province | plate | vtype | vmake | vmodel | vyear |
capacity | bname | btype | baddress | drive_folder_id | status
```

### `GHP_Completions` (written automatically)

```
cert_number | timestamp | name | email | score | pct | issued_date
```

### `Contacts` (written automatically)

```
timestamp | name | email | phone | subject | message | status
```

---

## Google Drive Structure

Create one folder in your Google Drive, e.g. **"MTV Applications"**.

- Share it with your service account email (Editor access).
- Copy the folder ID from the URL → `GOOGLE_DRIVE_FOLDER_ID`.

When an application is submitted, the system automatically creates a **sub-folder** named `MTV-2025-XXXXX_ApplicantName` inside your folder, and uploads each document into it.

---

## Project Structure

```
src/
├── app/                        ← Pages + API routes
│   ├── page.jsx                ← Home (/)
│   ├── ghp/page.jsx            ← GHP Orientation — STANDALONE
│   ├── apply/page.jsx          ← MTV Application — STANDALONE
│   ├── verify/page.jsx         ← Verify MTV
│   ├── banned/page.jsx         ← Banned list
│   ├── contact/page.jsx        ← Contact Us
│   └── api/
│       ├── ghp/route.js        ← POST: validate quiz + send certificate email
│       ├── verify/route.js     ← GET: accredited MTV list
│       ├── banned/route.js     ← GET: banned MTV list
│       ├── applications/route.js ← POST: save application + upload docs to Drive
│       └── contact/route.js    ← POST: save contact message
│
├── components/
│   ├── layout/  Header, Footer
│   ├── ui/      Toast, StatusTag, DataTable
│   ├── home/    HeroSection, QuickActions, ProcessSteps, CTAStrip…
│   ├── ghp/     StepsBar, VideoCard, QuizCard, CertCard  ← independent
│   ├── apply/   ApplicationForm, Step1–4, SuccessView    ← independent
│   └── verify/  VerifySearch
│
├── data/        demoData.js, quizData.js, requiredDocs.js
├── hooks/       useToast.js, useMTVData.js, usePagination.js
├── lib/
│   ├── constants.js       ← app-wide constants
│   ├── certNumber.js      ← generateCertNumber(), generateRefNumber()
│   ├── emailService.js    ← Gmail/Nodemailer (free) – certificate + ACK emails
│   ├── driveService.js    ← Google Drive upload (free)
│   ├── googleSheets.js    ← Sheets read/write (free)
│   └── utils.js           ← pure helpers
└── styles/globals.css     ← design tokens + shared CSS
```

---

## Feature Details

### GHP Orientation (`/ghp`) — Standalone

1. **Watch** the orientation video (click "Mark as Watched")
2. **Take** the 5-question quiz (≥70% to pass)
3. **Claim** your certificate — enter name + email → certificate sent via Gmail

The certificate is a **branded HTML email** matching the NMIS Google Slides template design (green header, gold accents, certificate number, official seal). It is completely free to send via Gmail.

### Submit Application (`/apply`) — Standalone

- 4-step form: Applicant Info → Vehicle Details → Documents → Review
- Documents (PDF/JPG/PNG, max 5 MB each) are saved to your **Google Drive folder**
- Application data is saved to **Google Sheets**
- Acknowledgement email sent automatically to the applicant

### Verify MTV (`/verify`)

- Search by plate number or business name
- URL query support: `/verify?q=ABC1234`
- Paginated table of all accredited MTVs

### Banned MTV (`/banned`)

- Searchable table of banned/suspended/revoked vehicles

---

## Deploy to Vercel (Free)

```bash
# Option A: CLI
npx vercel --prod

# Option B: GitHub
# Push to GitHub → vercel.com → Import → Add env vars → Deploy
```

**Add these environment variables in Vercel dashboard:**

```
NEXT_PUBLIC_DEMO_MODE=false
GOOGLE_SHEET_ID=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
GOOGLE_DRIVE_FOLDER_ID=...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
GMAIL_FROM_NAME=NMIS Central Luzon
```

---

## npm install Error Fix

The `enoent` error was caused by a missing `jsconfig.json` for the `@/` path alias.
This is now included in the project root. If you still see errors:

```bash
# Make sure you are inside the project folder
cd mtv-portal
npm install
npm run dev
```
