import { useEffect, useState } from "react";
import { apiGet } from "../api/client";
import AISuggestions from "./AISuggestions";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Home.css";

function Home() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [buzzers, setBuzzers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMarketData() {
      setLoading(true);
      setError(null);

      try {
        const [gainersData, losersData, buzzersData] = await Promise.all([
          apiGet("/api/top-gainers/"),
          apiGet("/api/top-losers/"),
          apiGet("/api/volume-buzzers/"),
        ]);

        if (!cancelled) {
          setGainers(gainersData);
          setLosers(losersData);
          setBuzzers(buzzersData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load market data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMarketData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading market data..." />;
  }

  if (error) {
    return (
      <div className="error-state fade-in" role="alert">
        <p>{error}</p>
        <p className="error-hint">Ensure the backend API is running at port 8000.</p>
      </div>
    );
  }

  return (
    <div className="home-page fade-in">
      <div className="page-header">
        <h1>Market Dashboard</h1>
        <p>Real-time insights across gainers, losers, and volume movers</p>
      </div>

      <div className="home-grid">
        <section className="card market-card" aria-labelledby="losers-title">
          <h2 id="losers-title" className="card-title">
            <span className="card-icon losers">↓</span> Top Losers
          </h2>
          {losers.length === 0 ? (
            <p className="empty-state-inline">No data available</p>
          ) : (
            <div className="stock-list">
              {losers.map((stock) => (
                <div key={stock.symbol} className="stock-row">
                  <span className="stock-symbol">{stock.symbol}</span>
                  <span className="stock-change red">{stock.change}%</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card market-card market-card--wide" aria-labelledby="buzzers-title">
          <h2 id="buzzers-title" className="card-title">
            <span className="card-icon buzzers">⚡</span> Volume Buzzers
          </h2>
          {buzzers.length === 0 ? (
            <p className="empty-state-inline">No data available</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Stock</th>
                    <th scope="col">Volume</th>
                    <th scope="col">LTP</th>
                  </tr>
                </thead>
                <tbody>
                  {buzzers.map((stock) => (
                    <tr key={stock.symbol}>
                      <td>{stock.symbol}</td>
                      <td>{stock.volume}</td>
                      <td>₹{stock.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card market-card" aria-labelledby="gainers-title">
          <h2 id="gainers-title" className="card-title">
            <span className="card-icon gainers">↑</span> Top Gainers
          </h2>
          {gainers.length === 0 ? (
            <p className="empty-state-inline">No data available</p>
          ) : (
            <div className="stock-list">
              {gainers.map((stock) => (
                <div key={stock.symbol} className="stock-row">
                  <span className="stock-symbol">{stock.symbol}</span>
                  <span className="stock-change green">+{stock.change}%</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <AISuggestions />
    </div>
  );
}

export default Home;
