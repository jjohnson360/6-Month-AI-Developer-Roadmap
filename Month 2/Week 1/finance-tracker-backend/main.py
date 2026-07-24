from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Finance Tracker API", version="1.0")

# Pydantic Model for Transaction Data Validation
class Transaction(BaseModel):
    id: Optional[int] = None
    title: str
    amount: float
    category: str
    type: str  # "income" or "expense"

# In-memory database mock (to be replaced with PostgreSQL in Week 3)
fake_db = []
id_counter = 1

@app.get("/")
def read_root():
    return {"message": "Welcome to the Finance Tracker API"}

@app.get("/transactions", response_model=List[Transaction])
def get_transactions():
    return fake_db

@app.post("/transactions", response_model=Transaction, status_code=201)
def create_transaction(transaction: Transaction):
    global id_counter
    transaction.id = id_counter
    id_counter += 1
    fake_db.append(transaction)
    return transaction

@app.delete("/transactions/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int):
    for index, t in enumerate(fake_db):
        if t.id == transaction_id:
            fake_db.pop(index)
            return
    raise HTTPException(status_code=404, detail="Transaction not found")