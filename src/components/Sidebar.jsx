import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaChartLine,
  FaRobot,
  FaCogs,
  FaExchangeAlt,
  FaListAlt,
  FaChartBar,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: FaChartLine },
  { to: "/strategies", label: "Strategies", icon: FaCogs },
  { to: "/auto-trading", label: "Auto Trading", icon: FaRobot },
  { to: "/brokers", label: "Brokers", icon: FaExchangeAlt },
  { to: "/trades", label: "Trades", icon: FaListAlt },
  { to: "/reports", label: "Reports", icon: FaChartBar },
  { to: "/settings", label: "Settings", icon: FaCog },
  { to: "/profile", label: "Profile", icon: FaUser },
];

function SidebarInner({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <aside
        className={`sidebar-v2 ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          {!collapsed && (
            <>
              <span className="brand-mark">IT</span>
              <span className="brand-name">IndiaTrade</span>
            </>
          )}
          <button
            type="button"
            className="sidebar-collapse-btn desktop-only"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              className={({ isActive }) =>
                `sidebar-link ${isActive || (to === "/dashboard" && location.pathname === "/") ? "active" : ""}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="sidebar-icon" aria-hidden="true" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-link theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
            {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {user && !collapsed && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.username}</span>
                <span className="sidebar-user-email">{user.email}</span>
              </div>
            </div>
          )}

          <button type="button" className="sidebar-link logout-btn" onClick={logout}>
            <FaSignOutAlt aria-hidden="true" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={closeMobile} aria-hidden="true" />
      )}
    </>
  );
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>
      <SidebarInner
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
    </>
  );
}

export default Sidebar;
