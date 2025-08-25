import { useState, useEffect } from "react";
import { getTraders } from "./api";
import "./App.css";

export default function App() {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch traders
  useEffect(() => {
    async function fetchTraders() {
      try {
        setLoading(true);
        setError(null);
        const result = await getTraders({
          page,
          limit: 10,
          tag: search ? search : undefined,
        });
        setTraders(result.items || []);
        if (page > 2) {
          setPage(1);
        }
      } catch (err) {
        setError(err.message);
        setTraders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTraders();
  }, [page, search]);

  const formatNumber = (num) => {
    if (!num) return "0";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPercent = (num) => {
    if (!num) return "0%";
    return `${(num * 100).toFixed(2)}%`;
  };

  const formatWallet = (wallet) => {
    if (!wallet) return "N/A";
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu traders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h3>❌ Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Sorium Traders</h1>
        <div className="stats">
          <span className="stat">📊 {traders.length} traders</span>
          <span className="stat">📄 Trang {page}</span>
        </div>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Tìm theo Wallet"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, 2))}
            disabled={page === 1}
            className="btn btn-secondary"
          >
            ← Trước
          </button>
          <span className="page-info">Trang {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="btn btn-secondary"
          >
            Sau →
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="traders-table">
          <thead>
            <tr>
              <th>Wallet</th>
              <th>Tag</th>
              <th>PnL</th>
              <th>Realized</th>
              <th>ROI</th>
              <th>Win Rate</th>
              <th>Trades (Buy/Sell)</th>
              <th>Volume</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((trader, index) => (
              <tr key={trader.wallet || index} className="trader-row">
                <td className="wallet-cell">
                  <div className="wallet">💰 {formatWallet(trader.wallet)}</div>
                </td>
                <td className="tag-cell">
                  {trader.tag && (
                    <div className={`tag tag-${trader.tag}`}>
                      🏷️ {trader.tag}
                    </div>
                  )}
                </td>
                <td className="numeric-cell">
                  <span className={trader.pnl >= 0 ? "positive" : "negative"}>
                    ${formatNumber(trader.pnl)}
                  </span>
                </td>
                <td className="numeric-cell">
                  <span
                    className={trader.realized >= 0 ? "positive" : "negative"}
                  >
                    ${formatNumber(trader.realized)}
                  </span>
                </td>
                <td className="numeric-cell">
                  <span className={trader.roi >= 0 ? "positive" : "negative"}>
                    {formatPercent(trader.roi)}
                  </span>
                </td>
                <td className="numeric-cell">
                  <span>{formatPercent(trader.winRate)}</span>
                </td>
                <td className="trades-cell">
                  <span>
                    🟢 {trader.buyCount} / 🔴 {trader.sellCount}
                  </span>
                </td>
                <td className="numeric-cell">
                  <span>
                    $
                    {formatNumber(
                      (trader.buyUsdAmount + trader.sellUsdAmount) / 2
                    )}
                  </span>
                </td>
                <td className="date-cell">
                  {trader.lastActiveAt && (
                    <span>
                      {new Date(
                        trader.lastActiveAt * 1000
                      ).toLocaleDateString()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {traders.length === 0 && (
        <div className="empty">
          <h3>🤷‍♂️ Không tìm thấy traders</h3>
          <p>Thử thay đổi bộ lọc hoặc trang khác</p>
        </div>
      )}
    </div>
  );
}
