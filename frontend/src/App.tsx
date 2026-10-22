
import { useEffect, useState } from "react";
import "./App.css";

import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionHistory from "./components/TransactionHistory";

import {
  getMonthlySummary,
  getMonthlyTransactions,
  addTransaction,
  deleteTransaction,
} from "./services/api";

import type {
  FinancialSummary,
  Transaction,
  NewTransaction,
} from "./types/finance";

// Get the current month in YYYY-MM format
function getCurrentMonth(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function App() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState("");

  // Selected month - defaults to current month
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // Fetch monthly summary and transactions
  const refreshData = async (month: string) => {
    const [summaryData, transactionData] = await Promise.all([
      getMonthlySummary(month),
      getMonthlyTransactions(month),
    ]);

    setSummary(summaryData);
    setTransactions(transactionData);
  };

  // Reload data whenever the selected month changes
  useEffect(() => {
    let cancelled = false;

    const loadMonthlyData = async () => {
      try {
        const [summaryData, transactionData] = await Promise.all([
          getMonthlySummary(selectedMonth),
          getMonthlyTransactions(selectedMonth),
        ]);

        if (!cancelled) {
          setSummary(summaryData);
          setTransactions(transactionData);
          setMessage("");
        }
      } catch (error) {
        console.error("Error loading monthly data:", error);

        if (!cancelled) {
          setMessage("Unable to load monthly financial data.");
        }
      }
    };

    loadMonthlyData();

    return () => {
      cancelled = true;
    };
  }, [selectedMonth]);

  // Save a new transaction
  const handleSave = async (transaction: NewTransaction) => {
    try {
      await addTransaction(transaction);

      await refreshData(selectedMonth);

      setMessage("Transaction saved successfully!");
    } catch (error) {
      console.error("Error saving transaction:", error);
      setMessage("Failed to save or refresh transaction.");
      throw error;
    }
  };

  // Delete an existing transaction
  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);

      await refreshData(selectedMonth);

      setMessage("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setMessage("Failed to delete or refresh transaction.");
    }
  };

  return (
    <div className="dashboard">
      <h1>Personal Finance Tracker</h1>

      <p>Manage your income, expenses, and savings.</p>

      {/* Month Selector */}
      <div className="month-selector">
        <label htmlFor="selectedMonth">Select Month</label>

        <input
          type="month"
          id="selectedMonth"
          value={selectedMonth}
          onChange={(event) => {
            setSelectedMonth(event.target.value);
          }}
        />
      </div>

      {/* Monthly Financial Summary */}
      <SummaryCards summary={summary} />

      {/* Add New Transaction */}
      <TransactionForm onSave={handleSave} />

      {/* Success or Error Message */}
      {message && <p role="status">{message}</p>}

      {/* Monthly Transaction History */}
      <TransactionHistory
        transactions={transactions}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
