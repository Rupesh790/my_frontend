import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getBrokers, selectBroker } from "../../services/brokerService";
import { useAuth } from "../../hooks/useAuth";
import "./Brokers.css";

function BrokerSelection() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { loadOnboarding } = useAuth();

  useEffect(() => {
    getBrokers()
      .then(setBrokers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (broker) => {
    setSelecting(broker.code);
    setError(null);
    try {
      await selectBroker(broker.code);
      await loadOnboarding();

      if (broker.code === "existing") {
        navigate("/dashboard");
      } else {
        navigate("/brokers/connect");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSelecting(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading brokers..." />;

  return (
    <div className="broker-page fade-in">
      <div className="page-header">
        <h1>Select Your Broker</h1>
        <p>Choose a broker to connect your trading account and start auto-trading.</p>
      </div>

      {error && <div className="error-state" role="alert"><p>{error}</p></div>}

      <div className="broker-grid">
        {brokers.map((broker) => (
          <button
            key={broker.code}
            type="button"
            className="broker-card"
            onClick={() => handleSelect(broker)}
            disabled={selecting === broker.code}
          >
            <div className={`broker-card-icon ${broker.logo_icon}`}>
              {broker.code === "zerodha" ? "Z" : "EB"}
            </div>
            <h3>{broker.name}</h3>
            <p>{broker.description}</p>
            {broker.requires_oauth && (
              <span className="broker-status-badge disconnected">
                <span className="status-dot" />
                Requires login
              </span>
            )}
            {selecting === broker.code && <p>Connecting...</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BrokerSelection;
