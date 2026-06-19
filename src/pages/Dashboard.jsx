import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getDashboardOverview,
  getDashboardCharts,
  getStrategyPerformance,
  getTrades,
} from "../services/dashboardService";
import AISuggestions from "./AISuggestions";
import "./Dashboard.css";
import "./Home.css";

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      getDashboardOverview(),
      getDashboardCharts(),
      getStrategyPerformance(),
      getTrades(),
    ])
      .then(([ov, ch, perf, tr]) => {
        setOverview(ov);
        setCharts(ch);
        setPerformance(perf);
        setTrades(tr);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  if (error) {
    return (
      <div className="error-state" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  const maxPnl = Math.max(...(charts?.daily_pnl?.map((d) => Math.abs(d.pnl)) || [1]), 1);

  return (
    <div className="dashboard-page fade-in">
      <div className="page-header">
        <h1>Trading Dashboard</h1>
        <p>Overview of your auto-trading performance and market insights.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Trades</div>
          <div className="stat-value">{overview.total_trades}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Profit / Loss</div>
          <div className={`stat-value ${overview.total_pnl >= 0 ? "positive" : "negative"}`}>
            ₹{overview.total_pnl.toLocaleString()}
          </div>
          <div className="stat-sub">Today: ₹{overview.daily_pnl.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Strategies</div>
          <div className="stat-value">{overview.active_strategies}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Connected Broker</div>
          <div className="stat-value" style={{ fontSize: "1.25rem" }}>
            {overview.connected_broker || "None"}
          </div>
          <div className="stat-sub">
            {overview.broker_status === "connected" ? "● Connected" : "○ Disconnected"}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Daily PnL (7 days)</h3>
          <div className="bar-chart">
            {charts?.daily_pnl?.map((d) => (
              <div key={d.date} className="bar-item">
                <div
                  className={`bar ${d.pnl >= 0 ? "positive" : "negative"}`}
                  style={{ height: `${(Math.abs(d.pnl) / maxPnl) * 120}px` }}
                  title={`₹${d.pnl}`}
                />
                <span className="bar-label">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Win Rate</h3>
          <div className="win-rate-chart">
            <div
              className="win-rate-circle"
              style={{ "--win-rate": overview.win_rate || 0 }}
            >
              <span className="win-rate-value">{overview.win_rate}%</span>
            </div>
            <div>
              <p style={{ color: "var(--color-success)", fontWeight: 600 }}>
                Wins: {charts?.win_rate_chart?.wins || 0}
              </p>
              <p style={{ color: "var(--color-danger)", fontWeight: 600 }}>
                Losses: {charts?.win_rate_chart?.losses || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="table-section card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <h3>Recent Trades</h3>
        {trades.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", padding: "1rem 0" }}>No trades yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Qty</th>
                  <th>Entry</th>
                  <th>PnL</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 10).map((t) => (
                  <tr key={t.id}>
                    <td>{t.symbol}</td>
                    <td>{t.side}</td>
                    <td>{t.quantity}</td>
                    <td>₹{t.entry_price}</td>
                    <td className={t.pnl >= 0 ? "green" : "red"}>₹{t.pnl}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="table-section card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <h3>Strategy Performance</h3>
        {performance.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", padding: "1rem 0" }}>No strategies yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Strategy</th>
                  <th>Type</th>
                  <th>Trades</th>
                  <th>PnL</th>
                  <th>Win Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.instrument_type}</td>
                    <td>{s.trade_count}</td>
                    <td className={s.total_pnl >= 0 ? "green" : "red"}>₹{s.total_pnl}</td>
                    <td>{s.win_rate}%</td>
                    <td>{s.is_active ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AISuggestions />
    </div>
  );
}

export default Dashboard;
