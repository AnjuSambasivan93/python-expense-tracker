
import { useState, type FormEvent } from "react";
import type { NewTransaction } from "../types/finance";

interface TransactionFormProps {
  onSave: (transaction: NewTransaction) => Promise<void>;
}

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business Income",
  "Interest",
  "Other Income",
];

const expenseCategories = [
  "Groceries",
  "Rent",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Other Expenses",
];

function TransactionForm({ onSave }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const transaction: NewTransaction = {
      date: String(formData.get("date")),
      type: String(formData.get("type")),
      category: String(formData.get("category")),
      description: String(formData.get("description") ?? ""),
      amount: Number(formData.get("amount")),
    };

    setSaving(true);

    try {
      await onSave(transaction);
      form.reset();
      setTransactionType("");
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2>Add New Transaction</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Transaction Date</label>
          <input type="date" id="date" name="date" required />
        </div>

        <div>
          <label htmlFor="type">Transaction Type</label>
          <select
            id="type"
            name="type"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            required
          >
            <option value="">Select transaction type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            key={transactionType}
            id="category"
            name="category"
            defaultValue=""
            disabled={!transactionType}
            required
          >
            <option value="">Select category</option>

            {(transactionType === "Income"
              ? incomeCategories
              : expenseCategories
            ).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="e.g. Weekly groceries"
          />
        </div>

        <div>
          <label htmlFor="amount">Amount (NZD)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Transaction"}
        </button>
      </form>
    </section>
  );
}

export default TransactionForm;
