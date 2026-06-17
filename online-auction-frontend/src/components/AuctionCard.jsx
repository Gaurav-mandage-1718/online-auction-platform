import { Link } from 'react-router-dom';

function AuctionCard({ auction }) {
  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <div className="product-card h-100">
        <div className="product-img-wrap">
          <img
            src={auction.product?.imageUrl || 'https://via.placeholder.com/400x250'}
            alt={auction.product?.title || 'Auction item'}
          />
          <span className="status-pill">{auction.status}</span>
        </div>

        <div className="product-card-body">
          <h5>{auction.product?.title}</h5>
          <p className="product-description">
            {auction.product?.description || 'No description available.'}
          </p>

          <div className="price-row">
            <span>Current Bid</span>
            <strong>₹{auction.currentPrice}</strong>
          </div>

          <div className="small text-muted mb-3">
            Ends {new Date(auction.endTime).toLocaleString()}
          </div>

          <Link to={`/auctions/${auction.id}`} className="btn btn-dark w-100">
            View Auction
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuctionCard;