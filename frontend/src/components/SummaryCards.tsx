
import type { FinancialSummary } from "../types/finance";

interface SummaryCardsProps {
  summary: FinancialSummary | null;
}

function SummaryCards({ summary }: SummaryCardsProps) {
  if (!summary) {
    return <p>Loading financial summary...</p>;
  }

  return (
    <section>
      <h2>Financial Summary</h2>

      <div className="summary-container">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p>NZ${summary.total_income.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p>NZ${summary.total_expenses.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Net Savings</h3>
          <p>NZ${summary.net_savings.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
}

export default SummaryCards;
