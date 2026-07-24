# Finance Tracker Analytical Dashboard (React + Recharts + Tailwind CSS)

An analytical dashboard built with **React**, **Recharts**, **Tailwind CSS**, and **FastAPI + PostgreSQL** to provide data visualization, category spending breakdowns, and real-time financial metrics.

---

## 📊 Analytics & Visualizations

- **Expense Breakdown Donut Chart (`Recharts PieChart`)**:
  - Dynamically aggregates expenses by category (Food, Salary, Utilities, Entertainment, Shopping, Health, Other).
  - Custom dark-theme tooltips and legend.

- **Income vs. Expense Bar Chart (`Recharts BarChart`)**:
  - Side-by-side comparison of total credited revenue vs total outgoing expenses.

- **4 Summary Statistic Cards**:
  - **Total Balance** (Net available funds)
  - **Total Income** (Gross revenue)
  - **Total Expenses** (Gross outgoing)
  - **Savings Rate (%)** (Calculated percentage of income saved)

- **Interactive Category Filtering**:
  - Filter transaction logs by type (Incomes / Expenses) or category (Food, Utilities, etc.).

- **One-Click Demo Data Generator**:
  - Instant sample data populator for previewing analytics when the database is fresh.

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

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔗 Backend Connection

Ensure your FastAPI PostgreSQL server from **Week 1** is running:
```bash
cd "../../Week 1/finance-tracker-backend"
uvicorn main:app --reload
```

---

## 📦 Production Build

```bash
npm run build
```
Build output is saved to the `dist/` directory.
