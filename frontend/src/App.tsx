
import { useEffect, useState } from "react";
import "./App.css";

import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import TransactionHistory from "./components/TransactionHistory";
import YearlyPerformance from "./components/YearlyPerformance";

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

// Get current month
function getCurrentMonth() {
  const today = new Date();
  return today.toISOString().slice(0, 7);
}

function App() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartRefreshKey, setChartRefreshKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load monthly data
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [summaryData, transactionData] = await Promise.all([
          getMonthlySummary(selectedMonth),
          getMonthlyTransactions(selectedMonth),
        ]);

        if (!cancelled) {
          setSummary(summaryData);
          setTransactions(transactionData);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setMessage("Unable to load financial data.");
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [selectedMonth, refreshKey]);

  // Save transaction
  const handleSave = async (transaction: NewTransaction) => {
    try {
      await addTransaction(transaction);

      setRefreshKey((previous) => previous + 1);
      setChartRefreshKey((previous) => previous + 1);

      setMessage("Transaction saved successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save transaction.");
      throw error;
    }
  };

  // Delete transaction
  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);

      setRefreshKey((previous) => previous + 1);
      setChartRefreshKey((previous) => previous + 1);

      setMessage("Transaction deleted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete transaction.");
    }
  };

  return (
    <div className="dashboard">
      <h1>Personal Finance Tracker</h1>
      <p>Manage your income, expenses, and savings.</p>

      <div className="month-selector">
        <label htmlFor="selectedMonth">Select Month</label>
        <input
          type="month"
          id="selectedMonth"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <SummaryCards summary={summary} />

      <TransactionForm onSave={handleSave} />

      {message && <p role="status">{message}</p>}

      <TransactionHistory
        transactions={transactions}
        onDelete={handleDelete}
      />

      <div className="year-selector">
        <label htmlFor="selectedYear">Select Year</label>
        <input
          type="number"
          id="selectedYear"
          min="2000"
          max="2100"
          value={selectedYear}
          onChange={(e) => {
            const year = Number(e.target.value);

            if (year >= 2000 && year <= 2100) {
              setSelectedYear(year);
            }
          }}
        />
      </div>

      <YearlyPerformance
        year={selectedYear}
        refreshKey={chartRefreshKey}
      />
    </div>
  );
}

export default App;
