import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [priceDrops, setPriceDrops] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // FETCH PRODUCTS

  const fetchProducts = async () => {
    try {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const productData = response.data;

      setProducts(productData);

      // Calculate recent price drops
      let dropCount = 0;

      for (const product of productData) {
        try {
          const historyResponse = await axios.get(
            `http://localhost:5000/api/products/${product._id}/history`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const history = historyResponse.data;

          if (history.length >= 2) {
            const latestPrice = Number(
              history[history.length - 1].price
            );

            const previousPrice = Number(
              history[history.length - 2].price
            );

            if (latestPrice < previousPrice) {
              dropCount++;
            }
          }
        } catch (historyError) {
          console.error(
            `History error for ${product.name}:`,
            historyError.message
          );
        }
      }

      setPriceDrops(dropCount);
    } catch (error) {
      console.error("Fetch products error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setError(
        error.response?.data?.message ||
        "Unable to load your tracked products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===============================
  // REMOVE TRACKING
  // ===============================
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Remove this product from your PriceWatch tracking list?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== productId
        )
      );

      await fetchProducts();
    } catch (error) {
      console.error("Remove tracking error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to remove tracking."
      );
    }
  };

  // DASHBOARD STATISTICS

  const targetReachedCount = products.filter(
    (product) =>
      Number(product.currentPrice) <=
      Number(product.targetPrice)
  ).length;

  const potentialSavings = products.reduce(
    (total, product) => {
      const currentPrice = Number(
        product.currentPrice
      );

      const targetPrice = Number(
        product.targetPrice
      );

      if (currentPrice > targetPrice) {
        return (
          total +
          (currentPrice - targetPrice)
        );
      }

      return total;
    },
    0
  );

  // FILTER + SEARCH + SORT

  const filteredProducts = products
    .filter((product) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(search) ||
        product.asin
          ?.toLowerCase()
          .includes(search);

      if (!matchesSearch) {
        return false;
      }

      const currentPrice = Number(
        product.currentPrice
      );

      const targetPrice = Number(
        product.targetPrice
      );

      if (statusFilter === "target") {
        return currentPrice <= targetPrice;
      }

      if (statusFilter === "waiting") {
        return currentPrice > targetPrice;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "price-low") {
        return (
          Number(a.currentPrice) -
          Number(b.currentPrice)
        );
      }

      if (sortOption === "price-high") {
        return (
          Number(b.currentPrice) -
          Number(a.currentPrice)
        );
      }

      if (sortOption === "target") {
        return (
          Number(a.targetPrice) -
          Number(b.targetPrice)
        );
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    });

  return (
    <main className="bg-light min-vh-100">

      {/* Page Header */}
      <section className="bg-white border-bottom">
        <div className="container-fluid px-4 px-lg-5 py-4">

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

            <div>
              <p className="text-primary fw-semibold mb-1">
                PRICEWATCH DASHBOARD
              </p>

              <h2 className="fw-bold mb-1">
                Welcome back,{" "}
                {user?.name || "User"}
              </h2>

              <p className="text-muted mb-0">
                Monitor your tracked Amazon products
                and find the right time to buy.
              </p>
            </div>

            <Link
              to="/add-product"
              className="btn btn-primary px-4"
            >
              + Track New Product
            </Link>

          </div>

        </div>
      </section>

      <div className="container-fluid px-4 px-lg-5 py-4">

        {/* Error */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="row g-4 mb-4">

          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">

                <small className="text-muted">
                  Tracked Products
                </small>

                <h2 className="fw-bold mt-2 mb-1">
                  {products.length}
                </h2>

                <small className="text-muted">
                  Products currently monitored
                </small>

              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">

                <small className="text-muted">
                  Recent Price Drops
                </small>

                <h2 className="fw-bold text-success mt-2 mb-1">
                  {priceDrops}
                </h2>

                <small className="text-success">
                  Products with recent decreases
                </small>

              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">

                <small className="text-muted">
                  Target Price Reached
                </small>

                <h2 className="fw-bold text-primary mt-2 mb-1">
                  {targetReachedCount}
                </h2>

                <small className="text-muted">
                  Products at or below target
                </small>

              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">

                <small className="text-muted">
                  Potential Savings
                </small>

                <h2 className="fw-bold mt-2 mb-1">
                  ₹
                  {potentialSavings.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <small className="text-muted">
                  Difference between current and target
                </small>

              </div>
            </div>
          </div>

        </div>

        {/* Search + Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">

            <div className="row g-3 align-items-center">

              <div className="col-lg-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by product Name"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>

              <div className="col-md-4 col-lg-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="all">
                    All Tracking Status
                  </option>

                  <option value="target">
                    Target Price Reached
                  </option>

                  <option value="waiting">
                    Waiting for Price Drop
                  </option>
                </select>
              </div>

              <div className="col-md-4 col-lg-2">
                <select
                  className="form-select"
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(e.target.value)
                  }
                >
                  <option value="newest">
                    Recently Added
                  </option>

                  <option value="price-low">
                    Current Price: Low to High
                  </option>

                  <option value="price-high">
                    Current Price: High to Low
                  </option>

                  <option value="target">
                    Target Price: Low to High
                  </option>
                </select>
              </div>

              <div className="col-md-4 col-lg-2 text-lg-end">
                <span className="text-muted">
                  {filteredProducts.length} shown
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              />

              <p className="text-muted mt-3 mb-0">
                Loading your tracked products...
              </p>

            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">

              <h4 className="fw-bold">
                {products.length === 0
                  ? "No products tracked yet"
                  : "No matching products"}
              </h4>

              <p className="text-muted">
                {products.length === 0
                  ? "Add an Amazon product to start monitoring its price."
                  : "Try changing your search or tracking filters."}
              </p>

              {products.length === 0 && (
                <Link
                  to="/add-product"
                  className="btn btn-primary"
                >
                  Track Your First Product
                </Link>
              )}

            </div>
          </div>
        ) : (
          <div className="row g-4">

            {filteredProducts.map((product) => {
              const currentPrice = Number(
                product.currentPrice
              );

              const targetPrice = Number(
                product.targetPrice
              );

              const targetReached =
                currentPrice <= targetPrice;

              const difference = Math.abs(
                currentPrice - targetPrice
              );

              return (
                <div
                  className="col-md-6 col-xl-4"
                  key={product._id}
                >

                  <div className="card border-0 shadow-sm h-100">

                    <div className="card-body p-4 d-flex flex-column">

                      {/* Store + Status */}
                      <div className="d-flex justify-content-between align-items-center mb-3">

                        <span className="badge bg-warning text-dark">
                          {product.store}
                        </span>

                        {targetReached ? (
                          <span className="badge bg-success">
                            Target Reached
                          </span>
                        ) : (
                          <span className="badge bg-light text-dark">
                            Tracking Active
                          </span>
                        )}

                      </div>

                      {/* Product Name */}
                      <h5
                        className="fw-bold mb-2"
                        style={{
                          minHeight: "50px",
                        }}
                      >
                        {product.name}
                      </h5>

                      <p className="small text-muted mb-4">
                        ASIN: {product.asin}
                      </p>

                      {/* Prices */}
                      <div className="row g-3 mb-3">

                        <div className="col-6">
                          <div className="bg-light rounded-3 p-3 h-100">

                            <small className="text-muted d-block">
                              Current Price
                            </small>

                            <h4 className="fw-bold text-success mb-0 mt-1">
                              ₹
                              {currentPrice.toLocaleString(
                                "en-IN"
                              )}
                            </h4>

                          </div>
                        </div>

                        <div className="col-6">
                          <div className="bg-light rounded-3 p-3 h-100">

                            <small className="text-muted d-block">
                              Target Price
                            </small>

                            <h4 className="fw-bold mb-0 mt-1">
                              ₹
                              {targetPrice.toLocaleString(
                                "en-IN"
                              )}
                            </h4>

                          </div>
                        </div>

                      </div>

                      {/* Price Status */}
                      {targetReached ? (
                        <div className="alert alert-success py-3">
                          <strong>
                            Target price reached
                          </strong>

                          <small className="d-block mt-1">
                            Current price is at or below
                            your target.
                          </small>
                        </div>
                      ) : (
                        <div className="alert alert-warning py-3">
                          <strong>
                            Tracking active
                          </strong>

                          <small className="d-block mt-1">
                            ₹
                            {difference.toLocaleString(
                              "en-IN"
                            )}{" "}
                            between current and target.
                          </small>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="d-grid gap-2 mt-auto">

                        <Link
                          to={`/price-history/${product._id}`}
                          className="btn btn-outline-info"
                        >
                          View Price History
                        </Link>

                        <a
                          href={product.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-primary"
                        >
                          View on Amazon
                        </a>

                        <div className="row g-2">

                          <div className="col-6">
                            <Link
                              to={`/edit-product/${product._id}`}
                              className="btn btn-outline-secondary w-100"
                            >
                              Edit Tracking
                            </Link>
                          </div>

                          <div className="col-6">
                            <button
                              type="button"
                              className="btn btn-outline-danger w-100"
                              onClick={() =>
                                handleDelete(
                                  product._id
                                )
                              }
                            >
                              Remove Tracking
                            </button>
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </main>
  );
}

export default Dashboard;