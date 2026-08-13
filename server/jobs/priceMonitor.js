const cron = require("node-cron");

const Product = require("../models/Product");
const PriceHistory = require("../models/PriceHistory");
const User = require("../models/User");
const Notification = require("../models/Notification");

const {
    getAmazonProductByASIN,
} = require("../services/amazonService");

const {
    sendPriceAlert,
} = require("../services/emailService");

const checkAllPrices = async () => {
    console.log("Starting automatic price check...");

    try {
        const products = await Product.find({
            store: "Amazon",
            asin: {
                $exists: true,
                $ne: "",
            },
        });

        console.log(
            `Found ${products.length} Amazon products to check`
        );

        for (const product of products) {
            try {
                const amazonProduct =
                    await getAmazonProductByASIN(product.asin);

                const priceText =
                    amazonProduct?.price_info?.Price;

                if (
                    priceText === undefined ||
                    priceText === null ||
                    priceText === ""
                ) {
                    console.log(
                        `No price returned for ${product.asin}`
                    );
                    continue;
                }

                const newPrice = Number(
                    String(priceText)
                        .replace(/[₹,]/g, "")
                        .trim()
                );

                if (!Number.isFinite(newPrice)) {
                    console.log(
                        `Invalid price for ${product.asin}: ${priceText}`
                    );
                    continue;
                }

                const oldPrice = Number(
                    product.currentPrice
                );

                // No price change
                if (newPrice === oldPrice) {
                    console.log(
                        `No change: ${product.name} | ₹${oldPrice}`
                    );
                    continue;
                }

                // Save price history
                await PriceHistory.create({
                    productId: product._id,
                    userId: product.userId,
                    price: newPrice,
                });

                // Update current price
                product.currentPrice = newPrice;

                // ==============================
                // PRICE DROP
                // ==============================
                if (newPrice < oldPrice) {
                    const user = await User.findById(
                        product.userId
                    );

                    if (!user) {
                        console.log(
                            `User not found for ${product.name}`
                        );

                        await product.save();
                        continue;
                    }

                    const targetPrice = Number(
                        product.targetPrice
                    );

                    const targetReached =
                        newPrice <= targetPrice;

                    // Create in-app notification
                    await Notification.create({
                        userId: product.userId,
                        productId: product._id,

                        type: targetReached
                            ? "TARGET_REACHED"
                            : "PRICE_DROP",

                        title: targetReached
                            ? "Target price reached"
                            : "Price dropped",

                        message: targetReached
                            ? `${product.name} has reached your target price of ₹${targetPrice.toLocaleString(
                                "en-IN"
                            )}.`
                            : `${product.name} price dropped from ₹${oldPrice.toLocaleString(
                                "en-IN"
                            )} to ₹${newPrice.toLocaleString(
                                "en-IN"
                            )}.`,

                        oldPrice,
                        newPrice,
                    });

                    // Prevent duplicate email for the same price
                    const shouldSendEmail =
                        product.lastAlertPrice !== newPrice;

                    if (
                        shouldSendEmail &&
                        user.email
                    ) {
                        await sendPriceAlert({
                            to: user.email,
                            productName: product.name,
                            productUrl: product.url,
                            oldPrice,
                            newPrice,
                            targetPrice,
                        });

                        product.lastAlertPrice = newPrice;
                        product.lastAlertAt = new Date();

                        console.log(
                            `Email alert sent to ${user.email}`
                        );
                    }

                    console.log(
                        `PRICE DROP: ${product.name} | ₹${oldPrice} → ₹${newPrice}`
                    );

                    if (targetReached) {
                        console.log(
                            `TARGET REACHED: ${product.name}`
                        );
                    }
                }

                // ==============================
                // PRICE INCREASE
                // ==============================
                else if (newPrice > oldPrice) {
                    console.log(
                        `PRICE INCREASE: ${product.name} | ₹${oldPrice} → ₹${newPrice}`
                    );
                }

                await product.save();

            } catch (error) {
                console.error(
                    `Failed to check ${product.name}:`,
                    error.message
                );
            }
        }

        console.log(
            "Automatic price check completed."
        );

    } catch (error) {
        console.error(
            "Automatic price monitor error:",
            error.message
        );
    }
};

// Testing: every 5 minutes
cron.schedule("*/5 * * * *", () => {
    checkAllPrices();
});

module.exports = {
    checkAllPrices,
};