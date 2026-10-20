from fastapi import FastAPI
from .models import Transaction
from .database import create_table, save_transaction, get_transactions

from fastapi.middleware.cors import CORSMiddleware



from .analysis import (
    calculate_total_income,
    calculate_total_expenses,
    calculate_savings
)

from .database import (
    create_table,
    save_transaction,
    get_transactions,
    get_monthly_transactions
)

app = FastAPI()
create_table()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

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

@app.get("/summary")
def get_summary():
    transactions = get_transactions()

    income = calculate_total_income(transactions)
    expenses = calculate_total_expenses(transactions)
    savings = calculate_savings(transactions)

    return {
        "total_income": income,
        "total_expenses": expenses,
        "net_savings": savings
    }


@app.get("/transactions/monthly")
def list_monthly_transactions(month: str):
    transactions = get_monthly_transactions(month)

    return {
        "month": month,
        "transactions": transactions
    }

@app.get("/summary/monthly")
def get_monthly_summary(month: str):
    transactions = get_monthly_transactions(month)

    income = calculate_total_income(transactions)
    expenses = calculate_total_expenses(transactions)
    savings = calculate_savings(transactions)

    return {
        "month": month,
        "total_income": income,
        "total_expenses": expenses,
        "net_savings": savings
    }