import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { zerodhaCallback } from "../../services/brokerService";
import { useAuth } from "../../hooks/useAuth";

function ZerodhaCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loadOnboarding } = useAuth();

  const requestToken = searchParams.get("request_token");
  const status = searchParams.get("status");
  const isCancelled = status === "cancelled" || !requestToken;

  useEffect(() => {
    if (isCancelled) {
      const timer = setTimeout(() => navigate("/brokers/connect"), 3000);
      return () => clearTimeout(timer);
    }

    let cancelled = false;

    (async () => {
      try {
        await zerodhaCallback(requestToken);
        if (!cancelled) {
          await loadOnboarding();
          navigate("/dashboard", { replace: true });
        }
      } catch {
        if (!cancelled) {
          setTimeout(() => navigate("/brokers/connect"), 3000);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [isCancelled, requestToken, navigate, loadOnboarding]);

  if (isCancelled) {
    return (
      <div className="error-state" role="alert">
        <p>Zerodha login was cancelled. Redirecting...</p>
      </div>
    );
  }

  return <LoadingSpinner message="Connecting Zerodha account..." />;
}

export default ZerodhaCallback;
