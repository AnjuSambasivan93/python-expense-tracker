import sqlite3

def get_connection():
    connection = sqlite3.connect("backend/finance.db")
    return connection


def create_table():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL
    )
    """)
    connection.commit()
    connection.close()

def save_transaction(transaction):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
    INSERT INTO transactions (date, type, category, description, amount)
    VALUES (?, ?, ?, ?, ?)
    """, (transaction.date, transaction.type, transaction.category, transaction.description, transaction.amount))

    connection.commit()
    connection.close()


def get_transactions():
    connection = get_connection()
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM transactions")
    transactions = [dict(row) for row in cursor.fetchall()]

    connection.close()
    return transactions



def get_monthly_transactions(month):
    connection = get_connection()
    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    cursor.execute(
        "SELECT * FROM transactions WHERE substr(date, 1, 7) = ?",
        (month,)
    )

    transactions = [dict(row) for row in cursor.fetchall()]

    connection.close()

    return transactions


def clear_transactions():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM transactions")

    connection.commit()
    connection.close()