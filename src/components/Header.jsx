import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import Hero from "./Herotext";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <NavLink to="/" className="logo" onClick={closeMenu} aria-label="IndiaTrade home">
        <span className="logo-mark">IT</span>
        <span className="logo-text">IndiaTrade</span>
      </NavLink>

      <div className="hero-wrapper" aria-hidden={menuOpen}>
        <Hero />
      </div>

      <nav
        id="main-nav"
        className={`nav-menu ${menuOpen ? "active" : ""}`}
        aria-label="Main navigation"
      >
        <NavLink to="/" onClick={closeMenu} end>
          Home
        </NavLink>
        <NavLink to="/about" onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/services" onClick={closeMenu}>
          Services
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>
      </nav>

      <div className="header-actions">
        <NavLink
          to={isAuthenticated ? "/profile" : "/login"}
          onClick={closeMenu}
          className="user-link"
          aria-label={isAuthenticated ? "View profile" : "Sign in"}
        >
          <FaUserCircle size={28} />
        </NavLink>

        <button
          type="button"
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Header;
