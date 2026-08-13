import { Link } from "react-router-dom";

function Home() {
    const isLoggedIn = !!localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    return (
        <div className="w-100">


            <section className="hero-section bg-white">
                <div className="container-fluid px-4 px-lg-5">
                    <div className="row align-items-center g-5">

                        <div className="col-lg-6">

                            <h1 className="hero-title text-dark mb-4">
                                Never Miss a{" "}
                                <span className="text-primary">
                                    Price Drop
                                </span>
                            </h1>

                            <p className="hero-description text-secondary mb-4">
                                Track Amazon products automatically,
                                monitor price changes, and receive email
                                alerts when your target price is reached.
                            </p>

                            {/* Login-dependent buttons */}
                            <div className="d-flex flex-wrap gap-3">

                                {isLoggedIn ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="btn btn-primary btn-lg px-4 py-3"
                                        >
                                            Open Dashboard
                                        </Link>

                                        <Link
                                            to="/add-product"
                                            className="btn btn-outline-dark btn-lg px-4 py-3"
                                        >
                                            Track a Product
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/register"
                                            className="btn btn-primary btn-lg px-4 py-3"
                                        >
                                            Start Tracking
                                        </Link>

                                        <Link
                                            to="/login"
                                            className="btn btn-outline-dark btn-lg px-4 py-3"
                                        >
                                            Login
                                        </Link>
                                    </>
                                )}

                            </div>

                            {isLoggedIn && (
                                <p className="text-muted mt-3 mb-0">
                                    Welcome back,{" "}
                                    <strong>
                                        {user?.name || "User"}
                                    </strong>
                                </p>
                            )}

                        </div>

                        {/* Right Side */}
                        <div className="col-lg-6">

                            <div className="card border-0 shadow-lg hero-preview">

                                <div className="card-body p-4 p-lg-5">

                                    <div className="d-flex justify-content-between align-items-start mb-4">

                                        <div>
                                            <span className="text-success fw-semibold">
                                                LIVE MONITORING
                                            </span>

                                            <h3 className="fw-bold mt-1 mb-1">
                                                PriceWatch System
                                            </h3>

                                            <p className="text-muted mb-0">
                                                Automatic Amazon price monitoring
                                            </p>
                                        </div>


                                    </div>

                                    {/* Amazon API */}
                                    <div className="border rounded-4 p-3 mb-3">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div>
                                                <small className="text-muted d-block">
                                                    Price Updates
                                                </small>

                                                <strong>
                                                    Automatic Price Updates
                                                </strong>
                                            </div>


                                        </div>

                                    </div>

                                    {/* Automatic Monitoring */}
                                    <div className="border rounded-4 p-3 mb-3">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div>
                                                <small className="text-muted d-block">
                                                    Price Monitoring
                                                </small>

                                                <strong>
                                                    Automatic Checks
                                                </strong>
                                            </div>

                                            <span className="text-success fw-semibold">
                                                Active
                                            </span>

                                        </div>

                                        <div
                                            className="progress mt-3"
                                            style={{ height: "8px" }}
                                        >
                                            <div
                                                className="progress-bar"
                                                style={{ width: "100%" }}
                                            />
                                        </div>

                                        <small className="text-muted">
                                            Tracked products are checked automatically
                                        </small>

                                    </div>



                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-5 bg-light">

                <div className="container-fluid px-4 px-lg-5 py-4">

                    <div className="text-center mb-5">

                        <span className="text-primary fw-semibold">
                            FEATURES
                        </span>

                        <h2 className="fw-bold mt-2">
                            Smart Price Monitoring
                        </h2>

                        <p className="text-muted">
                            Everything you need to track Amazon products
                            and make better buying decisions.
                        </p>

                    </div>

                    <div className="row g-4">

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100 feature-card">

                                <div className="card-body p-4">

                                    <div className="text-primary fs-1 mb-3">
                                        ↻
                                    </div>

                                    <h5 className="fw-bold">
                                        Automatic Monitoring
                                    </h5>

                                    <p className="text-muted mb-0">
                                        PriceWatch automatically checks the
                                        Amazon products you are tracking.
                                    </p>

                                </div>

                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100 feature-card">

                                <div className="card-body p-4">

                                    <div className="text-success fs-1 mb-3">
                                        ↓
                                    </div>

                                    <h5 className="fw-bold">
                                        Price Drop Detection
                                    </h5>

                                    <p className="text-muted mb-0">
                                        Detect price changes and maintain
                                        a complete price history.
                                    </p>

                                </div>

                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100 feature-card">

                                <div className="card-body p-4">

                                    <div className="text-warning fs-1 mb-3">
                                        ✉
                                    </div>

                                    <h5 className="fw-bold">
                                        Email Notifications
                                    </h5>

                                    <p className="text-muted mb-0">
                                        Receive an alert when your target
                                        price is reached.
                                    </p>

                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* How It Works */}
            <section className="py-5 bg-white">

                <div className="container-fluid px-4 px-lg-5 py-4">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            How PriceWatch Works
                        </h2>

                        <p className="text-muted">
                            Simple setup. Automatic monitoring.
                        </p>

                    </div>

                    <div className="row g-4 text-center">

                        <div className="col-md-4">

                            <div className="display-6 fw-bold text-primary">
                                01
                            </div>

                            <h5 className="fw-bold mt-3">
                                Add a Product
                            </h5>

                            <p className="text-muted">
                                Paste an Amazon product URL and fetch
                                its current price.
                            </p>

                        </div>

                        <div className="col-md-4">

                            <div className="display-6 fw-bold text-primary">
                                02
                            </div>

                            <h5 className="fw-bold mt-3">
                                Set Your Target Price
                            </h5>

                            <p className="text-muted">
                                Choose the price you are willing to pay.
                            </p>

                        </div>

                        <div className="col-md-4">

                            <div className="display-6 fw-bold text-primary">
                                03
                            </div>

                            <h5 className="fw-bold mt-3">
                                Receive Alerts
                            </h5>

                            <p className="text-muted">
                                Get email notifications when prices drop
                                or your target price is reached.
                            </p>

                        </div>

                    </div>

                </div>

            </section>



            {/* Footer */}
            <footer className="bg-dark text-white py-4">

                <div className="container-fluid px-4 px-lg-5">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">

                        <div>
                            <h5 className="fw-bold mb-1">
                                PriceWatch
                            </h5>

                            <small className="text-white-50">
                                Smart Amazon price monitoring.
                            </small>
                        </div>

                        <small className="text-white-50">
                            © 2026 PriceWatch
                        </small>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;