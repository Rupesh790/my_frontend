import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Header.css";
import Hero from "./Herotext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("auth_token");
  console.log(token);
  return (
    <header className="header">
      <div className="logo">

        {token ? (
          <NavLink
            to="/profile"
            onClick={() => setMenuOpen(false)}
          >
            <FaUserCircle size={28} />
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            <FaUserCircle size={28} />
          </NavLink>
        )}

      </div>

      <span>
        <Hero />
      </span>

      <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/about" onClick={() => setMenuOpen(false)}>
          About
        </NavLink>

        <NavLink to="/services" onClick={() => setMenuOpen(false)}>
          Services
        </NavLink>

        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </NavLink>
      </nav>

      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>
    </header>
  );
}

export default Header;