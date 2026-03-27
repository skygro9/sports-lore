# Sports Lore — Deployment Guide

A step-by-step guide to getting Sports Lore live on the internet. No prior experience needed.

---

## What you need before starting

- A computer with internet access
- About 30 minutes
- A credit card for Vercel (free tier, no charge)

---

## Step 1 — Install the tools you need

You need two programs: **Node.js** and **Git**.

### Install Node.js
1. Go to https://nodejs.org
2. Click the big green "LTS" button to download
3. Open the downloaded file and follow the installer
4. When done, open **Terminal** (Mac) or **Command Prompt** (Windows) and type:
   ```
   node --version
   ```
   You should see something like `v20.0.0`. That means it worked.

### Install Git
1. Go to https://git-scm.com/downloads
2. Download and install for your operating system
3. Accept all the default settings during installation

---

## Step 2 — Get your Anthropic API key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Click **"API Keys"** in the left sidebar
4. Click **"Create Key"**
5. Give it a name like "Sports Lore"
6. **Copy the key** — it starts with `sk-ant-...`
7. Save it somewhere safe (like a note on your phone) — you won't be able to see it again

---

## Step 3 — Set up GitHub (where your code lives)

1. Go to https://github.com and create a free account
2. Click the **+** button in the top right → **"New repository"**
3. Name it `sports-lore`
4. Leave everything else as default
5. Click **"Create repository"**
6. You'll see a page with setup instructions — leave this tab open

---

## Step 4 — Put the code on GitHub

Open Terminal (Mac) or Command Prompt (Windows).

Navigate to the sports-lore folder. If it's on your Desktop:
```bash
cd ~/Desktop/sports-lore
```

Now run these commands one at a time, pressing Enter after each:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sports-lore.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

If it asks for your GitHub username and password, enter them. For the password, you may need a **Personal Access Token** — GitHub will prompt you with a link to create one.

---

## Step 5 — Deploy on Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Add New Project"**
5. You'll see your `sports-lore` repository — click **"Import"**
6. On the next screen:
   - **Framework Preset**: Select **"Vite"**
   - Leave everything else as default
7. Click **"Deploy"**

Vercel will build your site. This takes about 60 seconds.

---

## Step 6 — Add your API key (critical!)

Your site is live but won't work yet because it needs your Anthropic API key.

1. In Vercel, click on your project
2. Click **"Settings"** in the top navigation
3. Click **"Environment Variables"** in the left sidebar
4. Click **"Add New"**
5. Fill in:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: paste your `sk-ant-...` key here
   - **Environment**: check all three boxes (Production, Preview, Development)
6. Click **"Save"**
7. Go back to your project overview
8. Click **"Deployments"** → click the three dots on your latest deployment → **"Redeploy"**

This restarts the site with your API key active.

---

## Step 7 — Your site is live!

Vercel gives you a URL like `sports-lore-xyz.vercel.app`. That's your site.

Open it in a browser. It will:
1. Try to detect your location
2. Load your local MLB team
3. Pull live standings and game data from the MLB API
4. Generate the nerd translation using Claude

---

## Making changes later

Whenever you want to update the site:
1. Edit the files on your computer
2. Open Terminal and run:
   ```bash
   git add .
   git commit -m "What I changed"
   git push
   ```
3. Vercel automatically detects the push and redeploys. Takes about 60 seconds.

---

## Troubleshooting

**"The oracle went dark" error**
→ Your API key isn't set up correctly. Go back to Step 6.

**Site loads but shows no data**
→ The MLB API might be temporarily down. Wait a few minutes and refresh.

**Git says "permission denied"**
→ You need a GitHub Personal Access Token. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate New Token. Use that as your password.

**Vercel build fails**
→ Check the build logs in Vercel. The most common issue is a missing file. Make sure all files listed in this project are present.

---

## File structure for reference

```
sports-lore/
├── api/
│   ├── claude.js      ← keeps your API key server-side
│   └── mlb.js         ← proxies MLB Stats API calls
├── src/
│   ├── main.jsx       ← app entry point
│   └── App.jsx        ← the entire app
├── public/
├── index.html         ← HTML shell
├── package.json       ← project config
├── vite.config.js     ← build config
├── vercel.json        ← Vercel routing config
└── README.md          ← this file
```
