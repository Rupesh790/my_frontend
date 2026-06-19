import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner message="Loading..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function OnboardingRoute({ children, requireBroker = true }) {
  const { isAuthenticated, isLoading, onboarding } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner message="Loading..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireBroker && onboarding) {
    if (onboarding.next_step === "select_broker") {
      return <Navigate to="/brokers/select" replace />;
    }
    if (onboarding.next_step === "connect_broker") {
      return <Navigate to="/brokers/connect" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
