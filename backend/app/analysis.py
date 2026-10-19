def calculate_total_income(transactiobns):
    total = 0

    for transaction in transactiobns:
        if transaction["type"] == "Income":
            total += transaction["amount"]

    return total

def calculate_total_expenses(transactions):
    total = 0

    for transaction in transactions:
        if transaction["type"] == "Expense":
            total += transaction["amount"]

    return total

def calculate_savings(transactions):
    income = calculate_total_income(transactions)
    expenses = calculate_total_expenses(transactions)

    savings = income - expenses

    return savings