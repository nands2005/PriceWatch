import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddProduct() {
    const navigate = useNavigate();

    const [amazonUrl, setAmazonUrl] = useState("");
    const [targetPrice, setTargetPrice] = useState("");
    const [product, setProduct] = useState(null);

    const [fetching, setFetching] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleFetchProduct = async () => {
        if (!amazonUrl.trim()) {
            setError("Please paste an Amazon product URL.");
            return;
        }

        setError("");
        setMessage("");
        setProduct(null);
        setFetching(true);

        try {
            const response = await axios.get(
                "http://localhost:5000/api/amazon/product-by-url",
                {
                    params: {
                        url: amazonUrl,
                    },
                }
            );

            const data = response.data;
            const amazonProduct = data.product;

            const price = Number(
                String(amazonProduct?.price_info?.Price || "")
                    .replace(/[₹,]/g, "")
                    .trim()
            );

            if (!amazonProduct || !Number.isFinite(price)) {
                setError(
                    "We could not get a valid current price for this product."
                );
                return;
            }

            setProduct({
                asin: data.asin,
                name: amazonProduct.product_name || "Amazon Product",
                price,
                
                rating: amazonProduct.star_rating || "",
                availability:
                    amazonProduct.product_availability || "Unknown",
                isPrime: amazonProduct.is_prime || false,
            });

            setMessage("Product details fetched successfully.");
        } catch (error) {
            console.error("Fetch product error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to fetch this Amazon product."
            );
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!product) {
            setError("Fetch the Amazon product before starting tracking.");
            return;
        }

        const target = Number(targetPrice);

        if (!Number.isFinite(target) || target <= 0) {
            setError("Please enter a valid target price.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/products",
                {
                    asin: product.asin,
                    name: product.name,
                    url: amazonUrl,
                    store: "Amazon",
                    category: "Electronics",
                    currentPrice: product.price,
                    targetPrice: target,
                    
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Product is now being tracked.");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (error) {
            console.error("Save product error:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to start product tracking."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="bg-light min-vh-100">

            {/* Header */}
            <section className="bg-white border-bottom">
                <div className="container-fluid px-4 px-lg-5 py-4">

                    <p className="text-primary fw-semibold mb-1">
                        PRODUCT TRACKING
                    </p>

                    <h2 className="fw-bold mb-1">
                        Track an Amazon Product
                    </h2>

                    <p className="text-muted mb-0">
                        Add an Amazon product and let PriceWatch
                        monitor its price automatically.
                    </p>

                </div>
            </section>

            <div className="container-fluid px-4 px-lg-5 py-5">

                <div className="row g-4">

                    {/* Left: Tracking steps */}
                    <div className="col-lg-4">

                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">
                                    How tracking works
                                </h5>

                                <div className="d-flex gap-3 mb-4">

                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    >
                                        1
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            Add Amazon URL
                                        </h6>

                                        <p className="text-muted small mb-0">
                                            Paste the product link directly
                                            from Amazon.in.
                                        </p>
                                    </div>

                                </div>

                                <div className="d-flex gap-3 mb-4">

                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    >
                                        2
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            Fetch Current Price
                                        </h6>

                                        <p className="text-muted small mb-0">
                                            PriceWatch retrieves the latest
                                            product information.
                                        </p>
                                    </div>

                                </div>

                                <div className="d-flex gap-3 mb-4">

                                    <div
                                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    >
                                        3
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            Set Target Price
                                        </h6>

                                        <p className="text-muted small mb-0">
                                            Choose the maximum price you
                                            are willing to pay.
                                        </p>
                                    </div>

                                </div>

                                <div className="d-flex gap-3">

                                    <div
                                        className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    >
                                        4
                                    </div>

                                    <div>
                                        <h6 className="fw-bold mb-1">
                                            Get Price Alerts
                                        </h6>

                                        <p className="text-muted small mb-0">
                                            Receive an email when the price
                                            drops.
                                        </p>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right: Form */}
                    <div className="col-lg-8">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body p-4 p-lg-5">

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                {message && (
                                    <div className="alert alert-success">
                                        {message}
                                    </div>
                                )}

                                {/* URL */}
                                <div className="mb-4">

                                    <label className="form-label fw-semibold">
                                        Amazon Product URL
                                    </label>

                                    <div className="input-group input-group-lg">

                                        <input
                                            type="url"
                                            className="form-control"
                                            placeholder="https://www.amazon.in/dp/XXXXXXXXXX"
                                            value={amazonUrl}
                                            onChange={(e) =>
                                                setAmazonUrl(e.target.value)
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-primary px-4"
                                            onClick={handleFetchProduct}
                                            disabled={fetching}
                                        >
                                            {fetching ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                    />
                                                    Fetching...
                                                </>
                                            ) : (
                                                "Fetch Product"
                                            )}
                                        </button>

                                    </div>

                                    <small className="text-muted">
                                        Copy the product URL directly from
                                        Amazon.in.
                                    </small>

                                </div>

                                {/* Product Preview */}
                                {product && (
                                    <div className="border rounded-4 p-4 mb-4 bg-light">

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <h5 className="fw-bold mb-0">
                                                Product Details
                                            </h5>

                                            <span className="badge bg-warning text-dark">
                                                Amazon
                                            </span>

                                        </div>

                                        <div className="row g-4 align-items-center">

                                            <div className="col-md-4">

                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="img-fluid rounded"
                                                        style={{
                                                            width: "100%",
                                                            height: "220px",
                                                            objectFit: "contain",
                                                            backgroundColor: "white",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="bg-white border rounded d-flex align-items-center justify-content-center text-muted"
                                                        style={{
                                                            height: "220px",
                                                        }}
                                                    >
                                                        Image unavailable
                                                    </div>
                                                )}

                                            </div>

                                            <div className="col-md-8">

                                                <h4 className="fw-bold">
                                                    {product.name}
                                                </h4>

                                                <p className="text-muted mb-2">
                                                    ASIN: {product.asin}
                                                </p>

                                                <div className="row g-3">

                                                    <div className="col-sm-6">

                                                        <div className="bg-white rounded-3 p-3">

                                                            <small className="text-muted d-block">
                                                                Current Price
                                                            </small>

                                                            <h3 className="fw-bold text-success mb-0">
                                                                ₹
                                                                {product.price.toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </h3>

                                                        </div>

                                                    </div>

                                                    <div className="col-sm-6">

                                                        <div className="bg-white rounded-3 p-3">

                                                            <small className="text-muted d-block">
                                                                Availability
                                                            </small>

                                                            <strong className="text-success">
                                                                {product.availability}
                                                            </strong>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="mt-3">

                                                    {product.rating && (
                                                        <span className="badge text-bg-light me-2">
                                                            Rating: {product.rating}
                                                        </span>
                                                    )}

                                                    {product.isPrime && (
                                                        <span className="badge bg-primary">
                                                            Prime
                                                        </span>
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )}

                                {/* Target */}
                                {product && (
                                    <form onSubmit={handleSubmit}>

                                        <div className="mb-4">

                                            <label className="form-label fw-semibold">
                                                Target Price
                                            </label>

                                            <div className="input-group input-group-lg">

                                                <span className="input-group-text">
                                                    ₹
                                                </span>

                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter your target price"
                                                    value={targetPrice}
                                                    onChange={(e) =>
                                                        setTargetPrice(e.target.value)
                                                    }
                                                    min="1"
                                                    required
                                                />

                                            </div>

                                            <small className="text-muted">
                                                PriceWatch will notify you when
                                                the product reaches this price.
                                            </small>

                                        </div>

                                        {/* Price comparison */}
                                        {targetPrice && (
                                            <div className="alert alert-info">

                                                <div className="d-flex justify-content-between">

                                                    <span>
                                                        Current Price
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {product.price.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>

                                                <div className="d-flex justify-content-between mt-2">

                                                    <span>
                                                        Your Target
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            targetPrice
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg px-4"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                    />
                                                    Starting Tracking...
                                                </>
                                            ) : (
                                                "Start Price Tracking"
                                            )}
                                        </button>

                                    </form>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default AddProduct;