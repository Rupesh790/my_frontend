import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  getStrategies,
  deleteStrategy,
  cloneStrategy,
  toggleStrategy,
} from "../../services/strategyService";
import "./Strategies.css";

function StrategyList() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    getStrategies()
      .then(setStrategies)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this strategy?")) return;
    await deleteStrategy(id);
    load();
  };

  const handleClone = async (id) => {
    await cloneStrategy(id);
    load();
  };

  const handleToggle = async (id) => {
    await toggleStrategy(id);
    load();
  };

  if (loading) return <LoadingSpinner message="Loading strategies..." />;

  return (
    <div className="strategy-page fade-in">
      <div className="strategy-list-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Strategies</h1>
          <p>Build and manage your auto-trading strategies.</p>
        </div>
        <Link to="/strategies/new" className="btn btn-primary">
          + New Strategy
        </Link>
      </div>

      {error && <div className="error-state"><p>{error}</p></div>}

      {strategies.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
            No strategies yet. Create your first trading strategy.
          </p>
          <Link to="/strategies/new" className="btn btn-primary">Create Strategy</Link>
        </div>
      ) : (
        <div className="strategy-grid">
          {strategies.map((s) => (
            <div key={s.id} className="strategy-item">
              <div className="strategy-item-header">
                <h3>{s.name}</h3>
                <span className={`strategy-badge ${s.is_active ? "active" : ""}`}>
                  {s.is_active ? "Active" : s.instrument_type}
                </span>
              </div>
              <div className="strategy-meta">
                <span>Trades: {s.total_trades}</span>
                <span>Win: {s.win_rate}%</span>
              </div>
              <div className="strategy-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/strategies/${s.id}/edit`)}>
                  Edit
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => handleClone(s.id)}>
                  Clone
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => handleToggle(s.id)}>
                  {s.is_active ? "Deactivate" : "Activate"}
                </button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(s.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StrategyList;
