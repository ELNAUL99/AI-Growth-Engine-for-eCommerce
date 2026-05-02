# 🚀 AI Growth Engine for eCommerce

> **AI-powered marketing pipeline that automates content generation, distribution, and performance tracking for eCommerce products.**

This project explores how AI can be used to automate and scale marketing content generation and experimentation for eCommerce products. Built in a lean, production-ready architecture with React + TypeScript frontend and Node.js backend.

---

## ✨ What It Does

```
Product Input → AI Content Generation → Storage → Distribution → Performance Tracking → A/B Testing → Iterate
```

**Core Pipeline:**
- 🎯 **Input**: Product name, description, category, price, target audience, brand voice
- 🤖 **AI Generation**: Automatically creates 6 content types × 2 variations (A/B)
  - TikTok-style ad scripts
  - Product descriptions
  - SEO blog posts
  - Ad headlines
  - Social media posts
  - Email sequences
- 📊 **Tracking**: Real-time performance metrics (CTR, engagement, conversion)
- 🧪 **A/B Testing**: Automatic winner selection with confidence scores
- 📈 **Dashboard**: Visual analytics with charts and insights

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React + TS    │────▶│   Node.js API    │────▶│  AI Generation  │
│   (Frontend)    │◀────│   (Backend)      │◀────│  (OpenAI/Mock)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│  Recharts +     │     │  In-Memory DB    │
│  Framer Motion  │     │  (Simulated)     │
└─────────────────┘     └──────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript |
| **AI** | OpenAI API (with mock fallback for demo) |
| **State** | React hooks + REST API polling |
| **Charts** | Recharts (Line, Area, Bar, Pie, Radar) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone & Install

```bash
git clone <repo-url>
cd ai-growth-engine
```

### 2. Start Backend

```bash
cd backend
cp .env.example .env
# Add your OPENAI_API_KEY to .env (optional - mock mode works without it)
npm install
npm run dev
```

Backend runs on `http://localhost:4000`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 📁 Project Structure

```
ai-growth-engine/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry
│   │   ├── types.ts              # Shared TypeScript types
│   │   ├── routes/
│   │   │   ├── products.ts       # Product CRUD + workflow trigger
│   │   │   ├── content.ts        # Content management
│   │   │   ├── workflows.ts      # Workflow monitoring
│   │   │   └── analytics.ts      # Metrics & A/B tests
│   │   ├── services/
│   │   │   ├── aiService.ts      # AI content generation engine
│   │   │   └── workflowEngine.ts # Pipeline orchestration
│   │   └── models/
│   │       └── database.ts       # In-memory data store
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Router setup
│   │   ├── main.tsx              # Entry point
│   │   ├── index.css             # Tailwind + custom styles
│   │   ├── types/
│   │   │   └── index.ts          # Frontend types
│   │   ├── services/
│   │   │   └── api.ts            # API client (axios)
│   │   ├── components/
│   │   │   └── Layout.tsx        # Sidebar + navigation
│   │   └── pages/
│   │       ├── Dashboard.tsx     # Overview + charts
│   │       ├── Products.tsx      # Product management
│   │       ├── Content.tsx       # Generated content library
│   │       ├── Workflows.tsx     # Pipeline execution logs
│   │       └── Analytics.tsx     # Deep analytics + A/B tests
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

---

## 🎯 Features

### Content Generation
- ✅ **6 Content Types**: Ad scripts, descriptions, blogs, headlines, social posts, emails
- ✅ **A/B Variations**: Every piece generated in 2 variants for testing
- ✅ **Brand Voice**: Professional, casual, playful, luxury tones
- ✅ **Keyword Extraction**: Auto-generated SEO keywords

### Workflow Automation
- ✅ **9-Step Pipeline**: Input → Validate → Generate (×6) → Store → A/B Test
- ✅ **Real-time Tracking**: Live step-by-step progress with durations
- ✅ **Error Handling**: Graceful failure recovery

### Analytics & Growth
- ✅ **Performance Metrics**: CTR, engagement, conversion, impressions, clicks
- ✅ **Visual Dashboard**: Line charts, area charts, bar charts, pie charts, radar charts
- ✅ **A/B Test Results**: Winner selection with confidence scores and improvement %
- ✅ **Auto-refresh**: Dashboard updates every 3-5 seconds

### UI/UX
- ✅ **Dark Theme**: Modern glassmorphism design
- ✅ **Responsive**: Mobile-friendly sidebar and layouts
- ✅ **Animations**: Framer Motion page transitions and micro-interactions
- ✅ **Copy-to-Clipboard**: One-click content copying
- ✅ **Content Preview**: Modal detail view for full content

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create product + trigger workflow |
| GET | `/api/content` | List generated content (filterable) |
| POST | `/api/content/:id/publish` | Publish content |
| POST | `/api/content/:id/archive` | Archive content |
| GET | `/api/workflows` | List workflow executions |
| GET | `/api/analytics/metrics` | Dashboard metrics |
| GET | `/api/analytics/ab-tests` | A/B test results |
| GET | `/api/analytics/performance` | Performance time series |

---

## 🧪 Demo Mode

The project includes a **mock AI service** that works without an OpenAI API key:
- Realistic content generation using templates
- Simulated performance metrics
- Full pipeline execution

To use real OpenAI:
1. Add `OPENAI_API_KEY=sk-...` to `backend/.env`
2. Replace `generateAllContent` in `aiService.ts` with actual OpenAI API calls

---

## 📊 Growth Metrics Tracked

| Metric | Description |
|--------|-------------|
| **CTR** | Click-through rate on generated content |
| **Engagement** | User interaction rate |
| **Conversion** | Purchase/sign-up rate |
| **Impressions** | Total content views |
| **Clicks** | Total link clicks |
| **A/B Winner** | Best-performing variation |
| **Confidence** | Statistical confidence in winner |
| **Improvement** | % lift of winner over loser |

---

## 🚦 7-Day Build Plan

| Day | Focus | Status |
|-----|-------|--------|
| 1 | Setup repo, basic UI, backend API | ✅ |
| 2 | AI content generation (ad copy, descriptions, scripts) | ✅ |
| 3 | Multi-content output (blogs, keywords, variations) | ✅ |
| 4 | Workflow logic (pipeline automation) | ✅ |
| 5 | Dashboard (content list, versions, mock performance) | ✅ |
| 6 | Growth angle (A/B testing, fake CTR, engagement) | ✅ |
| 7 | Polish UI + killer README | ✅ |

---

## 🎨 Design Decisions

- **Glassmorphism**: Modern translucent panels with backdrop blur
- **Gradient Accents**: Primary (cyan) + Accent (magenta) color scheme
- **Real-time Feel**: Auto-polling creates live dashboard experience
- **Mobile-First**: Collapsible sidebar, responsive grids
- **Motion**: Staggered animations, smooth transitions, loading states

---

## 🚀 Future Enhancements

- [ ] Real OpenAI GPT-4 integration
- [ ] PostgreSQL database persistence
- [ ] n8n workflow automation integration
- [ ] Actual social media publishing APIs
- [ ] User authentication & multi-tenant support
- [ ] Content scheduling & calendar view
- [ ] AI image generation (DALL-E)
- [ ] Multi-language content generation
- [ ] SEO scoring & optimization suggestions

---

## 📄 License

MIT License - Built for growth teams and eCommerce operators.

---

> **Built with ❤️ for growth-minded engineers who ship fast and iterate faster.**
