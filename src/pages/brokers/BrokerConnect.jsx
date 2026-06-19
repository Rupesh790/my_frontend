import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  getCurrentBroker,
  getZerodhaLoginUrl,
  zerodhaDisconnect,
} from "../../services/brokerService";
import { useAuth } from "../../hooks/useAuth";
import "./Brokers.css";

function BrokerConnect() {
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentBroker()
      .then((data) => {
        setBroker(data);
        if (data.status === "connected") {
          navigate("/dashboard");
        }
      })
      .catch(() => navigate("/brokers/select"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleZerodhaLogin = async () => {
    setConnecting(true);
    setError(null);
    try {
      const { login_url } = await getZerodhaLoginUrl();
      window.location.href = login_url;
    } catch (err) {
      setError(err.message);
      setConnecting(false);
    }
  };

  const handleSkip = () => navigate("/dashboard");

  if (loading) return <LoadingSpinner message="Loading broker..." />;

  const isZerodha = broker?.broker?.code === "zerodha";

  return (
    <div className="broker-page fade-in">
      <div className="page-header">
        <h1>Connect {broker?.broker?.name}</h1>
        <p>
          {isZerodha
            ? "Log in with your Zerodha credentials to enable live trading via Kite Connect."
            : "Your existing broker is ready to use."}
        </p>
      </div>

      {error && (
        <div className="error-state" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="card" style={{ padding: "2rem", maxWidth: 480 }}>
        {isZerodha ? (
          <>
            <div className={`broker-card-icon zerodha`} style={{ marginBottom: "1rem" }}>Z</div>
            <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
              You will be redirected to Zerodha&apos;s secure login page. Your credentials are never stored on our servers.
            </p>
            <div className="connect-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleZerodhaLogin}
                disabled={connecting}
              >
                {connecting ? "Redirecting..." : "Login with Zerodha"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/brokers/select")}>
                Change Broker
              </button>
            </div>
          </>
        ) : (
          <div className="connect-actions">
            <button type="button" className="btn btn-primary" onClick={handleSkip}>
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function BrokerManage() {
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loadOnboarding } = useAuth();

  useEffect(() => {
    getCurrentBroker()
      .then(setBroker)
      .catch(() => setBroker(null))
      .finally(() => setLoading(false));
  }, []);

  const handleDisconnect = async () => {
    await zerodhaDisconnect();
    await loadOnboarding();
    const updated = await getCurrentBroker();
    setBroker(updated);
  };

  const handleChangeBroker = () => navigate("/brokers/select");

  if (loading) return <LoadingSpinner message="Loading..." />;

  return (
    <div className="broker-page fade-in">
      <div className="page-header">
        <h1>Brokers</h1>
        <p>Manage your broker connection and trading account.</p>
      </div>

      {!broker ? (
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <p>No broker connected.</p>
          <button type="button" className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={handleChangeBroker}>
            Select Broker
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: "2rem", maxWidth: 520 }}>
          <div className={`broker-card-icon ${broker.broker.logo_icon}`} style={{ marginBottom: "1rem" }}>
            {broker.broker.code === "zerodha" ? "Z" : "EB"}
          </div>
          <h3>{broker.broker.name}</h3>
          <span className={`broker-status-badge ${broker.status}`}>
            <span className="status-dot" />
            {broker.status === "connected" ? "Connected" : broker.status === "expired" ? "Expired Session" : "Disconnected"}
          </span>
          {broker.metadata?.user_name && (
            <p style={{ marginTop: "0.75rem", color: "var(--color-text-muted)" }}>
              Account: {broker.metadata.user_name}
            </p>
          )}
          <div className="connect-actions">
            {broker.broker.code === "zerodha" && broker.status !== "connected" && (
              <button type="button" className="btn btn-primary" onClick={() => navigate("/brokers/connect")}>
                Reconnect Zerodha
              </button>
            )}
            {broker.status === "connected" && broker.broker.code === "zerodha" && (
              <button type="button" className="btn btn-danger" onClick={handleDisconnect}>
                Disconnect
              </button>
            )}
            <button type="button" className="btn btn-secondary" onClick={handleChangeBroker}>
              Change Broker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrokerConnect;
