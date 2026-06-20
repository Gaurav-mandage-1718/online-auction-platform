import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { getCurrentUser } from '../services/auth';

function UserProfile() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="alert alert-warning">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div>
      <BackButton />

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">
            {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <h2>{user.fullName}</h2>
          <p>{user.email}</p>

          <span className="profile-role">{user.role}</span>
        </div>

        <div className="profile-info-card">
          <h4>Account Information</h4>

          <div className="profile-info-row">
            <span>User ID</span>
            <strong>{user.userId}</strong>
          </div>

          <div className="profile-info-row">
            <span>Full Name</span>
            <strong>{user.fullName}</strong>
          </div>

          <div className="profile-info-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-info-row">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>

          <div className="mt-4">
            {user.role === 'SELLER' && (
              <Link className="btn btn-dark" to="/seller">
                Go to Seller Dashboard
              </Link>
            )}

            {user.role === 'BUYER' && (
              <Link className="btn btn-dark" to="/buyer">
                Go to Buyer Dashboard
              </Link>
            )}

            {user.role === 'ADMIN' && (
              <Link className="btn btn-dark" to="/admin">
                Go to Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;