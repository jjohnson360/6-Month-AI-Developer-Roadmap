# Finance Tracker Backend (FastAPI + PostgreSQL + SQLAlchemy)

A RESTful API built with **FastAPI**, **Pydantic v2**, and **SQLAlchemy ORM** for managing financial transactions (income & expenses) with persistent database storage.

---

## 🛠️ Features & Architecture

- **Database Persistence**: Powered by PostgreSQL via SQLAlchemy ORM with automatic SQLite fallback for offline development.
- **RESTful Endpoints**: Full CRUD support for creating, retrieving, updating, and deleting transactions.
- **Data Validation**: Strict type-checking and schema validation using Pydantic v2.
- **Package Management**: Powered by Astral's **`uv`** package manager.
- **Automated Testing**: Complete unit test suite using `pytest` and in-memory test database fixtures.

---

## 🚀 Setup & Environment

### 1. Environment & Dependencies
Ensure `uv` is installed and sync all required packages into your virtual environment:
```bash
export PATH="$HOME/.local/bin:$PATH"
uv pip install --python venv -r requirements.txt
```

### 2. Configure Database (Optional)
By default, the application connects to PostgreSQL:
```bash
postgresql://postgres:password@localhost/financetracker
```
You can override the database URL using an environment variable:
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/your_db"
```

### 3. Run the Development Server
```bash
uvicorn main:app --reload
```
Once started, explore the interactive documentation:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Running Tests

Run the unit test suite using `pytest`:
```bash
./venv/bin/pytest
```

---

## 📌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Health & Welcome message |
| `GET` | `/transactions` | Retrieve all transactions |
| `GET` | `/transactions/{id}` | Retrieve a specific transaction by ID |
| `POST` | `/transactions` | Create a new transaction |
| `PUT` | `/transactions/{id}` | Update an existing transaction |
| `DELETE` | `/transactions/{id}` | Delete a transaction by ID |
