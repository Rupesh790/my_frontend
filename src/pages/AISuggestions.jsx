import { useEffect, useState } from "react";
import "./AISuggestions.css";

function AISuggestions() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("http://api/ai-suggestions/")
      .then((res) => res.json())
      .then((data) => setStocks(data));
  }, []);

  return (
    <div className="ai-card">
      <div className="ai-header">
        <h2>🤖 AI Trade Suggestions</h2>
        <span>Live Opportunities</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Signal</th>
            <th>Entry</th>
            <th>Target</th>
            <th>Stop Loss</th>
            <th>Confidence</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.symbol}</td>
              <td>
                <span
                  className={
                    stock.signal === "BUY"
                      ? "buy-badge"
                      : "sell-badge"
                  }
                >
                  {stock.signal}
                </span>
              </td>
              <td>₹{stock.entry}</td>
              <td>₹{stock.target}</td>
              <td>₹{stock.stoploss}</td>
              <td>{stock.confidence}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AISuggestions;