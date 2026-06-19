import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import "./AISuggestions.css";

function AISuggestions() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSuggestions() {
      setLoading(true);
      setError(null);

      try {
        const data = await apiGet("/trading/api/ai-suggestions/");
        if (!cancelled) {
          setStocks(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load AI suggestions");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSuggestions();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="ai-card fade-in" aria-labelledby="ai-suggestions-title">
      <div className="ai-header">
        <h2 id="ai-suggestions-title">AI Trade Suggestions</h2>
        <span className="ai-badge">Live Opportunities</span>
      </div>

      {loading && <LoadingSpinner message="Loading suggestions..." />}

      {error && (
        <div className="error-state" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && stocks.length === 0 && (
        <p className="empty-state-inline">No suggestions available</p>
      )}

      {!loading && !error && stocks.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">Stock</th>
                <th scope="col">Signal</th>
                <th scope="col">Entry</th>
                <th scope="col">Target</th>
                <th scope="col">Stop Loss</th>
                <th scope="col">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td className="stock-symbol">{stock.symbol}</td>
                  <td>
                    <span
                      className={
                        stock.signal === "BUY" ? "buy-badge" : "sell-badge"
                      }
                    >
                      {stock.signal}
                    </span>
                  </td>
                  <td>₹{stock.entry}</td>
                  <td>₹{stock.target}</td>
                  <td>₹{stock.stoploss}</td>
                  <td>
                    <span className="confidence">{stock.confidence}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AISuggestions;
