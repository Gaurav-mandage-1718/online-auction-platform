import { useEffect, useState } from 'react';
import api from '../services/api';
import BackButton from '../components/BackButton';

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [
        dashboardResponse,
        usersResponse,
        auctionsResponse,
        transactionsResponse,
      ] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/auctions'),
        api.get('/admin/transactions'),
      ]);

      setDashboard(dashboardResponse.data);
      setUsers(usersResponse.data);
      setAuctions(auctionsResponse.data);
      setTransactions(transactionsResponse.data);
    } catch (err) {
      setError('Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const blockUser = async (userId) => {
    setMessage('');
    setError('');

    try {
      await api.put(`/admin/users/${userId}/block`);
      setMessage('User blocked successfully.');
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to block user.');
    }
  };

  const unblockUser = async (userId) => {
    setMessage('');
    setError('');

    try {
      await api.put(`/admin/users/${userId}/unblock`);
      setMessage('User unblocked successfully.');
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to unblock user.');
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading admin dashboard...</div>;
  }

  return (
    <div>
      <BackButton />
      <h2 className="mb-4">Admin Dashboard</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="dashboard-card">
            <p>Total Users</p>
            <h3>{dashboard?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <p>Total Auctions</p>
            <h3>{dashboard?.totalAuctions || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <p>Total Bids</p>
            <h3>{dashboard?.totalBids || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="dashboard-card">
            <p>Commission</p>
            <h3>₹{dashboard?.totalCommission || 0}</h3>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'auctions' ? 'active' : ''}`}
                onClick={() => setActiveTab('auctions')}
              >
                Auctions
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
            </li>
          </ul>

          {activeTab === 'users' && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Blocked</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.blocked ? 'Yes' : 'No'}</td>
                      <td>
                        {user.blocked ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => unblockUser(user.id)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => blockUser(user.id)}
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'auctions' && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Seller</th>
                    <th>Current Price</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {auctions.map((auction) => (
                    <tr key={auction.id}>
                      <td>{auction.product?.title}</td>
                      <td>{auction.product?.seller?.fullName || auction.product?.sellerName}</td>
                      <td>₹{auction.currentPrice}</td>
                      <td>
                        <span className="badge text-bg-secondary">
                          {auction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.productTitle ||
                          transaction.auction?.product?.title}
                      </td>
                      <td>
                        {transaction.buyerName ||
                          transaction.buyer?.fullName}
                      </td>
                      <td>
                        {transaction.sellerName ||
                          transaction.seller?.fullName}
                      </td>
                      <td>₹{transaction.amount}</td>
                      <td>
                        <span className="badge text-bg-success">
                          {transaction.status}
                        </span>
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

export default AdminDashboard;