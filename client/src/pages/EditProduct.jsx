import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        url: "",
        store: "",
        category: "",
        currentPrice: "",
        targetPrice: "",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/products",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const product = response.data.find(
                    (item) => item._id === id
                );

                if (!product) {
                    setError("Product not found");
                    return;
                }

                setFormData({
                    name: product.name,
                    url: product.url,
                    store: product.store,
                    category: product.category,
                    currentPrice: product.currentPrice,
                    targetPrice: product.targetPrice,
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load product"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/products/${id}`,
                {
                    ...formData,
                    currentPrice: Number(formData.currentPrice),
                    targetPrice: Number(formData.targetPrice),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Product updated successfully");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update product"
            );
        }
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                Loading product...
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">

                            <h2 className="fw-bold mb-4">
                                Edit Product
                            </h2>

                            {message && (
                                <div className="alert alert-success">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Product URL
                                    </label>

                                    <input
                                        type="url"
                                        name="url"
                                        className="form-control"
                                        value={formData.url}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Store
                                        </label>

                                        <select
                                            name="store"
                                            className="form-select"
                                            value={formData.store}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select Store
                                            </option>
                                            <option value="Amazon">
                                                Amazon
                                            </option>
                                            <option value="Flipkart">
                                                Flipkart
                                            </option>
                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Select Category
                                            </option>
                                            <option value="Electronics">
                                                Electronics
                                            </option>
                                            <option value="Fashion">
                                                Fashion
                                            </option>
                                            <option value="Home">
                                                Home
                                            </option>
                                            <option value="Books">
                                                Books
                                            </option>
                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Current Price
                                        </label>

                                        <input
                                            type="number"
                                            name="currentPrice"
                                            className="form-control"
                                            value={formData.currentPrice}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            Target Price
                                        </label>

                                        <input
                                            type="number"
                                            name="targetPrice"
                                            className="form-control"
                                            value={formData.targetPrice}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                >
                                    Save Changes
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Cancel
                                </button>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;