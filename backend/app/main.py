from fastapi import FastAPI
from .models import Transaction
from .database import create_table
app = FastAPI()
create_table()

@app.get("/")
def home():
    return {"message": "Welocme to personal Finanace Tracker"}

@app.post("/transactions")
def add_transaction(transaction: Transaction):
    return {
        "message": "Transaction added successfully",
        "transaction": transaction
    }