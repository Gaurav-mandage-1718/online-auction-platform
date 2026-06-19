import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BackButton from '../components/BackButton';

function BuyerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBuyerData = async () => {
    try {
      setLoading(true);

      const [dashboardResponse, watchlistResponse, transactionsResponse] =
        await Promise.all([
          api.get('/buyer/dashboard'),
          api.get('/buyer/watchlist'),
          api.get('/buyer/transactions'),
        ]);

      setDashboard(dashboardResponse.data);
      setWatchlist(watchlistResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (err) {
      setError('Failed to load buyer dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyerData();
  }, []);

  const removeFromWatchlist = async (auctionId) => {
    setMessage('');
    setError('');

    try {
      await api.delete(`/buyer/watchlist/${auctionId}`);
      setMessage('Auction removed from watchlist.');
      fetchBuyerData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove watchlist item.');
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading buyer dashboard...</div>;
  }

  return (
    <div>
      <BackButton />

      <h2 className="mb-4">Buyer Dashboard</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="dashboard-card">
            <p>My Bids</p>
            <h3>{dashboard?.myBids || 0}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <p>Transactions</p>
            <h3>{dashboard?.myTransactions || 0}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dashboard-card">
            <p>Watchlist Items</p>
            <h3>{dashboard?.watchlistItems || 0}</h3>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="mb-3">My Watchlist</h4>

          {watchlist.length === 0 ? (
            <p className="text-muted">No auctions in your watchlist.</p>
          ) : (
            <div className="row g-4">
              {watchlist.map((item) => (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <div className="card h-100">
                    <img
                      src={
                        item.auction?.product?.imageUrl ||
                        'https://via.placeholder.com/400x250'
                      }
                      className="card-img-top auction-img"
                      alt={item.auction?.product?.title}
                    />

                    <div className="card-body d-flex flex-column">
                      <h5>{item.auction?.product?.title}</h5>

                      <p className="text-muted small">
                        {item.auction?.product?.description}
                      </p>

                      <p className="mb-1">
                        <strong>Current:</strong> ₹{item.auction?.currentPrice}
                      </p>

                      <p className="mb-3">
                        <strong>Status:</strong> {item.auction?.status}
                      </p>

                      <div className="mt-auto d-flex gap-2">
                        <Link
                          to={`/auctions/${item.auction?.id}`}
                          className="btn btn-dark btn-sm"
                        >
                          View
                        </Link>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeFromWatchlist(item.auction?.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-3">Transaction History</h4>

          {transactions.length === 0 ? (
            <p className="text-muted">No transactions yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.productTitle}</td>
                      <td>{transaction.sellerName}</td>
                      <td>₹{transaction.amount}</td>
                      <td>
                        <span className="badge text-bg-success">
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        {new Date(transaction.transactionTime).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;