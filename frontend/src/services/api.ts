
import type {
  FinancialSummary,
  Transaction,
  NewTransaction,
} from "../types/finance";

const API_URL = "http://localhost:8000";

export async function getSummary(): Promise<FinancialSummary> {
  const response = await fetch(`${API_URL}/summary`);

  if (!response.ok) {
    throw new Error("Failed to fetch summary");
  }

  return response.json();
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/transactions`);

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const data: { transactions: Transaction[] } = await response.json();

  return data.transactions;
}

export async function addTransaction(
  transaction: NewTransaction
): Promise<void> {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error("Failed to save transaction");
  }
}

export async function deleteTransaction(
  transactionId: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/transactions/${transactionId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
}


export async function getMonthlySummary(
  month: string
): Promise<FinancialSummary> {
  const response = await fetch(
    `${API_URL}/summary/monthly?month=${month}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch monthly summary");
  }

  return response.json();
}

export async function getMonthlyTransactions(
  month: string
): Promise<Transaction[]> {
  const response = await fetch(
    `${API_URL}/transactions/monthly?month=${month}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch monthly transactions");
  }

  const data: { transactions: Transaction[] } =
    await response.json();

  return data.transactions;
}

export async function getYearlySummary(year: number) {
  const response = await fetch(
    `${API_URL}/summary/yearly?year=${year}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch yearly summary");
  }

  return response.json();
}