import { useEffect, useState } from 'react';
import api from '../services/api';
import BackButton from '../components/BackButton';

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [auctions, setAuctions] = useState([]);

  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: '',
    basePrice: '',
    image: null,
  });

  const [auctionForm, setAuctionForm] = useState({
    productId: '',
    startingPrice: '',
    buyNowPrice: '',
    endTime: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSellerData = async () => {
    try {
      const [productsResponse, auctionsResponse] = await Promise.all([
        api.get('/seller/products'),
        api.get('/seller/auctions'),
      ]);

      setProducts(productsResponse.data);
      setAuctions(auctionsResponse.data);
    } catch (err) {
      setError('Failed to load seller dashboard data.');
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const handleProductChange = (event) => {
    const { name, value, files } = event.target;

    setProductForm({
      ...productForm,
      [name]: files ? files[0] : value,
    });
  };

  const handleAuctionChange = (event) => {
    setAuctionForm({
      ...auctionForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', productForm.title);
      formData.append('description', productForm.description);
      formData.append('category', productForm.category);
      formData.append('basePrice', productForm.basePrice);

      if (productForm.image) {
        formData.append('image', productForm.image);
      }

      await api.post('/seller/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Product added successfully.');
      setProductForm({
        title: '',
        description: '',
        category: '',
        basePrice: '',
        image: null,
      });

      fetchSellerData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuctionSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      setLoading(true);

      await api.post('/seller/auctions', {
        productId: Number(auctionForm.productId),
        startingPrice: Number(auctionForm.startingPrice),
        buyNowPrice: auctionForm.buyNowPrice ? Number(auctionForm.buyNowPrice) : null,
        endTime: auctionForm.endTime,
      });

      setMessage('Auction created successfully.');
      setAuctionForm({
        productId: '',
        startingPrice: '',
        buyNowPrice: '',
        endTime: '',
      });

      fetchSellerData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create auction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackButton />

      <h2 className="mb-4">Seller Dashboard</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Add Product</h4>

              <form onSubmit={handleProductSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={productForm.title}
                    onChange={handleProductChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={productForm.description}
                    onChange={handleProductChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    value={productForm.category}
                    onChange={handleProductChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleProductChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Base Price</label>
                  <input
                    type="number"
                    name="basePrice"
                    className="form-control"
                    value={productForm.basePrice}
                    onChange={handleProductChange}
                    required
                  />
                </div>

                <button className="btn btn-dark" disabled={loading}>
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>Create Auction</h4>

              <form onSubmit={handleAuctionSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Product</label>
                  <select
                    name="productId"
                    className="form-select"
                    value={auctionForm.productId}
                    onChange={handleAuctionChange}
                    required
                  >
                    <option value="">Choose product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title} - ₹{product.basePrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Starting Price</label>
                  <input
                    type="number"
                    name="startingPrice"
                    className="form-control"
                    value={auctionForm.startingPrice}
                    onChange={handleAuctionChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Buy Now Price</label>
                  <input
                    type="number"
                    name="buyNowPrice"
                    className="form-control"
                    value={auctionForm.buyNowPrice}
                    onChange={handleAuctionChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    className="form-control"
                    value={auctionForm.endTime}
                    onChange={handleAuctionChange}
                    required
                  />
                </div>

                <button className="btn btn-dark" disabled={loading}>
                  Create Auction
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>My Products</h4>

              {products.length === 0 ? (
                <p className="text-muted">No products added yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Base Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.title}</td>
                          <td>{product.category}</td>
                          <td>₹{product.basePrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4>My Auctions</h4>

              {auctions.length === 0 ? (
                <p className="text-muted">No auctions created yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Current</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {auctions.map((auction) => (
                        <tr key={auction.id}>
                          <td>{auction.product?.title}</td>
                          <td>₹{auction.currentPrice}</td>
                          <td>
                            <span className="badge text-bg-success">
                              {auction.status}
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
      </div>
    </div>
  );
}

export default SellerDashboard;