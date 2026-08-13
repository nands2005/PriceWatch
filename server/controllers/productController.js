const Product = require("../models/Product");
const PriceHistory = require("../models/PriceHistory");
const {
    getAmazonProductByASIN,
} = require("../services/amazonService");

// ===============================
// ADD PRODUCT
// ===============================
const addProduct = async (req, res) => {
    try {
        const {
            asin,
            name,
            url,
            store,
            category,
            currentPrice,
            targetPrice,
            image,
        } = req.body;

        if (
            !asin ||
            !name ||
            !url ||
            !store ||
            !category ||
            currentPrice === undefined ||
            targetPrice === undefined
        ) {
            return res.status(400).json({
                message: "Required product fields are missing",
            });
        }

        const product = await Product.create({
            userId: req.userId,
            asin,
            name,
            url,
            store,
            category,
            currentPrice: Number(currentPrice),
            targetPrice: Number(targetPrice),
            image: image || "",
        });

        await PriceHistory.create({
            productId: product._id,
            userId: req.userId,
            price: Number(currentPrice),
        });

        res.status(201).json({
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        console.error("Add product error:", error);

        res.status(500).json({
            message: "Failed to add product",
            error: error.message,
        });
    }
};

// ===============================
// GET USER PRODUCTS
// ===============================
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            userId: req.userId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });
    }
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const oldPrice = Number(product.currentPrice);

        const {
            name,
            url,
            store,
            category,
            currentPrice,
            targetPrice,
            image,
        } = req.body;

        const newPrice = Number(currentPrice);

        const updatedProduct =
            await Product.findOneAndUpdate(
                {
                    _id: req.params.id,
                    userId: req.userId,
                },
                {
                    name,
                    url,
                    store,
                    category,
                    currentPrice: newPrice,
                    targetPrice: Number(targetPrice),
                    image: image || "",
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (oldPrice !== newPrice) {
            await PriceHistory.create({
                productId: product._id,
                userId: req.userId,
                price: newPrice,
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            message: "Failed to update product",
            error: error.message,
        });
    }
};

// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        await Product.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        await PriceHistory.deleteMany({
            productId: req.params.id,
            userId: req.userId,
        });

        res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Failed to delete product",
            error: error.message,
        });
    }
};

// ===============================
// GET PRICE HISTORY
// ===============================
const getPriceHistory = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const history = await PriceHistory.find({
            productId: req.params.id,
            userId: req.userId,
        }).sort({
            createdAt: 1,
        });

        res.status(200).json(history);
    } catch (error) {
        console.error("Get price history error:", error);

        res.status(500).json({
            message: "Failed to fetch price history",
            error: error.message,
        });
    }
};

// ===============================
// CHECK CURRENT AMAZON PRICE
// ===============================
const checkProductPrice = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        if (!product.asin) {
            return res.status(400).json({
                message: "ASIN is missing for this product",
            });
        }

        // Call Scout using saved ASIN
        const amazonProduct =
            await getAmazonProductByASIN(product.asin);

        const priceText =
            amazonProduct?.price_info?.Price;

        if (
            priceText === undefined ||
            priceText === null ||
            priceText === ""
        ) {
            return res.status(502).json({
                message:
                    "Current Amazon price was not returned by Scout",
            });
        }

        const newPrice = Number(
            String(priceText)
                .replace(/[₹,]/g, "")
                .trim()
        );

        if (!Number.isFinite(newPrice)) {
            return res.status(502).json({
                message: `Invalid Amazon price received: ${priceText}`,
            });
        }

        const oldPrice = Number(product.currentPrice);

        const priceDifference = newPrice - oldPrice;
        const priceDropped = newPrice < oldPrice;
        const priceIncreased = newPrice > oldPrice;
        const priceChanged = newPrice !== oldPrice;

        // Save new price only when it changes
        if (priceChanged) {
            await PriceHistory.create({
                productId: product._id,
                userId: req.userId,
                price: newPrice,
            });
        }

        product.currentPrice = newPrice;
        await product.save();

        const targetReached =
            newPrice <= Number(product.targetPrice);

        res.status(200).json({
            message: "Price checked successfully",
            oldPrice,
            newPrice,
            priceDifference,
            priceDropped,
            priceIncreased,
            priceChanged,
            targetReached,
            product,
        });
    } catch (error) {
        console.error("Check price error:", error);

        res.status(500).json({
            message:
                error.message || "Failed to check current price",
        });
    }
};

module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getPriceHistory,
    checkProductPrice,
};