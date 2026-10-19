from fastapi import FastAPI
from .models import Transaction

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welocme to personal Finanace Tracker"}

@app.post("/transactions")
def add_transaction(transaction: Transaction):
    return {
        "message": "Transaction added successfully",
        "transaction": transaction
    }