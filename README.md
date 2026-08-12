# 🎬 FlixGenie

**An AI-powered movie discovery platform** — browse trending movies, get personalized AI recommendations, watch trailers and free classic films, and build your own watchlist, all wrapped in a Netflix-inspired UI.

🔗 **Live Demo:** [flixgenie-frontend.onrender.com](https://flixgenie-frontend.onrender.com)
🔗 **Backend API:** [flixgenie-backend.onrender.com](https://flixgenie-backend.onrender.com)
📦 **Repository:** [github.com/Rohit-6522/FlixGenie](https://github.com/rohit6522/FlixGenie)

> Note: The backend is hosted on Render's free tier, so the first request after inactivity may take 30–50 seconds to wake up.

---

## ✨ Features

- 🔐 **Authentication** — Sign up / Sign in with Firebase (Email & Password), with persisted sessions
- 🤖 **AI Recommendations** — Natural language movie suggestions powered by Groq (Llama 3.3 70B)
- 🧠 **AI Similar Movies** — Every movie modal suggests 6 similar titles, generated on the fly by AI
- 🎥 **Movie Discovery** — Trending, Popular, Top Rated rows, plus category tabs (Hollywood, South Movies, Web Series)
- 🔍 **Search** — Instant search by movie title
- 🖼️ **Hero Banner** — Netflix-style featured movie showcase
- ▶️ **Trailer Playback** — Embedded YouTube trailers inside the movie modal
- 🎬 **Watch Free Classics** — 60+ public domain films, dynamically pulled from the Internet Archive and playable in-app, 100% legally
- 📌 **Watchlist** — Add/remove movies to a personal watchlist, stored in Firestore
- 👤 **Profile Management** — Update display name
- 🌐 **Multilingual UI** — English / Hindi toggle (i18next)
- 💀 **Skeleton Loaders** — Shimmer loading states instead of plain text
- 🎞️ **Animations** — Smooth transitions and hover effects via Framer Motion
- 📱 **Responsive Design** — Works across devices

## 🛠️ Tech Stack

**Frontend:** React (Vite), Redux Toolkit, Tailwind CSS v4, React Router, Framer Motion, i18next, Axios, Firebase Auth + Firestore

**Backend:** Node.js, Express, Groq API (Llama 3.3 70B), OMDb API, YouTube Data API v3, Internet Archive API

**Deployment:** Render (Web Service for backend, Static Site for frontend)

## 🏗️ Architecture

```
FlixGenie/
├── backend/                  # Express server — proxies AI & movie data requests
│   └── server.js
└── frontend/                 # React app
    └── src/
        ├── components/       # Navbar, MovieCard, HeroBanner, Modal, GptSearch, CategoryTabs...
        ├── pages/             # Login, Browse, Watchlist, Profile
        ├── store/             # Redux store & user slice
        ├── firebase/          # Auth config, auth service, watchlist service
        ├── hooks/             # Custom data-fetching hooks
        ├── i18n/              # English/Hindi translations
        └── utils/             # Curated movie title lists
```

## 🔒 Why a Backend?

The OpenAI/Groq API key must never be exposed client-side — anyone could extract it from browser dev tools. The Express backend acts as a secure proxy for all third-party API calls (Groq, OMDb, YouTube), keeping every API key server-side.

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- A Firebase project with Authentication and Firestore enabled
- [Groq API key](https://console.groq.com/keys) (free)
- [OMDb API key](https://www.omdbapi.com/apikey.aspx) (free)
- [YouTube Data API key](https://console.cloud.google.com/) (free, via Google Cloud Console)

### 1. Clone the repo
```bash
git clone https://github.com/Raj-Satyam1206/FlixGenie.git
cd FlixGenie
```

### 2. Backend setup
```bash
cd backend
npm install
```
Create `backend/.env`:
```
PORT=5000
GROQ_API_KEY=your_groq_key
OMDB_API_KEY=your_omdb_key
YOUTUBE_API_KEY=your_youtube_key
```
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```
Create `frontend/.env`:
```
VITE_BACKEND_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```
```bash
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173`

## 📸 Screenshots

| Login | Browse (Hero + Categories) | Movie Modal + Trailer | Watchlist |
|---|---|---|---|
| _add screenshot_ | _add screenshot_ | _add screenshot_ | _add screenshot_ |

## 🧭 Roadmap / Ideas for future work
- User reviews & ratings
- "Where to Watch" integration (JustWatch-style links to licensed platforms)
- Recently viewed history
- Infinite scroll on search results

## 📄 License

This project is for educational/portfolio purposes. Public domain films are sourced from the [Internet Archive](https://archive.org) and are legally free to distribute.
