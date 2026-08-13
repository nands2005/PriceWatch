const express = require("express");

const {
    getAmazonProductDetails,
} = require("../services/amazonService");

const router = express.Router();


// Fetch product using Amazon URL
router.get("/product-by-url", async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                message:
                    "Amazon product URL is required",
            });
        }

        const match = url.match(
            /(?:\/dp\/|\/gp\/product\/|\/dp%2F)([A-Z0-9]{10})/i
        );

        if (!match) {
            return res.status(400).json({
                message:
                    "Could not find a valid Amazon ASIN in the URL",
            });
        }

        const asin = match[1].toUpperCase();

        const product =
            await getAmazonProductDetails(asin);

        res.status(200).json({
            asin,
            product,
        });

    } catch (error) {
        console.error(
            "Amazon product route error:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
});


// Direct ASIN lookup
router.get("/product/:asin", async (req, res) => {
    try {
        const asin =
            req.params.asin.toUpperCase();

        const product =
            await getAmazonProductDetails(asin);

        res.status(200).json({
            asin,
            product,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;