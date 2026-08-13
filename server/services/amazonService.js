const axios = require("axios");

const PRODUCT_URL =
    "https://scout-amazon-data.p.rapidapi.com/Amazon-Product-Data";

const SEARCH_URL =
    "https://scout-amazon-data.p.rapidapi.com/Amazon-Search-Data";

const scoutHeaders = {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host":
        "scout-amazon-data.p.rapidapi.com",
};

// Get one Amazon product using ASIN
const getAmazonProductByASIN = async (asin) => {
    try {
        const response = await axios.get(PRODUCT_URL, {
            params: {
                region: "IN",
                asin: asin,
            },

            headers: scoutHeaders,
        });

        return response.data;
    } catch (error) {
        console.error(
            "Product Data error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Failed to fetch Amazon product data"
        );
    }
};


// Search Amazon products
const searchAmazonProducts = async (query) => {
    try {
        const response = await axios.get(SEARCH_URL, {
            params: {
                query,
                region: "IN",
                sort_by: "RELEVANCE",
                page: "1",
            },

            headers: scoutHeaders,
        });

        return response.data;
    } catch (error) {
        console.error(
            "Search Data error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Failed to search Amazon products"
        );
    }
};


// Get image using search as fallback
const getAmazonProductImage = async (asin) => {
    try {
        const data = await searchAmazonProducts(asin);

        const products = data?.products || [];

        const matchingProduct = products.find(
            (item) =>
                item.asin?.toLowerCase() ===
                asin.toLowerCase()
        );

        if (!matchingProduct) {
            return "";
        }

        return (
            matchingProduct.product_image ||
            matchingProduct.product_image_url ||
            matchingProduct.thumbnail ||
            ""
        );
    } catch (error) {
        console.error(
            "Image lookup error:",
            error.message
        );

        return "";
    }
};


// Get complete Amazon product information
const getAmazonProductDetails = async (asin) => {
    const product =
        await getAmazonProductByASIN(asin);

    let image =
        product.product_image || "";

    // Try thumbnail images
    if (
        !image &&
        Array.isArray(product.thumbnail_images) &&
        product.thumbnail_images.length > 0
    ) {
        image = product.thumbnail_images[0];
    }

    // Try Search Data if image is still missing
    if (!image) {
        image = await getAmazonProductImage(
            asin
        );
    }

    return {
        ...product,
        product_image: image,
    };
};

module.exports = {
    getAmazonProductByASIN,
    searchAmazonProducts,
    getAmazonProductDetails,
};