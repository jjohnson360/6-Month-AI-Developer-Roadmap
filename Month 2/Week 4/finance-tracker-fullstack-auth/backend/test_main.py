import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from main import app, get_db, Base, UserModel, TransactionModel

# Use in-memory SQLite for fast isolated testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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
def clean_db():
    db = TestingSessionLocal()
    db.query(TransactionModel).delete()
    db.query(UserModel).delete()
    db.commit()
    db.close()
    yield

def test_register_user():
    payload = {
        "username": "alex",
        "email": "alex@example.com",
        "password": "securepassword123"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "alex"
    assert data["email"] == "alex@example.com"
    assert "hashed_password" not in data

def test_login_user_and_get_me():
    # Register first
    client.post("/auth/register", json={
        "username": "sarah",
        "email": "sarah@example.com",
        "password": "mypassword"
    })

    # Login via form-data
    login_res = client.post("/auth/login", data={
        "username": "sarah",
        "password": "mypassword"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Test /auth/me with Bearer token
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "sarah"

def test_protected_transaction_crud():
    # Register & Login User 1
    client.post("/auth/register", json={"username": "user1", "email": "u1@example.com", "password": "pass"})
    token1 = client.post("/auth/login", data={"username": "user1", "password": "pass"}).json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # Register & Login User 2
    client.post("/auth/register", json={"username": "user2", "email": "u2@example.com", "password": "pass"})
    token2 = client.post("/auth/login", data={"username": "user2", "password": "pass"}).json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    # User 1 creates transaction
    tx_payload = {"title": "User 1 Income", "amount": 1000.0, "category": "Salary", "type": "income"}
    create_res = client.post("/transactions", json=tx_payload, headers=headers1)
    assert create_res.status_code == 201
    tx_id = create_res.json()["id"]

    # User 1 fetches transactions -> sees 1
    get1 = client.get("/transactions", headers=headers1)
    assert len(get1.json()) == 1

    # User 2 fetches transactions -> sees 0 (Strict user isolation!)
    get2 = client.get("/transactions", headers=headers2)
    assert len(get2.json()) == 0

    # User 2 tries to delete User 1's transaction -> fails with 404
    del_res = client.delete(f"/transactions/{tx_id}", headers=headers2)
    assert del_res.status_code == 404
