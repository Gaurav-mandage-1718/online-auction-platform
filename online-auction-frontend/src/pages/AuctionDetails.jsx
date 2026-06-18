import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import api from '../services/api';
import { getCurrentUser } from '../services/auth';
import BackButton from '../components/BackButton';

function AuctionDetails() {
  const { id } = useParams();
  const user = getCurrentUser();

  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchAuctionDetails = async () => {
    try {
      const response = await api.get(`/auctions/${id}`);
      setAuction(response.data);
    } catch (err) {
      setError('Failed to load auction details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-native',
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/auction/${id}`, (message) => {
          const bidUpdate = JSON.parse(message.body);

          setAuction((prevAuction) => {
            if (!prevAuction) return prevAuction;

            return {
              ...prevAuction,
              currentPrice: bidUpdate.amount,
            };
          });

          setMessage(`New bid by ${bidUpdate.bidderName}: ₹${bidUpdate.amount}`);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [id]);

  const timeLeft = useMemo(() => {
    if (!auction?.endTime) return 'Not available';

    const end = new Date(auction.endTime);
    const diff = end - now;

    if (diff <= 0) return 'Auction ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    return `${hours}h ${minutes}m ${seconds}s`;
  }, [auction, now]);

  const handleBidSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!user) {
      setError('Please login as buyer to place bid.');
      return;
    }

    if (user.role !== 'BUYER') {
      setError('Only buyers can place bids.');
      return;
    }

    try {
      setActionLoading(true);

      const response = await api.post(`/buyer/auctions/${id}/bid`, {
        amount: bidAmount,
      });

      setMessage('Bid placed successfully. Live update sent.');
      setBidAmount('');

      setAuction((prevAuction) => ({
        ...prevAuction,
        currentPrice: response.data.amount,
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place bid.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setError('');
    setMessage('');

    if (!user) {
      setError('Please login as buyer to buy this item.');
      return;
    }

    if (user.role !== 'BUYER') {
      setError('Only buyers can use Buy Now.');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/buyer/auctions/${id}/buy-now`);
      setMessage('Buy Now completed successfully.');
      fetchAuctionDetails();
    } catch (err) {
      setError(err.response?.data?.error || 'Buy Now failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddWatchlist = async () => {
    setError('');
    setMessage('');

    if (!user) {
      setError('Please login as buyer to add watchlist.');
      return;
    }

    if (user.role !== 'BUYER') {
      setError('Only buyers can add auctions to watchlist.');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/buyer/watchlist/${id}`);
      setMessage('Auction added to watchlist.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add watchlist.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading auction details...</div>;
  }

  if (error && !auction) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!auction) {
    return <div className="alert alert-warning">Auction not found.</div>;
  }

  const isActive = auction.status === 'ACTIVE';

  return (
    <div>
      <BackButton />

      <div className="auction-detail-layout">
        <div className="auction-gallery">
          <img
            src={auction.product?.imageUrl || 'https://via.placeholder.com/700x500'}
            alt={auction.product?.title}
          />
        </div>

        <div className="auction-info-panel">
          <div className="detail-top-row">
            <span className={`status-pill-static ${isActive ? 'active' : 'closed'}`}>
              {auction.status}
            </span>
            <span className="category-chip">{auction.product?.category}</span>
          </div>

          <h1>{auction.product?.title}</h1>
          <p className="detail-description">{auction.product?.description}</p>

          <div className="price-panel">
            <div>
              <span>Current Bid</span>
              <strong>₹{auction.currentPrice}</strong>
            </div>

            <div>
              <span>Starting Price</span>
              <strong>₹{auction.startingPrice}</strong>
            </div>

            <div>
              <span>Buy Now</span>
              <strong>
                {auction.buyNowPrice ? `₹${auction.buyNowPrice}` : 'N/A'}
              </strong>
            </div>
          </div>

          <div className="countdown-box">
            <span>Time Left</span>
            <strong>{timeLeft}</strong>
          </div>

          <div className="seller-box">
            <p><strong>Seller:</strong> {auction.product?.sellerName}</p>
            <p><strong>Started:</strong> {new Date(auction.startTime).toLocaleString()}</p>
            <p><strong>Ends:</strong> {new Date(auction.endTime).toLocaleString()}</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          {isActive ? (
            <div className="bid-action-panel">
              <form onSubmit={handleBidSubmit}>
                <label className="form-label">Enter Bid Amount</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    value={bidAmount}
                    onChange={(event) => setBidAmount(event.target.value)}
                    min="1"
                    required
                  />
                  <button className="btn btn-dark" disabled={actionLoading}>
                    Place Bid
                  </button>
                </div>
              </form>

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-warning"
                  onClick={handleBuyNow}
                  disabled={actionLoading || !auction.buyNowPrice}
                >
                  Buy Now
                </button>

                <button
                  className="btn btn-outline-dark"
                  onClick={handleAddWatchlist}
                  disabled={actionLoading}
                >
                  Add to Watchlist
                </button>
              </div>

              <p className="text-muted small mt-2 mb-0">
                Buy Now is available only before bidding starts.
              </p>
            </div>
          ) : (
            <div className="alert alert-secondary mt-3 mb-0">
              This auction is no longer active.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuctionDetails;