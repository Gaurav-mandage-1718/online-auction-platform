import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuctionDetails from './pages/AuctionDetails';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auctions/:id" element={<AuctionDetails />} />

          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={['SELLER']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
             path="/profile"
              element={
                <ProtectedRoute allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
                <UserProfile />
                </ProtectedRoute>
               }
          />

          <Route
            path="/buyer"
            element={
              <ProtectedRoute allowedRoles={['BUYER']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;