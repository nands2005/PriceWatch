import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications(response.data);
        } catch (error) {
            console.error(
                "Notification error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to load price alerts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/notifications/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === id
                        ? {
                            ...notification,
                            isRead: true,
                        }
                        : notification
                )
            );
        } catch (error) {
            console.error(
                "Mark as read error:",
                error
            );
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (
        <main className="bg-light min-vh-100">

            <section className="bg-white border-bottom">
                <div className="container-fluid px-4 px-lg-5 py-4">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>
                            <p className="text-primary fw-semibold mb-1">
                                PRICE ALERTS
                            </p>

                            <h2 className="fw-bold mb-1">
                                Your Price Alerts
                            </h2>

                            <p className="text-muted mb-0">
                                Monitor price drops and target price
                                notifications.
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <span className="badge bg-primary fs-6 px-3 py-2">
                                {unreadCount} unread
                            </span>
                        )}

                    </div>

                </div>
            </section>

            <div className="container-fluid px-4 px-lg-5 py-5">

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="text-muted mt-3">
                            Loading your alerts...
                        </p>

                    </div>
                ) : notifications.length === 0 ? (

                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">

                            <h4 className="fw-bold">
                                No price alerts yet
                            </h4>

                            <p className="text-muted">
                                When a tracked product drops in price,
                                your alert will appear here.
                            </p>

                            <Link
                                to="/add-product"
                                className="btn btn-primary"
                            >
                                Track a Product
                            </Link>

                        </div>
                    </div>

                ) : (

                    <div className="row g-4">

                        {notifications.map((notification) => {

                            const isTargetReached =
                                notification.type ===
                                "TARGET_REACHED";

                            const savedAmount =
                                notification.oldPrice &&
                                    notification.newPrice
                                    ? notification.oldPrice -
                                    notification.newPrice
                                    : 0;

                            return (
                                <div
                                    className="col-md-6 col-xl-4"
                                    key={notification._id}
                                >

                                    <div
                                        className={`card h-100 shadow-sm border-0 ${!notification.isRead
                                                ? "border-start border-4 border-primary"
                                                : ""
                                            }`}
                                    >

                                        <div className="card-body p-4">

                                            <div className="d-flex justify-content-between align-items-start mb-3">

                                                <span
                                                    className={
                                                        isTargetReached
                                                            ? "badge bg-success"
                                                            : "badge bg-warning text-dark"
                                                    }
                                                >
                                                    {isTargetReached
                                                        ? "Target Price Reached"
                                                        : "Price Drop"}
                                                </span>

                                                {!notification.isRead && (
                                                    <span className="badge bg-primary">
                                                        New
                                                    </span>
                                                )}

                                            </div>

                                            <h5 className="fw-bold">
                                                {notification.title}
                                            </h5>

                                            <p className="text-muted">
                                                {notification.message}
                                            </p>

                                            {notification.oldPrice !==
                                                null &&
                                                notification.newPrice !==
                                                null && (
                                                    <div className="bg-light rounded-3 p-3 mb-3">

                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>
                                                                Previous Price
                                                            </span>

                                                            <strong>
                                                                ₹
                                                                {notification.oldPrice.toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>
                                                        </div>

                                                        <div className="d-flex justify-content-between">
                                                            <span>
                                                                Current Price
                                                            </span>

                                                            <strong className="text-success">
                                                                ₹
                                                                {notification.newPrice.toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>
                                                        </div>

                                                        {savedAmount > 0 && (
                                                            <div className="d-flex justify-content-between mt-2">
                                                                <span>
                                                                    You Save
                                                                </span>

                                                                <strong className="text-success">
                                                                    ₹
                                                                    {savedAmount.toLocaleString(
                                                                        "en-IN"
                                                                    )}
                                                                </strong>
                                                            </div>
                                                        )}

                                                    </div>
                                                )}

                                            <small className="text-muted d-block mb-3">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString("en-IN")}
                                            </small>

                                            <div className="d-grid gap-2">

                                                {notification.productId?.url && (
                                                    <a
                                                        href={
                                                            notification.productId.url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-outline-primary"
                                                    >
                                                        View on Amazon
                                                    </a>
                                                )}

                                                {!notification.isRead && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() =>
                                                            markAsRead(
                                                                notification._id
                                                            )
                                                        }
                                                    >
                                                        Mark as Read
                                                    </button>
                                                )}

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

export default Notifications;