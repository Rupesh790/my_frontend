import { useEffect, useState } from "react";
import AISuggestions from "./AISuggestions";
import "./Home.css";

function Home() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [buzzers, setBuzzers] = useState([]);

  useEffect(() => {
    fetch("http://api/top-gainers/")
      .then((res) => res.json())
      .then((data) => setGainers(data));

    fetch("http:/api/top-losers/")
      .then((res) => res.json())
      .then((data) => setLosers(data));

    fetch("http:/api/volume-buzzers/")
      .then((res) => res.json())
      .then((data) => setBuzzers(data));
  }, []);

  return (
    <>
      <div className="home-grid">

      {/* Top Losers */}
      <div className="card">
        <h2>📉 Top Losers</h2>

        {losers.map((stock) => (
          <div key={stock.symbol} className="stock-row">
            <span>{stock.symbol}</span>
            <span className="red">
              {stock.change}%
            </span>
          </div>
        ))}
      </div>

      {/* Volume Buzzers */}
      <div className="card">
        <h2>🔥 Volume Buzzers</h2>

        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Volume</th>
              <th>LTP</th>
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

      {/* Top Gainers */}
      <div className="card">
        <h2>📈 Top Gainers</h2>

        {gainers.map((stock) => (
          <div key={stock.symbol} className="stock-row">
            <span>{stock.symbol}</span>
            <span className="green">
              +{stock.change}%
            </span>
          </div>
        ))}
      </div>
          
    </div>  
    <AISuggestions />
    </>
    
  );
}

export default Home;