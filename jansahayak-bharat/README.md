# 🇮🇳 जनसहायक भारत (JanSahayak Bharat) — Full Stack

A real, working full-stack citizen-services platform for rural India: complaints,
government schemes, government jobs, helplines, weather, mandi prices, news, and an
AI assistant — built with **React + Tailwind**, **Node.js + Express**, and
**Firebase (Auth, Firestore, Storage)**.

This is production-shaped code, not a mockup. Every route talks to a real service.
To go live you only need to (1) create a Firebase project, (2) get the API keys
listed below, and (3) deploy backend + frontend as described.

---

## ⚠️ Read this first — about the requested APIs

Before you plug in keys, know what's real and what isn't, so nothing surprises you later:

| API | Status | Notes |
|---|---|---|
| Firebase Auth / Firestore / Storage | ✅ Real | Google product, works exactly as coded |
| Gemini AI | ✅ Real | Google AI Studio, free tier available |
| OpenWeatherMap | ✅ Real | Free tier available |
| NewsAPI.org | ✅ Real | Free dev tier (not for production traffic — see below) |
| data.gov.in Mandi Bhav (Agmarknet) | ✅ Real government API | Free registration at data.gov.in |
| Google Maps / Places | ✅ Real | Requires billing account, has a free monthly credit |
| **"Government Schemes API"** | ❌ Does not exist | India has no official public API for scheme data. myscheme.gov.in has no open API. This app instead gives you a full **Admin Panel** to publish/manage schemes in Firestore — the same approach real portals use. |
| **"Government Jobs API"** | ❌ Does not exist | Railways, SSC, UPSC, and state PSCs each publish independently (mostly as PDFs), with no unified API. Same solution: manage listings via the Admin Panel. |

If your project depends on scheme/job data being "live" from day one, plan for manual
or admin-team data entry — that's genuinely how sites like this are built and kept
current in practice.

---

## 🗂️ Project structure

```
jansahayak-bharat/
├── backend/              Node.js + Express API
│   ├── config/           Firebase Admin SDK init
│   ├── middleware/       Auth token verification, admin guard
│   ├── routes/           auth, complaints, schemes, jobs, weather, news, mandi, ai, pdf, admin
│   ├── utils/            PDF generator
│   ├── server.js
│   ├── firestore.rules
│   ├── storage.rules
│   ├── render.yaml       One-click Render deploy config
│   └── .env.example
├── frontend/              React (Vite) + Tailwind
│   ├── src/
│   │   ├── pages/         Home, Login, Register, Complaints, Schemes, Jobs, Admin
│   │   ├── components/    Navbar, SearchBar, VoiceSearch, AIChat, widgets...
│   │   ├── context/       AuthContext (Firebase Auth)
│   │   ├── api/           Axios client with auto Firebase-token injection
│   │   └── firebase.js
│   └── .env.example
├── firebase.json          Firebase Hosting + rules deploy config
└── README.md               ← you are here
```

---

## 1. Firebase project setup (10 minutes)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. **Authentication** → Sign-in method → enable **Email/Password** and **Google**.
3. **Firestore Database** → Create database (production mode, pick a region close to India, e.g. `asia-south1`).
4. **Storage** → Get started (same region).
5. **Project Settings → General → Your apps → Add app (Web)**. Copy the config values into `frontend/.env` (see `.env.example`).
6. **Project Settings → Service accounts → Generate new private key**. This JSON gives you `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` for `backend/.env`.

### Making a user an Admin
The simplest reliable approach: set their email in `ADMIN_EMAILS` in `backend/.env`
(comma-separated). For stronger security later, set a custom claim instead:

```js
// run once, e.g. in a local Node script using firebase-admin
await admin.auth().setCustomUserClaims(uid, { admin: true });
```
and update `firestore.rules` / `adminMiddleware.js` to trust `request.auth.token.admin`.

---

## 2. Get your API keys

- **Gemini**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — free key, instant.
- **OpenWeatherMap**: [openweathermap.org/api](https://openweathermap.org/api) — sign up, free tier.
- **NewsAPI**: [newsapi.org](https://newsapi.org) — free dev key (note: free tier blocks production domains; for a live site either upgrade or swap in RSS feeds from pib.gov.in as noted in `newsRoutes.js`).
- **data.gov.in**: [data.gov.in](https://data.gov.in) — register, generate API key, search resource "Variety-wise Daily Market Prices" for the correct `resource_id` (one is pre-filled as an example — verify it's current on the portal).
- **Google Maps**: [console.cloud.google.com](https://console.cloud.google.com) — enable "Maps JavaScript API" + "Places API", create a key, restrict it to your domain.

Fill these into `backend/.env` (copy from `backend/.env.example`) and `frontend/.env`
(copy from `frontend/.env.example`).

---

## 3. Run locally

```bash
# Backend
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev             # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env    # then fill in real values, VITE_API_BASE_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
```

---

## 4. Deploy the backend to Render

1. Push this repo to GitHub.
2. On [render.com](https://render.com) → New → Blueprint → connect your repo. Render will read `backend/render.yaml` automatically.
3. In the Render dashboard, fill in the environment variables marked `sync: false` (all your API keys) — Render won't accept secrets committed to the repo.
4. Deploy. Note your live URL, e.g. `https://jansahayak-bharat-api.onrender.com`.
5. Update `frontend/.env` → `VITE_API_BASE_URL=https://jansahayak-bharat-api.onrender.com/api`, and update `FRONTEND_URL` in the Render env vars once you know your frontend URL (step 5 below), then redeploy the backend so CORS allows it.

## 5. Deploy the frontend to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
cd jansahayak-bharat
cp .firebaserc.example .firebaserc   # edit with your project id
cd frontend && npm run build && cd ..
firebase deploy --only hosting,firestore:rules,storage:rules
```

Your site will be live at `https://your-project-id.web.app`.

(Alternative: deploy `frontend/dist` to Vercel or Netlify instead — same build output, either works.)

---

## 6. Adding real scheme/job data

Log in with an admin email → visit `/admin` → use the **"नई योजना जोड़ें"** /
**"नई नौकरी जोड़ें"** forms. This writes directly to Firestore through the protected
`/api/schemes` and `/api/jobs` admin routes. For bulk import, write a one-off Node
script using `firebase-admin` to batch-write a CSV/JSON of scheme or job data you've
compiled from official department pages.

---

## Security notes

- All write operations (complaints, schemes, jobs) go through backend routes that verify a real Firebase ID token — never trust the client alone.
- `firestore.rules` and `storage.rules` are included and deployed alongside your code — don't skip deploying them, they're your actual data security layer, not just documentation.
- Rate limiting is enabled on `/api/*` (300 req / 15 min per IP) — tune `server.js` for your traffic.
- PDF generation currently uses Latin-script fonts by default; for correctly rendered Hindi PDFs, add a Devanagari `.ttf` (e.g. Noto Sans Devanagari) to `backend/fonts/` and register it in `utils/pdfGenerator.js` via `doc.registerFont()` — flagged inline in that file.

## What's genuinely production-ready vs. what needs your finishing touches

**Ready to go:** Auth, Firestore data model, complaint lifecycle + PDF receipts, admin CRUD for schemes/jobs, Gemini AI assistant, weather/news/mandi live integrations, voice search (browser-native, no key needed), security rules, rate limiting, deploy configs.

**Needs your input before real users depend on it:** admin-entered scheme/job content (see the API reality table above), a Devanagari font for PDFs, a paid NewsAPI/News source if you expect real traffic, and a review of Firestore composite indexes (Firebase will prompt you with a direct link to create any needed index the first time a query needs one — just click it).
