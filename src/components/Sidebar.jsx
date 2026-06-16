import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${open ? "show" : ""}`}>
        <div className="sidebar-title">
          Trading
        </div>

        <NavLink to="/" onClick={() => setOpen(false)}>
          Dashboard
        </NavLink>

        <NavLink to="/watchlist" onClick={() => setOpen(false)}>
          Watchlist
        </NavLink>

        <NavLink to="/portfolio" onClick={() => setOpen(false)}>
          Portfolio
        </NavLink>

        <NavLink to="/scanner" onClick={() => setOpen(false)}>
          Scanner
        </NavLink>

        <NavLink to="/settings" onClick={() => setOpen(false)}>
          Settings
        </NavLink>
      </aside>

      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;