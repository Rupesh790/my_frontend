import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { getDashboardCharts, getStrategyPerformance } from "../services/dashboardService";

function Reports() {
  const [charts, setCharts] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardCharts(), getStrategyPerformance()])
      .then(([ch, perf]) => { setCharts(ch); setPerformance(perf); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading reports..." />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Performance analytics and monthly breakdowns.</p>
      </div>

      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Monthly Performance</h3>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Month</th><th>PnL</th></tr></thead>
            <tbody>
              {charts?.monthly_performance?.map((m) => (
                <tr key={m.month}>
                  <td>{m.month}</td>
                  <td className={m.pnl >= 0 ? "green" : "red"}>₹{m.pnl.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Strategy Breakdown</h3>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Strategy</th><th>Trades</th><th>PnL</th><th>Win Rate</th></tr></thead>
            <tbody>
              {performance.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.trade_count}</td>
                  <td className={s.total_pnl >= 0 ? "green" : "red"}>₹{s.total_pnl}</td>
                  <td>{s.win_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;
