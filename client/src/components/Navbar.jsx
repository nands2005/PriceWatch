import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();

    const isLoggedIn =
        !!localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    const isActive = (path) => {
        return location.pathname === path
            ? "nav-link active fw-semibold"
            : "nav-link";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container-fluid px-4 px-lg-5">

                <Link
                    to="/"
                    className="navbar-brand fw-bold fs-4"
                >
                    Smart Price Tracker
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="mainNavbar"
                >

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {!isLoggedIn && (
                            <li className="nav-item">
                                <Link
                                    to="/"
                                    className={isActive("/")}
                                >
                                    Home
                                </Link>
                            </li>
                        )}

                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        to="/dashboard"
                                        className={isActive("/dashboard")}
                                    >
                                        Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to="/add-product"
                                        className={isActive("/add-product")}
                                    >
                                        Track Product
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to="/notifications"
                                        className={isActive("/notifications")}
                                    >
                                        Price Alerts
                                    </Link>
                                </li>
                            </>
                        )}

                    </ul>

                    <ul className="navbar-nav align-items-lg-center">

                        {isLoggedIn ? (
                            <>
                                <li className="nav-item me-lg-3">
                                    <span className="nav-link">
                                        Hello, {user?.name || "User"}
                                    </span>
                                </li>

                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="btn btn-outline-light btn-sm"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link
                                        to="/login"
                                        className={isActive("/login")}
                                    >
                                        Login
                                    </Link>
                                </li>

                                <li className="nav-item ms-lg-2">
                                    <Link
                                        to="/register"
                                        className="btn btn-primary btn-sm px-3"
                                    >
                                        Create Account
                                    </Link>
                                </li>
                            </>
                        )}

                    </ul>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;