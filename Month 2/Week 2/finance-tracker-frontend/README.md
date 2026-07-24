# Finance Tracker Frontend (React + Tailwind CSS + Vite)

A modern, responsive single-page application built with **React**, **Tailwind CSS**, **Vite**, and **Lucide Icons** designed to interface seamlessly with the **FastAPI + PostgreSQL** backend.

---

## 🎨 Design & Features

- **Summary Dashboard**: Real-time cards for Total Balance, Total Income, Total Expenses, and Net Savings.
- **Interactive Transaction Form**: Add new income or expense items with category selection.
- **Live Connection Monitor**: Displays real-time API health status (`Online` vs `Offline`).
- **Responsive Dark Theme**: Modern glassmorphism UI styled with Tailwind CSS.
- **Fast Development Server**: Powered by Vite with automatic proxying (`/api` -> `http://127.0.0.1:8000`).

---

## 🚀 Setup & Running Locally

### 1. Ensure Node.js is in PATH
```bash
export PATH="$HOME/.local/bin:$PATH"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Vite Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Connecting to the Backend

Make sure your FastAPI backend from **Week 1** is running simultaneously:
```bash
cd "../Week 1/finance-tracker-backend"
uvicorn main:app --reload
```
Vite automatically proxies requests from `http://localhost:3000/api/*` to `http://127.0.0.1:8000/*`.

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```
Output will be generated in the `dist/` directory.
