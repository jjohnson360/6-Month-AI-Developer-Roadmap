# Finance Tracker (JWT Authentication & Cloud Deployment) — Month 2 Wrap-Up

A production-ready full-stack Personal Finance application featuring **FastAPI**, **PostgreSQL**, **SQLAlchemy ORM**, **JWT Bearer Token Authentication**, **React**, **Tailwind CSS**, **Recharts**, and **Docker** deployment orchestration.

---

## 🔒 Authentication & Security Architecture

1. **User Registration & Password Hashing**:
   - `POST /auth/register`
   - Passwords hashed using `passlib` with `bcrypt`.

2. **JWT Bearer Access Tokens**:
   - `POST /auth/login` (OAuth2 Password Bearer flow)
   - Returns signed JWT tokens valid for 24 hours.

3. **Strict User Data Isolation**:
   - Every transaction is linked via `user_id` foreign key.
   - Users can only query, edit, or delete transactions created by their authenticated user account.

4. **Frontend Token Management**:
   - Automatic token persistence in `localStorage`.
   - `Authorization: Bearer <token>` automatically attached to all API requests.

---

## 🛠️ Tech Stack Overview

- **Backend**: Python 3.10, FastAPI, Pydantic v2, SQLAlchemy ORM, PyJWT, Passlib, Pytest.
- **Frontend**: React 18, Tailwind CSS v3, Recharts, Lucide Icons, Vite.
- **Database**: PostgreSQL (Production) / SQLite (Dev & Testing Fallback).
- **Deployment**: Docker, Docker Compose, Nginx.

---

## 🚀 Running Locally

### 1. Backend (FastAPI + JWT Auth)
```bash
cd backend
"../../Month 2/Week 1/finance-tracker-backend/venv/bin/pytest"  # Run Auth Pytest Suite
uvicorn main:app --reload --port 8000
```
Interactive Auth Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (React + Auth Screen)
```bash
cd frontend
export PATH="$HOME/.local/bin:$PATH"
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Production Deployment (Docker Compose)

Deploy the entire stack (PostgreSQL + FastAPI + Nginx React Frontend) with a single command:

```bash
docker-compose up --build -d
```

Services initialized:
- `finance_db`: PostgreSQL 15 on port `5432`
- `finance_backend`: FastAPI server on port `8000`
- `finance_frontend`: Production Nginx React app on port `3000`
