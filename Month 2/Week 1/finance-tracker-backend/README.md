# Finance Tracker Backend (FastAPI)

A RESTful API built with FastAPI and Pydantic for managing income and expense transactions.

## 🚀 Setup & Environment

This project uses **`uv`** for fast dependency management and virtual environments.

### 1. Ensure `uv` is installed and PATH updated
```bash
export PATH="$HOME/.local/bin:$PATH"
```

### 2. Install / Sync Dependencies
```bash
uv pip install --python venv -r requirements.txt
```

### 3. Run the Development Server
```bash
uvicorn main:app --reload
```
Once running, explore the interactive API documentation at:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Testing

Run the automated suite using `pytest`:
```bash
./venv/bin/pytest
```

---

## 📌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API Welcome message |
| `GET` | `/transactions` | List all transactions |
| `POST` | `/transactions` | Create a new transaction |
| `DELETE` | `/transactions/{id}` | Delete a transaction by ID |
