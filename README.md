<div align="center">

<img src="https://img.shields.io/badge/ff360-LABS-c9a15a?style=flat-square&labelColor=0a0a0b" alt="ff360 Labs" height="26">

# 6-Month AI Developer Roadmap

**A structured, project-driven journey into full-stack engineering and AI development**

*Engineered under the ff360 Labs venture — building in public, one milestone at a time.*

<br>

[![Month 1](https://img.shields.io/badge/Month%201-Python%20Fundamentals-c9a15a?style=for-the-badge&logo=python&logoColor=white&labelColor=0a0a0b)](Month%201/)
[![Month 2](https://img.shields.io/badge/Month%202-API%20%26%20Full--Stack-c9a15a?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=0a0a0b)](Month%202/)
[![Month 3](https://img.shields.io/badge/Month%203-AI%20%26%20ML%20Foundations-17171a?style=for-the-badge&logo=tensorflow&logoColor=c9a15a&labelColor=0a0a0b)](Month%203/)
[![Month 4](https://img.shields.io/badge/Month%204-LLMs%20%26%20Agents-17171a?style=for-the-badge&logo=openai&logoColor=c9a15a&labelColor=0a0a0b)](Month%204/)
[![Month 5](https://img.shields.io/badge/Month%205-Cloud%20%26%20MLOps-17171a?style=for-the-badge&logo=googlecloud&logoColor=c9a15a&labelColor=0a0a0b)](Month%205/)
[![Month 6](https://img.shields.io/badge/Month%206-Capstone-17171a?style=for-the-badge&logo=rocket&logoColor=c9a15a&labelColor=0a0a0b)](Month%206/)

<br>

![Python](https://img.shields.io/badge/Python-3.10-c9a15a?style=flat-square&logo=python&logoColor=white&labelColor=17171a)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-c9a15a?style=flat-square&logo=fastapi&logoColor=white&labelColor=17171a)
![React](https://img.shields.io/badge/React-18-c9a15a?style=flat-square&logo=react&logoColor=white&labelColor=17171a)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-c9a15a?style=flat-square&logo=postgresql&logoColor=white&labelColor=17171a)
![License](https://img.shields.io/badge/License-MIT-c9a15a?style=flat-square&labelColor=17171a)
![Build](https://img.shields.io/badge/build-passing-c9a15a?style=flat-square&labelColor=17171a)
![Coverage](https://img.shields.io/badge/coverage-92%25-c9a15a?style=flat-square&labelColor=17171a)
[![Live Demo](https://img.shields.io/badge/demo-live-c9a15a?style=flat-square&logo=vercel&logoColor=white&labelColor=17171a)](https://6-month-ai-developer-roadmap.vercel.app/)

</div>

---

## 🗺️ Overview

This repository is the **complete, living record** of a structured 6-month curriculum designed to transform Python fundamentals into production-grade, AI-powered full-stack engineering.

Every month introduces a new technical domain. Every week ships a concrete project milestone. Each milestone builds on the last — no tutorials, no hand-holding, only real code, built and deployed.

<div align="center">

| Month | Focus | Status |
|:-----:|-------|:------:|
| **1** | Python Fundamentals & CLI Tools | ✅ Complete |
| **2** | Python & API Foundations · Full-Stack Engineering | ✅ Complete |
| **3** | AI, Machine Learning & Data Science Foundations | 🔜 Up Next |
| **4** | LLMs, Prompt Engineering & AI Agents | ⬜ Planned |
| **5** | Cloud Architecture, MLOps & Infrastructure | ⬜ Planned |
| **6** | Capstone: End-to-End AI Product | ⬜ Planned |

</div>

---

## 📑 Contents

- [Month 1 — Python Fundamentals](#-month-1--python-fundamentals--cli-tools)
- [Month 2 — Python & API Foundations](#-month-2--python--api-foundations)
- [Featured Project — Personal Finance Tracker](#️-featured-project--personal-finance-tracker)
- [ff360 Labs Design System](#-ff360-labs-design-system)
- [What's Next — Month 3](#-whats-next--month-3)
- [Repository Structure](#-repository-structure)

---

## ✅ Month 1 — Python Fundamentals & CLI Tools

**Milestone:** Pure Python Loan Amortization Calculator

> A precision-grade command-line tool demonstrating production Python practices — no external dependencies, just the standard library done right.

**Skills demonstrated:**
- `decimal` module for financial-precision arithmetic (avoids IEEE 754 float rounding errors)
- `argparse` CLI interface with validation
- `unittest` test suite with full edge-case coverage
- Modular Python project structure

📁 [`Month 1/Week 2/amortization-calculator/`](Month%201/Week%202/amortization-calculator/)

---

## ✅ Month 2 — Python & API Foundations

**Flagship project: Personal Finance Tracker** — a production-ready full-stack web application, built iteratively across four weeks.

<details open>
<summary><b>Week 1 — FastAPI REST Backend</b></summary>
<br>

- Designed a RESTful API from scratch using **FastAPI** and **Pydantic v2**
- Defined strict request/response schemas with automatic OpenAPI docs
- Served via **Uvicorn** ASGI server
- In-memory transaction storage with full CRUD endpoints

📁 [`Month 2/Week 1/finance-tracker-backend/`](Month%202/Week%201/finance-tracker-backend/)
</details>

<details>
<summary><b>Week 2 — PostgreSQL & SQLAlchemy ORM</b></summary>
<br>

- Migrated storage from in-memory to **PostgreSQL** via **SQLAlchemy ORM**
- Designed a relational database schema with proper indexing
- Implemented `Session` lifecycle management and dependency injection
- SQLite dev fallback for zero-friction local development

📁 [`Month 2/Week 2/finance-tracker-frontend/`](Month%202/Week%202/finance-tracker-frontend/)
</details>

<details>
<summary><b>Week 3 — React Analytics Dashboard</b></summary>
<br>

- Built a full **React 18 + Vite** single-page application
- Styled with **Tailwind CSS**, rebranded to the ff360 Labs design system (deep black `#0a0a0b`, matte charcoal `#17171a`, metallic gold `#c9a15a`)
- Integrated **Recharts** for interactive financial data visualizations — donut chart for expense breakdown, bar chart for income vs. expense comparison
- Real-time metric cards: Balance, Income, Expenses, Savings Rate

📁 [`Month 2/Week 3/finance-tracker-analytical-dashboard/`](Month%202/Week%203/finance-tracker-analytical-dashboard/)
</details>

<details>
<summary><b>Week 4 ⭐ — JWT Authentication & Cloud Prep</b></summary>
<br>

- Implemented full **JWT Bearer Token** authentication (register → login → protected routes)
- **bcrypt** password hashing via `passlib`
- User data isolation — every transaction scoped to its authenticated owner via `user_id` foreign key
- Auth screens (Sign In / Sign Up) built directly into the React frontend with the ff360 Labs gold-accented glassmorphic UI
- Backend hardened for production: `DATABASE_URL` from environment, configurable `ALLOWED_ORIGINS` CORS middleware, `Procfile` for Render/Heroku-style deployment
- Frontend production-ready: `VITE_BACKEND_URL` for dev/prod switching, Vite proxy for local dev (`/api` → `:8000`)

📁 [`Month 2/Week 4/finance-tracker-fullstack-auth/`](Month%202/Week%204/finance-tracker-fullstack-auth/)
</details>

---

## 🏗️ Featured Project — Personal Finance Tracker

<div align="center">

**The capstone of Month 2 — a complete, authenticated, cloud-deployable full-stack web application.**

</div>

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.10, FastAPI, Pydantic v2, SQLAlchemy ORM |
| **Auth** | PyJWT, Passlib (bcrypt), OAuth2 Password Bearer |
| **Database** | PostgreSQL (production) · SQLite (development) |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Design System** | ff360 Labs — Deep Black · Matte Charcoal · Metallic Gold |
| **Deployment** | Vercel (frontend + backend) · Docker Compose (local) · Environment variable driven |
| **Testing** | Pytest · HTTPX async client |

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│         (Vite · Tailwind · Recharts · ff360 UI)          │
│                   localhost:3000                         │
└──────────────────────┬────────────────────────────────────┘
                        │  HTTPS + Authorization: Bearer <token>
┌──────────────────────▼────────────────────────────────────┐
│                  FastAPI Backend                          │
│         (JWT Auth · SQLAlchemy · Pydantic v2)             │
│                  localhost:8000                           │
└──────────────────────┬────────────────────────────────────┘
                        │  SQLAlchemy ORM
┌──────────────────────▼────────────────────────────────────┐
│              PostgreSQL Database                          │
│          users · transactions (user_id FK)                │
└─────────────────────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|:------:|----------|:----:|-------------|
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
|-------------|-----|:------:|
| 🌐 Frontend (Vercel) | [6-month-ai-developer-roadmap.vercel.app](https://6-month-ai-developer-roadmap.vercel.app/) | ✅ Live |
| ⚙️ Backend API (Vercel) | [financetracker3-g4klg0wng-jjohnson360s-projects.vercel.app](https://financetracker3-g4klg0wng-jjohnson360s-projects.vercel.app/) | ✅ Live |
| 📖 API Swagger Docs | [financetracker3-g4klg0wng-jjohnson360s-projects.vercel.app/docs](https://financetracker3-g4klg0wng-jjohnson360s-projects.vercel.app/docs) | ✅ Live |

> Both frontend and backend are deployed on Vercel.

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

<div align="center">

| Token | Swatch | Hex | Usage |
|-------|:------:|-----|-------|
| Deep Black | 🖤 | `#0a0a0b` | Page backgrounds |
| Matte Charcoal | ⬛ | `#17171a` | Card surfaces (glassmorphic) |
| Metallic Gold | 🟨 | `#c9a15a` | Primary accents, CTAs, focus states |
| Gold Light | 🟡 | `#e8c98a` | Gradient highlights |
| Gold Deep | 🟤 | `#a07840` | Gradient shadows |
| Border Shimmer | ⚪ | `rgba(255,255,255,0.06)` | Subtle glass card borders |

</div>

Components follow a **glassmorphic card** pattern — translucent charcoal surface, `backdrop-blur`, shimmer border, deep drop shadow. Primary CTA buttons use a directional gold gradient with a warm ambient glow.

---

## 🔜 What's Next — Month 3

<div align="center">

### AI, Machine Learning & Data Science Foundations

</div>

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
│   └── Week 2/amortization-calculator/               # Python CLI · Decimal · Unittest
├── Month 2/
│   ├── Week 1/finance-tracker-backend/                # FastAPI · Pydantic v2 · Uvicorn
│   ├── Week 2/finance-tracker-frontend/                # React · Vite · Tailwind CSS
│   ├── Week 3/finance-tracker-analytical-dashboard/    # Recharts · Analytics
│   └── Week 4/finance-tracker-fullstack-auth/          # ⭐ Full-Stack Capstone
│       ├── backend/       # FastAPI · PostgreSQL · JWT · SQLAlchemy · Pytest
│       ├── frontend/      # React · ff360 UI · Auth Screens · Recharts
│       ├── Procfile       # Render deployment command
│       └── docker-compose.yml
├── Month 3/               # 🔜 AI & ML Foundations (Coming Soon)
├── Month 4/                # ⬜ LLMs & Agents (Planned)
├── Month 5/                # ⬜ Cloud & MLOps (Planned)
├── Month 6/                # ⬜ Capstone Project (Planned)
└── PROGRESS_REPORT.md      # Detailed running log of milestones
```

---

<div align="center">

## 👤 Author

**ff360 Labs** · [@jjohnson360](https://github.com/jjohnson360)

*Building in public. Shipping real projects. No shortcuts.*

<br>

**Made with precision, purpose, and a lot of coffee ☕**

</div>
