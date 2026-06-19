import "./About.css";

const SECTIONS = [
  {
    title: "Our Mission",
    text: "Auto Trade Assistant is a smart trading platform designed to help traders analyze market data, identify trading opportunities, and automate trading strategies. Our goal is to simplify the trading process by combining real-time market information with advanced technology.",
  },
  {
    title: "Market Intelligence",
    text: "The platform provides powerful market scanners that continuously monitor stocks and identify unusual price movements, volume spikes, and trend changes. Traders can use these insights to discover potential trading opportunities without spending hours manually analyzing charts.",
  },
  {
    title: "Strategy Automation",
    text: "Auto Trade Assistant supports strategy-based automation, enabling users to execute predefined trading rules automatically. Whether you are a beginner or an experienced trader, automated execution helps reduce emotional decision-making.",
  },
  {
    title: "Unified Dashboard",
    text: "Our dashboard offers a complete view of watchlists, portfolios, open positions, market trends, top gainers, top losers, and real-time stock updates — all in an intuitive interface built for speed and clarity.",
  },
];

function About() {
  return (
    <div className="about-page fade-in">
      <div className="page-header page-intro">
        <h1>About IndiaTrade</h1>
        <p>Technology-driven tools for smarter, more disciplined trading.</p>
      </div>

      <div className="about-content">
        {SECTIONS.map((section) => (
          <article key={section.title} className="card">
            <h2 className="card-title">{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default About;
