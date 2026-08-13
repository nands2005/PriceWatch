import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PriceHistory() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const productsResponse = await axios.get(
                    "http://localhost:5000/api/products",
                    config
                );

                const selectedProduct = productsResponse.data.find(
                    (item) => item._id === id
                );

                if (!selectedProduct) {
                    setError("Product not found.");
                    return;
                }

                setProduct(selectedProduct);

                const historyResponse = await axios.get(
                    `http://localhost:5000/api/products/${id}/history`,
                    config
                );

                setHistory(historyResponse.data);
            } catch (error) {
                console.error("Price history error:", error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Failed to load price history."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" />
                <p className="text-muted mt-3">
                    Loading price history...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const lowestPrice =
        history.length > 0
            ? Math.min(...history.map((item) => Number(item.price)))
            : Number(product.currentPrice);

    return (
        <div className="container py-5">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">
                        Price History
                    </h1>

                    <p className="text-muted mb-0">
                        {product.name}
                    </p>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/dashboard")}
                >
                    Back
                </button>
            </div>

            {/* Summary */}
            <div className="row g-4 mb-4">

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">
                                Current Price
                            </p>

                            <h2 className="fw-bold text-success">
                                ₹{Number(product.currentPrice).toLocaleString("en-IN")}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">
                                Target Price
                            </p>

                            <h2 className="fw-bold">
                                ₹{Number(product.targetPrice).toLocaleString("en-IN")}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <p className="text-muted mb-1">
                                Lowest Recorded Price
                            </p>

                            <h2 className="fw-bold text-primary">
                                ₹{lowestPrice.toLocaleString("en-IN")}
                            </h2>
                        </div>
                    </div>
                </div>

            </div>

            {/* History table */}
            <div className="card shadow-sm border-0">

                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                        Price Change History
                    </h4>

                    {history.length === 0 ? (
                        <div className="text-center py-5">
                            <h5>
                                No price history available
                            </h5>

                            <p className="text-muted">
                                Price changes will appear here after
                                the product is checked.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Price</th>
                                        <th>Change</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {history.map((item, index) => {
                                        const currentPrice = Number(item.price);

                                        const previousPrice =
                                            index > 0
                                                ? Number(history[index - 1].price)
                                                : null;

                                        let changeText = "—";
                                        let changeClass = "text-muted";

                                        if (previousPrice !== null) {
                                            const difference =
                                                currentPrice - previousPrice;

                                            if (difference < 0) {
                                                changeText = `↓ ₹${Math.abs(
                                                    difference
                                                ).toLocaleString("en-IN")}`;

                                                changeClass =
                                                    "text-success fw-bold";
                                            } else if (difference > 0) {
                                                changeText = `↑ ₹${difference.toLocaleString(
                                                    "en-IN"
                                                )}`;

                                                changeClass =
                                                    "text-danger fw-bold";
                                            } else {
                                                changeText = "No change";
                                            }
                                        }

                                        return (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>

                                                <td>
                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </td>

                                                <td>
                                                    <strong>
                                                        ₹
                                                        {currentPrice.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>
                                                </td>

                                                <td className={changeClass}>
                                                    {changeText}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>

                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}

export default PriceHistory;