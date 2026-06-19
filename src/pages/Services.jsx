import "./Service.css";

const SERVICES = [
  {
    icon: "📊",
    title: "Market Scanner",
    description:
      "Continuously monitors thousands of stocks to identify unusual volume activity, breakout patterns, and momentum opportunities.",
  },
  {
    icon: "⚡",
    title: "Automated Trading",
    description:
      "Execute trading strategies based on predefined rules. Improve discipline and reduce emotional decision-making.",
  },
  {
    icon: "📈",
    title: "Real-Time Analytics",
    description:
      "Access live market data, price movements, technical indicators, and trend analysis through a unified dashboard.",
  },
  {
    icon: "💼",
    title: "Portfolio Monitoring",
    description:
      "Track investments, monitor performance, review open positions, and analyze historical results in one place.",
  },
  {
    icon: "🛡️",
    title: "Risk Management",
    description:
      "Stop-loss monitoring, position sizing analysis, and risk assessment tools to protect your capital.",
  },
  {
    icon: "🎯",
    title: "Custom Strategies",
    description:
      "Develop and test custom trading strategies tailored to your investment objectives and market conditions.",
  },
];

function Services() {
  return (
    <div className="services-page fade-in">
      <div className="page-header">
        <h1>Our Services</h1>
        <p>
          Advanced trading tools designed to help investors make smarter
          decisions in the stock market.
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((service) => (
          <article key={service.title} className="card service-card">
            <span className="service-icon" aria-hidden="true">
              {service.icon}
            </span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Services;
