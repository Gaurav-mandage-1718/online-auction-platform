import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import AuctionCard from '../components/AuctionCard';

function Home() {
  const [searchParams] = useSearchParams();

  const [auctions, setAuctions] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchText = searchParams.get('search') || '';

  const fetchAuctions = async () => {
    try {
      const response = await api.get('/auctions');
      setAuctions(response.data);
    } catch (err) {
      setError('Failed to load auctions. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = auctions
      .map((auction) => auction.product?.category)
      .filter(Boolean);

    return ['ALL', ...new Set(uniqueCategories)];
  }, [auctions]);

  const filteredAuctions = useMemo(() => {
    let result = [...auctions];

    if (searchText) {
      result = result.filter((auction) => {
        const title = auction.product?.title?.toLowerCase() || '';
        const description = auction.product?.description?.toLowerCase() || '';
        const query = searchText.toLowerCase();

        return title.includes(query) || description.includes(query);
      });
    }

    if (category !== 'ALL') {
      result = result.filter(
        (auction) => auction.product?.category === category
      );
    }

    if (sortBy === 'PRICE_LOW') {
      result.sort((a, b) => Number(a.currentPrice) - Number(b.currentPrice));
    }

    if (sortBy === 'PRICE_HIGH') {
      result.sort((a, b) => Number(b.currentPrice) - Number(a.currentPrice));
    }

    if (sortBy === 'ENDING_SOON') {
      result.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    }

    return result;
  }, [auctions, searchText, category, sortBy]);

  return (
    <div>
      <section className="store-hero mb-4">
        <div>
          <span className="hero-kicker">Live Online Auctions</span>
          <h1>Bid smart. Win your favorite products.</h1>
          <p>
            Explore active auctions, compare prices, and place real-time bids
            from one clean dashboard.
          </p>
        </div>
      </section>

      <div className="market-toolbar mb-4">
        <div>
          <h3 className="mb-1">Active Auctions</h3>
          <p className="mb-0 text-muted">
            {searchText
              ? `Showing results for "${searchText}"`
              : 'Fresh listings from verified sellers'}
          </p>
        </div>

        <div className="filter-group">
          <select
            className="form-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'ALL' ? 'All Categories' : item}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="NEWEST">Default</option>
            <option value="ENDING_SOON">Ending Soon</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading && <div className="alert alert-info">Loading auctions...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && filteredAuctions.length === 0 && (
        <div className="empty-box">No auctions match your filters.</div>
      )}

      <div className="row g-4">
        {filteredAuctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
}

export default Home;