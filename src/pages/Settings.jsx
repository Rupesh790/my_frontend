import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { BrokerManage } from "./brokers/BrokerConnect";

function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account, broker, and preferences.</p>
      </div>

      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", maxWidth: 520 }}>
        <h3 style={{ marginBottom: "1rem" }}>Appearance</h3>
        <button type="button" className="btn btn-secondary" onClick={toggleTheme}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>

      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", maxWidth: 520 }}>
        <h3 style={{ marginBottom: "1rem" }}>Account</h3>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <button type="button" className="btn btn-secondary" style={{ marginTop: "0.75rem" }} onClick={() => navigate("/profile")}>
          View Profile
        </button>
      </div>

      <BrokerManage />
    </div>
  );
}

export default Settings;
