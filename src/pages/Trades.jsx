import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { getTrades } from "../services/dashboardService";

function Trades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrades().then(setTrades).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading trades..." />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Trades</h1>
        <p>Complete history of your executed trades.</p>
      </div>
      <div className="card" style={{ padding: "1.25rem" }}>
        {trades.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "2rem" }}>No trades yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th><th>Strategy</th><th>Side</th><th>Qty</th>
                  <th>Entry</th><th>Exit</th><th>PnL</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id}>
                    <td>{t.symbol}</td>
                    <td>{t.strategy_name || "—"}</td>
                    <td>{t.side}</td>
                    <td>{t.quantity}</td>
                    <td>₹{t.entry_price}</td>
                    <td>{t.exit_price ? `₹${t.exit_price}` : "—"}</td>
                    <td className={t.pnl >= 0 ? "green" : "red"}>₹{t.pnl}</td>
                    <td>{t.status}</td>
                    <td>{new Date(t.opened_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Trades;
