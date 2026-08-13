const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        asin: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        store: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        currentPrice: {
            type: Number,
            required: true,
        },

        targetPrice: {
            type: Number,
            required: true,
        },

        lastAlertPrice: {
            type: Number,
            default: null,
        },

        lastAlertAt: {
            type: Date,
            default: null,
        },


    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);