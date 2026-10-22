
def calculate_total_income(transactions):
    total = 0

    for transaction in transactions:
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

    return income - expenses
