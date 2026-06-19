import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getStrategies } from "../services/strategyService";
import { getBrokerStatus } from "../services/brokerService";

function AutoTrading() {
  const [strategies, setStrategies] = useState([]);
  const [brokerStatus, setBrokerStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStrategies(), getBrokerStatus()])
      .then(([s, b]) => { setStrategies(s); setBrokerStatus(b); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Loading..." />;

  const active = strategies.filter((s) => s.is_active);
  const canTrade = brokerStatus?.status === "connected";

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Auto Trading</h1>
        <p>Monitor and control your automated trading engine.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-label">Engine Status</div>
          <div className={`stat-value ${canTrade && active.length ? "positive" : ""}`} style={{ fontSize: "1.25rem" }}>
            {canTrade && active.length ? "Running" : "Stopped"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Strategies</div>
          <div className="stat-value">{active.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Broker</div>
          <div className="stat-value" style={{ fontSize: "1rem" }}>
            {brokerStatus?.broker?.name || "Not connected"}
          </div>
        </div>
      </div>

      {!canTrade && (
        <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", borderColor: "var(--color-danger)" }}>
          <p>Connect a broker to enable auto-trading.</p>
          <Link to="/brokers" className="btn btn-primary" style={{ marginTop: "0.75rem" }}>Connect Broker</Link>
        </div>
      )}

      <div className="card" style={{ padding: "1.25rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Active Strategies</h3>
        {active.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)" }}>
            No active strategies. <Link to="/strategies">Create one</Link>
          </p>
        ) : (
          active.map((s) => (
            <div key={s.id} style={{ padding: "0.75rem 0", borderBottom: "1px solid var(--color-border)" }}>
              <strong>{s.name}</strong> — {s.instrument_type}
            </div>
          ))
        )}
      </div>

      <div className="card" style={{ padding: "1.25rem", marginTop: "1.5rem" }}>
        <h3 style={{ marginBottom: "0.75rem" }}>Engine Architecture</h3>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
          Signal Generation → Strategy Engine evaluates conditions<br />
          Order Execution → Broker Engine routes to Zerodha/Existing<br />
          Trade Monitoring → Order Manager tracks lifecycle<br />
          Position Tracking → Trade Manager calculates PnL
        </p>
      </div>
    </div>
  );
}

export default AutoTrading;
