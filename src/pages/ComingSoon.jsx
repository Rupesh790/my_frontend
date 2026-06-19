import { useLocation } from "react-router-dom";
import "./ComingSoon.css";

const PAGE_LABELS = {
  "/watchlist": "Watchlist",
  "/portfolio": "Portfolio",
  "/scanner": "Scanner",
  "/settings": "Settings",
};

function ComingSoon() {
  const { pathname } = useLocation();
  const title = PAGE_LABELS[pathname] || "Feature";

  return (
    <div className="coming-soon fade-in">
      <div className="coming-soon-card">
        <span className="coming-soon-badge">Coming soon</span>
        <h1>{title}</h1>
        <p>
          We are building this section to deliver a premium trading experience.
          Check back soon for updates.
        </p>
      </div>
    </div>
  );
}

export default ComingSoon;
