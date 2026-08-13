const express = require("express");

const {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getPriceHistory,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add product
router.post("/", protect, addProduct);

// Get user's products
router.get("/", protect, getProducts);

// Update product
router.put("/:id", protect, updateProduct);

// Delete product
router.delete("/:id", protect, deleteProduct);

// Get price history
router.get("/:id/history", protect, getPriceHistory);

module.exports = router;