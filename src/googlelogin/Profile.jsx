import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import { getBrokerStatus } from "../services/brokerService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, isLoading, error, logout } = useAuth();
  const [broker, setBroker] = useState(null);

  useEffect(() => {
    getBrokerStatus().then(setBroker).catch(() => {});
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="error-state" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page fade-in">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.image}
            alt={`${user.username}'s profile`}
            className="profile-avatar"
            width={96}
            height={96}
          />
          <div>
            <h1>{user.username}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-actions">
          {broker?.broker && (
            <p className="profile-broker">
              Broker: {broker.broker.name} —{" "}
              <span className={`broker-status-badge ${broker.status}`}>
                {broker.status}
              </span>
            </p>
          )}
          <Link to="/settings" className="btn btn-secondary" style={{ marginRight: "0.5rem" }}>
            Settings
          </Link>
          <button type="button" className="btn btn-danger" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
