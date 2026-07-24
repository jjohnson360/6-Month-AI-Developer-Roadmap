from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, Session, declarative_base

import os
from sqlalchemy.exc import OperationalError

# PostgreSQL connection string with automatic fallback if PostgreSQL is not active
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/financetracker")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        pass
except (OperationalError, Exception):
    DATABASE_URL = "sqlite:///./finance.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Database Model
class TransactionModel(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    type = Column(String, nullable=False)

# Create tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance Tracker API", version="1.1")

# Pydantic Schemas for Validation
class TransactionCreate(BaseModel):
    title: str
    amount: float
    category: str
    type: str

class TransactionResponse(TransactionCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Finance Tracker API with PostgreSQL"}

@app.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(TransactionModel).all()

@app.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

@app.post("/transactions", response_model=TransactionResponse, status_code=201)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = TransactionModel(
        title=transaction.title,
        amount=transaction.amount,
        category=transaction.category,
        type=transaction.type
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.put("/transactions/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db_transaction.title = transaction.title
    db_transaction.amount = transaction.amount
    db_transaction.category = transaction.category
    db_transaction.type = transaction.type
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.delete("/transactions/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(TransactionModel).filter(TransactionModel.id == transaction_id).first()
    if not db_transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(db_transaction)
    db.commit()
    return