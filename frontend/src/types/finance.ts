
export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  net_savings: number;
}

export interface Transaction {
  id: number;
  date: string;
  type: string;
  category: string;
  description: string;
  amount: number;
}

export type NewTransaction = Omit<Transaction, "id">;
