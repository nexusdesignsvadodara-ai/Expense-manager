# Expense Manager

A mobile-friendly expense submission form that saves directly to Notion in real time.

## Stack
- **Frontend**: Static HTML (hosted via Netlify)
- **Backend**: Netlify Serverless Function (handles Notion API, fixes CORS)
- **Database**: Notion

## Deploy in 5 Minutes

### 1. Push this repo to GitHub
Upload all files to a new GitHub repository.

### 2. Connect to Netlify (free)
1. Go to [netlify.com](https://netlify.com) → Sign up free
2. Click **"Add new site" → "Import an existing project"**
3. Choose **GitHub** → Select this repository
4. Build settings are auto-detected from `netlify.toml`
5. Click **Deploy**

### 3. Add Environment Variables in Netlify
Go to **Site Settings → Environment Variables → Add variable**:

| Key | Value |
|-----|-------|
| `NOTION_TOKEN` | Your Notion integration token (`secret_...`) |
| `NOTION_DB_ID` | Your Notion database ID (32 chars, no dashes) |

Then go to **Deploys → Trigger deploy** to redeploy with the new variables.

### 4. Share the Link!
Your site URL (e.g. `https://your-site.netlify.app`) is ready to share on WhatsApp.

## Notion Database Setup
The database should have these columns:
- `Expense Name` — Title
- `Date` — Date
- `Amount` — Number (₹ Rupee)
- `Payment Mode` — Select (Cash, UPI, Card, Bank Transfer)
- `Receipt Taken` — Checkbox
- `Notes` — Text

## Google Sheets Sync
See the Apps Script sync code in the main setup guide.
