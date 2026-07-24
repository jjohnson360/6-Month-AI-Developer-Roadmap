import pytest
from fastapi.testclient import TestClient
from main import app, get_db, Base, TransactionModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Use in-memory SQLite with StaticPool so all connections share the same database instance
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the test in-memory database
Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def run_around_tests():
    # Clear table data before each test run
    db = TestingSessionLocal()
    db.query(TransactionModel).delete()
    db.commit()
    db.close()
    yield

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Finance Tracker API" in response.json()["message"]

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

def test_get_single_transaction():
    payload = {
        "title": "Gym Membership",
        "amount": 50.0,
        "category": "Health",
        "type": "expense"
    }
    post_res = client.post("/transactions", json=payload)
    t_id = post_res.json()["id"]

    get_res = client.get(f"/transactions/{t_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Gym Membership"

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
    response = client.delete("/transactions/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Transaction not found"
