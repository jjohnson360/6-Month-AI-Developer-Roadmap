import pytest
from fastapi.testclient import TestClient
from main import app, fake_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def run_around_tests():
    # Clear in-memory database before each test
    fake_db.clear()
    yield

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Finance Tracker API"}

def test_create_transaction():
    payload = {
        "title": "Grocery Shopping",
        "amount": 85.50,
        "category": "Food",
        "type": "expense"
    }
    response = client.post("/transactions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["amount"] == payload["amount"]
    assert data["id"] is not None

def test_get_transactions():
    payload = {
        "title": "Freelance Pay",
        "amount": 500.0,
        "category": "Income",
        "type": "income"
    }
    client.post("/transactions", json=payload)
    response = client.get("/transactions")
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_delete_transaction():
    payload = {
        "title": "Coffee",
        "amount": 4.50,
        "category": "Food",
        "type": "expense"
    }
    post_res = client.post("/transactions", json=payload)
    t_id = post_res.json()["id"]

    del_res = client.delete(f"/transactions/{t_id}")
    assert del_res.status_code == 204

    get_res = client.get("/transactions")
    assert len(get_res.json()) == 0

def test_delete_nonexistent_transaction():
    response = client.delete("/transactions/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Transaction not found"
