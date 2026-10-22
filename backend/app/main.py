
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import Transaction

from .database import (
    create_table,
    save_transaction,
    get_transactions,
    get_monthly_transactions,
    get_yearly_transactions,
    delete_transaction
)

from .analysis import (
    calculate_total_income,
    calculate_total_expenses
)


app = FastAPI()
create_table()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to Personal Finance Tracker"}


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

    return {
        "total_income": income,
        "total_expenses": expenses,
        "net_savings": income - expenses
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

    return {
        "month": month,
        "total_income": income,
        "total_expenses": expenses,
        "net_savings": income - expenses
    }

@app.get("/summary/yearly")
def get_yearly_summary(year: int):
    transactions = get_yearly_transactions(year)

    monthly_data = []

    for month in range(1, 13):
        month_text = f"{year}-{month:02d}"

        monthly_transactions = [
            transaction
            for transaction in transactions
            if transaction["date"].startswith(month_text)
        ]

        income = calculate_total_income(monthly_transactions)
        expenses = calculate_total_expenses(monthly_transactions)

        monthly_data.append({
            "month": month_text,
            "total_income": income,
            "total_expenses": expenses,
            "net_savings": income - expenses
        })

    return {"months": monthly_data}


@app.delete("/transactions/{transaction_id}")
def remove_transaction(transaction_id: int):
    deleted_rows = delete_transaction(transaction_id)

    if deleted_rows == 0:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return {
        "message": "Transaction deleted successfully",
        "transaction_id": transaction_id
    }
