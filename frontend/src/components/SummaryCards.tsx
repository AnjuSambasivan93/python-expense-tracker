
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
    </section>
  );
}

export default SummaryCards;
