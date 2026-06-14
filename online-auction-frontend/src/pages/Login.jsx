import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { saveAuthData } from '../services/auth';


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', formData);

      saveAuthData(response.data);

      setFormData({
        email: '',
        password: '',
      });

      if (response.data.role === 'SELLER') {
        navigate('/seller');
      } else if (response.data.role === 'BUYER') {
        navigate('/buyer');
      } else if (response.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-card mx-auto">
      <h2 className="mb-3">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>

        <button className="btn btn-dark w-100">Login</button>
      </form>

      <p className="mt-3 mb-0">
        Do not have account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;