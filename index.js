
import { useState } from 'react';

export default function Home() {
  const [basket, setBasket] = useState('');
  const [holdings, setHoldings] = useState('');
  const [result, setResult] = useState('');

  function parseBasket(basketText) {
    const lines = basketText.trim().split('\n');
    const allocations = {};
    lines.forEach((line) => {
      const [ticker, percent] = line.split(/\s+/);
      allocations[ticker.toUpperCase()] = parseFloat(percent);
    });
    return allocations;
  }

  function parseHoldings(holdingsText) {
    const lines = holdingsText.trim().split('\n');
    const holdings = {};
    lines.forEach((line) => {
      const [ticker, shares] = line.split(/\s+/);
      holdings[ticker.toUpperCase()] = parseFloat(shares);
    });
    return holdings;
  }

  function calculateRebalance() {
    const allocations = parseBasket(basket);
    const portfolio = parseHoldings(holdings);
    const totalShares = Object.values(portfolio).reduce((a, b) => a + b, 0);
    let output = "Suggested Share Targets:\n\n";

    for (const [ticker, percent] of Object.entries(allocations)) {
      const targetShares = ((percent / 100) * totalShares).toFixed(2);
      const currentShares = portfolio[ticker] || 0;
      const diff = (targetShares - currentShares).toFixed(2);
      output += `${ticker}: ${currentShares} → ${targetShares} (${diff >= 0 ? '+' : ''}${diff} shares)\n`;
    }
    setResult(output);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1>Basket Investor</h1>
      <textarea
        rows={4}
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Enter target basket (e.g. AAPL 30\nMSFT 20\nVTI 50)"
        value={basket}
        onChange={(e) => setBasket(e.target.value)}
      />
      <textarea
        rows={4}
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Enter current holdings (e.g. AAPL 10\nMSFT 7\nVTI 13)"
        value={holdings}
        onChange={(e) => setHoldings(e.target.value)}
      />
      <button onClick={calculateRebalance}>Calculate</button>
      {result && (
        <pre style={{ backgroundColor: '#f4f4f4', padding: '1rem', marginTop: '1rem' }}>{result}</pre>
      )}
    </div>
  );
}
