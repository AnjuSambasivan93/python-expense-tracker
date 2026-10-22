
import type { Transaction } from "../types/finance";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDelete: (id: number) => Promise<void>;
}

function TransactionHistory({
  transactions,
  onDelete,
}: TransactionHistoryProps) {
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    await onDelete(id);
  };

  return (
    <section>
      <h2>Transaction History</h2>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount (NZD)</th>
              <th>Action</th>
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
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <p>No transactions recorded yet.</p>
      )}
    </section>
  );
}

export default TransactionHistory;
