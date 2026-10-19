from fastapi import FastAPI
from .models import Transaction
from .database import create_table, save_transaction, get_transactions
app = FastAPI()
create_table()

@app.get("/")
def home():
    return {"message": "Welocme to personal Finanace Tracker"}

@app.post("/transactions")
def add_transaction(transaction: Transaction):
    save_transaction(transaction)
    return {
        "message": "Transaction added successfully",
        "transaction": transaction
    }

@app.get("/transactions")
def list_transactions():
    transactions = get_transactions()
    return {"transactions": transactions}