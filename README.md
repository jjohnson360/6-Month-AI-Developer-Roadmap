<div align="center">

```
███████╗███████╗██████╗  ██████╗  ██████╗    ██╗      █████╗ ██████╗ ███████╗
██╔════╝██╔════╝╚════██╗██╔════╝ ██╔═████╗   ██║     ██╔══██╗██╔══██╗██╔════╝
█████╗  █████╗   █████╔╝███████╗ ██║██╔██║   ██║     ███████║██████╔╝███████╗
██╔══╝  ██╔══╝   ╚═══██╗██╔═══██╗████╔╝██║   ██║     ██╔══██║██╔══██╗╚════██║
██║     ██║     ██████╔╝╚██████╔╝╚██████╔╝   ███████╗██║  ██║██████╔╝███████║
╚═╝     ╚═╝     ╚═════╝  ╚═════╝  ╚═════╝    ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝
```

# 6-Month AI Developer Roadmap

**A structured, project-driven journey into full-stack engineering and AI development**
*Engineered under the ff360 Labs venture — building in public, one milestone at a time.*

---

[![Month 1](https://img.shields.io/badge/Month%201-Python%20Fundamentals-brightgreen?style=flat-square&logo=python&logoColor=white)](Month%201/)
[![Month 2](https://img.shields.io/badge/Month%202-API%20%26%20Full--Stack-brightgreen?style=flat-square&logo=fastapi&logoColor=white)](Month%202/)
[![Month 3](https://img.shields.io/badge/Month%203-AI%20%26%20ML%20Foundations-lightgrey?style=flat-square&logo=tensorflow&logoColor=white)](Month%203/)
[![Month 4](https://img.shields.io/badge/Month%204-LLMs%20%26%20Agents-lightgrey?style=flat-square&logo=openai&logoColor=white)](Month%204/)
[![Month 5](https://img.shields.io/badge/Month%205-Cloud%20%26%20MLOps-lightgrey?style=flat-square&logo=googlecloud&logoColor=white)](Month%205/)
[![Month 6](https://img.shields.io/badge/Month%206-Capstone%20Project-lightgrey?style=flat-square&logo=rocket&logoColor=white)](Month%206/)

</div>

---

## 🗺️ Overview

This repository is the **complete, living record** of a structured 6-month curriculum designed to transform Python fundamentals into production-grade, AI-powered full-stack engineering.

Every month, a new technical domain is introduced. Every week, a concrete project milestone is shipped. Each milestone builds on the last — no tutorials, no hand-holding, only real code built and deployed.

| Month | Focus | Status |
|-------|-------|--------|
| **Month 1** | Python Fundamentals & CLI Tools | ✅ **Complete** |
| **Month 2** | Python & API Foundations · Full-Stack Engineering | ✅ **Complete** |
| **Month 3** | AI, Machine Learning & Data Science Foundations | 🔜 Up Next |
| **Month 4** | LLMs, Prompt Engineering & AI Agents | ⬜ Planned |
| **Month 5** | Cloud Architecture, MLOps & Infrastructure | ⬜ Planned |
| **Month 6** | Capstone: End-to-End AI Product | ⬜ Planned |

---

## ✅ Month 1 — Python Fundamentals & CLI Tools

**Milestone:** Pure Python Loan Amortization Calculator

> A precision-grade command-line tool demonstrating production Python practices — no external dependencies, just the standard library done right.

**Skills Demonstrated:**
- `decimal` module for financial-precision arithmetic (avoids IEEE 754 float rounding errors)
- `argparse` CLI interface with validation
- `unittest` test suite with full edge-case coverage
- Modular Python project structure

📁 [`Month 1/Week 2/amortization-calculator/`](Month%201/Week%202/amortization-calculator/)

---

## ✅ Month 2 — Python & API Foundations

**Flagship Project: Personal Finance Tracker** — A production-ready full-stack web application built iteratively across 4 weeks.

### Week-by-Week Milestones

#### Week 1 — FastAPI REST Backend
- Designed a RESTful API from scratch using **FastAPI** and **Pydantic v2**
- Defined strict request/response schemas with automatic OpenAPI docs
- Served via **Uvicorn** ASGI server
- In-memory transaction storage with full CRUD endpoints

📁 [`Month 2/Week 1/finance-tracker-backend/`](Month%202/Week%201/finance-tracker-backend/)

#### Week 2 — PostgreSQL & SQLAlchemy ORM
- Migrated storage from in-memory to **PostgreSQL** via **SQLAlchemy ORM**
- Designed a relational database schema with proper indexing
- Implemented `Session` lifecycle management and dependency injection
- SQLite dev fallback for zero-friction local development

📁 [`Month 2/Week 2/finance-tracker-frontend/`](Month%202/Week%202/finance-tracker-frontend/)

#### Week 3 — React Analytics Dashboard
- Built a full **React 18 + Vite** single-page application
- Styled with **Tailwind CSS** — rebranded to the **ff360 Labs design system** (deep black `#0a0a0b`, matte charcoal `#17171a`, metallic gold `#c9a15a`)
- Integrated **Recharts** for interactive financial data visualizations:
  - Donut chart: Expense breakdown by category
  - Bar chart: Income vs. Expense comparison
- Real-time metric cards: Balance, Income, Expenses, Savings Rate

📁 [`Month 2/Week 3/finance-tracker-analytical-dashboard/`](Month%202/Week%203/finance-tracker-analytical-dashboard/)

#### Week 4 — JWT Authentication & Cloud Prep ⭐
- Implemented full **JWT Bearer Token** authentication (register → login → protected routes)
- **bcrypt** password hashing via `passlib`
- **User data isolation** — every transaction scoped to its authenticated owner via `user_id` foreign key
- Auth screens (Sign In / Sign Up) built directly into the React frontend with the ff360 Labs gold-accented glassmorphic UI
- Backend hardened for production:
  - `DATABASE_URL` read from environment variable
  - `ALLOWED_ORIGINS` CORS middleware configurable per environment
  - `Procfile` for Render / Heroku-style deployment
- Frontend production-ready:
  - `VITE_BACKEND_URL` environment variable for dev/prod switching
  - Vite proxy for local dev (`/api` → `:8000`)

📁 [`Month 2/Week 4/finance-tracker-fullstack-auth/`](Month%202/Week%204/finance-tracker-fullstack-auth/)

---

## 🏗️ Featured Project — Personal Finance Tracker

> **The capstone of Month 2.** A complete, authenticated, cloud-deployable full-stack web application.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.10, FastAPI, Pydantic v2, SQLAlchemy ORM |
| **Auth** | PyJWT, Passlib (bcrypt), OAuth2 Password Bearer |
| **Database** | PostgreSQL (production) · SQLite (development) |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Design System** | ff360 Labs — Deep Black · Matte Charcoal · Metallic Gold |
| **Deployment** | Docker Compose · Render-ready `Procfile` · Environment variable driven |
| **Testing** | Pytest · HTTPX async client |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│         (Vite · Tailwind · Recharts · ff360 UI)          │
│                   localhost:3000                         │
└──────────────────────┬──────────────────────────────────┘
                       │  HTTPS + Authorization: Bearer <token>
┌──────────────────────▼──────────────────────────────────┐
│                  FastAPI Backend                         │
│         (JWT Auth · SQLAlchemy · Pydantic v2)            │
│                  localhost:8000                          │
└──────────────────────┬──────────────────────────────────┘
                       │  SQLAlchemy ORM
┌──────────────────────▼──────────────────────────────────┐
│              PostgreSQL Database                         │
│          users · transactions (user_id FK)               │
└─────────────────────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/auth/register` | ❌ | Create a new user account |
| `POST` | `/auth/login` | ❌ | Login and receive JWT access token |
| `GET` | `/auth/me` | ✅ | Get current authenticated user info |
| `GET` | `/transactions/` | ✅ | List all transactions for the auth'd user |
| `POST` | `/transactions/` | ✅ | Create a new transaction |
| `DELETE` | `/transactions/{id}` | ✅ | Delete a transaction (owner only) |
| `GET` | `/` | ❌ | API health check |
| `GET` | `/docs` | ❌ | Interactive Swagger UI |

### Live Deployment

| Environment | URL | Status |
|-------------|-----|--------|
| 🌐 **Frontend** (Render) | *`— link coming soon —`* | 🔜 Deploying |
| ⚙️ **Backend API** (Render) | *`— link coming soon —`* | 🔜 Deploying |
| 📖 **API Swagger Docs** | *`{backend-url}/docs`* | 🔜 Deploying |

> Deployment to Render is in progress. Live links will be updated here once the services are live.

### Running Locally

**Prerequisites:** Python 3.10+, Node 18+, PostgreSQL (optional — SQLite used as fallback)

```bash
# 1. Clone the repository
git clone https://github.com/jjohnson360/6-Month-AI-Developer-Roadmap.git
cd "6-Month-AI-Developer-Roadmap"

# 2. Start the backend
cd "Month 2/Week 4/finance-tracker-fullstack-auth/backend"
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. In a new terminal — start the frontend
cd "Month 2/Week 4/finance-tracker-fullstack-auth/frontend"
npm install
npm run dev

# Open http://localhost:3000 — register an account and start tracking!
```

**Or with Docker Compose (full stack in one command):**
```bash
cd "Month 2/Week 4/finance-tracker-fullstack-auth"
docker-compose up --build -d
```

---

## 🎨 ff360 Labs Design System

All frontend work in this roadmap is styled under the **ff360 Labs** brand identity:

| Token | Color | Usage |
|-------|-------|-------|
| Deep Black | `#0a0a0b` | Page backgrounds |
| Matte Charcoal | `#17171a` | Card surfaces (glassmorphic) |
| Metallic Gold | `#c9a15a` | Primary accents, CTAs, focus states |
| Gold Light | `#e8c98a` | Gradient highlights |
| Gold Deep | `#a07840` | Gradient shadows |
| Border Shimmer | `rgba(255,255,255,0.06)` | Subtle glass card borders |

Components follow a **glassmorphic card** pattern — translucent charcoal surface, `backdrop-blur`, shimmer border, and deep drop shadow. Primary CTA buttons use a directional gold gradient with a warm ambient glow.

---

## 🔜 What's Next — Month 3

> **AI, Machine Learning & Data Science Foundations**

Planned curriculum:
- NumPy, Pandas, and data manipulation pipelines
- Scikit-learn: supervised learning, model evaluation, feature engineering
- First neural network with PyTorch or TensorFlow
- Integrating an ML model prediction endpoint into a FastAPI service
- Data visualization with Matplotlib / Seaborn

---

## 📂 Repository Structure

```
6-Month-AI-Developer-Roadmap/
├── Month 1/
│   └── Week 2/amortization-calculator/         # Python CLI · Decimal · Unittest
├── Month 2/
│   ├── Week 1/finance-tracker-backend/         # FastAPI · Pydantic v2 · Uvicorn
│   ├── Week 2/finance-tracker-frontend/        # React · Vite · Tailwind CSS
│   ├── Week 3/finance-tracker-analytical-dashboard/  # Recharts · Analytics
│   └── Week 4/finance-tracker-fullstack-auth/  # ⭐ Full-Stack Capstone
│       ├── backend/      # FastAPI · PostgreSQL · JWT · SQLAlchemy · Pytest
│       ├── frontend/     # React · ff360 UI · Auth Screens · Recharts
│       ├── Procfile      # Render deployment command
│       └── docker-compose.yml
├── Month 3/              # 🔜 AI & ML Foundations (Coming Soon)
├── Month 4/              # ⬜ LLMs & Agents (Planned)
├── Month 5/              # ⬜ Cloud & MLOps (Planned)
├── Month 6/              # ⬜ Capstone Project (Planned)
└── PROGRESS_REPORT.md    # Detailed running log of milestones
```

---

## 👤 Author

**ff360 Labs** · [@jjohnson360](https://github.com/jjohnson360)

> *Building in public. Shipping real projects. No shortcuts.*

---

<div align="center">

*Made with precision, purpose, and a lot of coffee ☕*

</div>
