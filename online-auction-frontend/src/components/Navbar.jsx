import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [searchText, setSearchText] = useState('');

  const hideSearch = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload();
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchText.trim();

    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand brand-logo" to="/">
          Auction<span>Hub</span>
        </Link>

        {!hideSearch && (
          <form className="nav-search mx-lg-4 my-3 my-lg-0" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control"
              placeholder="Search auctions..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button className="btn btn-warning" type="submit">
              Search
            </button>
          </form>
        )}

        <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <Link className="nav-link" to="/">Auctions</Link>

          {user?.role === 'SELLER' && (
            <Link className="nav-link" to="/seller">Seller</Link>
          )}

          {user?.role === 'BUYER' && (
            <Link className="nav-link" to="/buyer">Buyer</Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link className="nav-link" to="/admin">Admin</Link>
          )}

          {user && (
            <Link className="nav-link" to="/profile">Profile</Link>
          )}

          {!user ? (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="btn btn-warning btn-sm" to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="user-chip">
                {user.fullName} · {user.role}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;