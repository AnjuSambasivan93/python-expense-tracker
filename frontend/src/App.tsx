
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  net_savings: number;
}

interface Transaction {
  id: number;
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
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

function App() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactionType, setTransactionType] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  const fetchTransactions = async () => {
  try {
    const response = await fetch("http://localhost:8000/transactions");

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const data: { transactions: Transaction[] } = await response.json();

    setTransactions(data.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

  // Fetch real financial data from FastAPI
  const fetchSummary = async () => {
    try {
      const response = await fetch("http://localhost:8000/summary");

      if (!response.ok) {
        throw new Error("Failed to fetch financial summary");
      }

      const data: FinancialSummary = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setMessage("Unable to load financial summary.");
    }
  };

  // Load the dashboard when the application opens
  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, []);

  // Save transaction to FastAPI
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const transaction = {
      date: String(formData.get("date")),
      type: String(formData.get("type")),
      category: String(formData.get("category")),
      description: String(formData.get("description") ?? ""),
      amount: Number(formData.get("amount")),
    };

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error("Failed to save transaction");
      }

      // Clear form after successful saving
      form.reset();
      setTransactionType("");

      setMessage("Transaction saved successfully!");

      // Refresh financial summary
      await fetchSummary();
      await fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
      setMessage("Failed to save transaction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Personal Finance Tracker</h1>
      <p>Manage your income, expenses, and savings.</p>

      {/* Financial Summary */}
      <h2>Financial Summary</h2>

      {summary ? (
        <div className="summary-container">
          <div className="summary-card">
            <h3>Total Income</h3>
            <p>NZ${summary.total_income.toLocaleString()}</p>
          </div>

          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p>NZ${summary.total_expenses.toLocaleString()}</p>
          </div>

          <div className="summary-card">
            <h3>Net Savings</h3>
            <p>NZ${summary.net_savings.toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p>Loading financial summary...</p>
      )}

      {/* Add Transaction Form */}
      <h2>Add New Transaction</h2>

      <form onSubmit={handleSubmit}>

        {/* Date */}
        <div>
          <label htmlFor="date">Transaction Date</label>
          <input
            type="date"
            id="date"
            name="date"
            required
          />
        </div>

        {/* Transaction Type */}
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

        {/* Dynamic Category */}
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

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="e.g. Weekly grocery shopping"
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount">Amount (NZD)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {/* Save Button */}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Transaction"}
        </button>
      </form>

      {/* Status Message */}
      {message && <p role="status">{message}</p>}

      <h2>Transaction History</h2>

<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Type</th>
      <th>Category</th>
      <th>Description</th>
      <th>Amount (NZD)</th>
    </tr>
  </thead>

  <tbody>
    {transactions.map((transaction) => (
      <tr key={transaction.id}>
        <td>{transaction.date}</td>
        <td>{transaction.type}</td>
        <td>{transaction.category}</td>
        <td>{transaction.description}</td>
        <td>
          NZ${transaction.amount.toLocaleString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>

{transactions.length === 0 && (
  <p>No transactions recorded yet.</p>
)}
    </div>
  );
}

export default App;
