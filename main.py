import csv

total_income = 0
total_expense = 0

with open("data/transactions.csv", "r", newline="") as file:
    reader = csv.DictReader(file)


    for row in reader:
        if row["type"] == "Income":
            total_income += float(row["amount"])

        if row["type"] == "Expense":
            total_expense += float(row["amount"])

print(f"Total Income: ${total_income:.2f}")
print(f"Total Expense: ${total_expense:.2f}")

total_savings = total_income - total_expense
print(f"Total Savings: ${total_savings:.2f}")