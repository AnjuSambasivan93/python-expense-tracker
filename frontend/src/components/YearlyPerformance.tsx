
import { useEffect, useState } from "react";
import { getYearlySummary } from "../services/api";

interface YearlyPerformanceProps {
  year: number;
  refreshKey: number;
}

interface MonthData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface YearlyMonth {
  month: string;
  total_income: number;
  total_expenses: number;
  net_savings: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

function YearlyPerformance({
  year,
  refreshKey,
}: YearlyPerformanceProps) {
  const [data, setData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadYearlyData() {
      setLoading(true);
      setError("");

      try {
        const result = await getYearlySummary(year);

        const monthlyData = result.months.map(
          (item: YearlyMonth, index: number) => ({
            month: MONTHS[index],
            income: item.total_income,
            expenses: item.total_expenses,
            savings: item.net_savings,
          })
        );

        if (!cancelled) {
          setData(monthlyData);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setError("Unable to load yearly financial data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadYearlyData();

    return () => {
      cancelled = true;
    };
  }, [year, refreshKey]);

  if (loading) {
    return <p>Loading yearly performance...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  const maxValue = Math.max(
    1,
    ...data.map((item) => Math.max(item.income, item.expenses))
  );

  const chartHeight = 200;
  const baseline = 240;
  const barWidth = 8;
  const groupWidth = 48;

  const activeMonths = data.filter(
    (item) => item.income !== 0 || item.expenses !== 0
  );

  const bestMonth = activeMonths.length
    ? activeMonths.reduce((best, current) =>
        current.savings > best.savings ? current : best
      )
    : null;

  const overspendingMonths = activeMonths.filter(
    (item) => item.expenses > item.income
  );

  return (
    <section className="yearly-performance">
      <h2>Yearly Financial Performance - {year}</h2>

      <div className="yearly-chart-scroll">
        <svg
          viewBox="0 0 650 285"
          role="img"
          aria-label={`Monthly income and expenses chart for ${year}`}
        >
          <line
            x1="50"
            y1={baseline}
            x2="640"
            y2={baseline}
            stroke="#94a3b8"
          />

          {data.map((item, index) => {
            const x = 65 + index * groupWidth;

            const incomeHeight =
              (item.income / maxValue) * chartHeight;

            const expenseHeight =
              (item.expenses / maxValue) * chartHeight;

            return (
              <g key={item.month}>
                <rect
                  x={x}
                  y={baseline - incomeHeight}
                  width={barWidth}
                  height={incomeHeight}
                  fill="#16a34a"
                  rx="2"
                >
                  <title>
                    {`${item.month} Income: NZ$${item.income.toFixed(2)}`}
                  </title>
                </rect>

                <rect
                  x={x + 12}
                  y={baseline - expenseHeight}
                  width={barWidth}
                  height={expenseHeight}
                  fill="#ef4444"
                  rx="2"
                >
                  <title>
                    {`${item.month} Expenses: NZ$${item.expenses.toFixed(2)}`}
                  </title>
                </rect>

                <text
                  x={x + 10}
                  y={baseline + 20}
                  fontSize="12"
                  textAnchor="middle"
                  fill="#475569"
                >
                  {item.month}
                </text>

                {item.savings < 0 && (
                  <circle
                    cx={x + 10}
                    cy={baseline + 32}
                    r="3"
                    fill="#dc2626"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="chart-legend">
        <span>🟢 Income</span>
        <span>🔴 Expenses</span>
        <span>🔴 Dot = Overspending</span>
      </div>

      <div className="yearly-insights">
        <h3>Financial Insights</h3>

        {bestMonth ? (
          <p>
            Best savings month: <strong>{bestMonth.month}</strong>
            {" — "}
            NZ${bestMonth.savings.toFixed(2)}
          </p>
        ) : (
          <p>No transactions recorded for this year.</p>
        )}

        <p>
          Months with expenses greater than income:{" "}
          <strong>
            {overspendingMonths.length
              ? overspendingMonths.map((item) => item.month).join(", ")
              : "None"}
          </strong>
        </p>

        <h3>Monthly Savings</h3>

        <div className="yearly-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net Savings</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>NZ${item.income.toFixed(2)}</td>
                  <td>NZ${item.expenses.toFixed(2)}</td>
                  <td>
                    <span
                      style={{
                        color:
                          item.savings < 0 ? "#dc2626" : "#16a34a",
                        fontWeight: 600,
                      }}
                    >
                      NZ${item.savings.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default YearlyPerformance;
