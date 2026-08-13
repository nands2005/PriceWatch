# PriceWatch

PriceWatch is an Amazon price monitoring and alert system that helps users track product prices and receive email notifications when a price drops or reaches their target price.

## Features

- User registration and login
- JWT-based authentication
- Add Amazon products using an Amazon product URL
- Automatic ASIN extraction
- Fetch product details and current price
- Set a target price
- Automatic periodic price monitoring
- Price history tracking
- Price drop detection
- Target price detection
- Email alerts
- Dashboard for managing tracked products
- Search, filter, and sort products
- View price history
- Open products directly on Amazon
- MongoDB database

## Technology Stack

### Frontend

- React.js
- Vite
- Bootstrap
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- node-cron
- Nodemailer

### External Services

- Amazon Product Data API through RapidAPI
- Gmail SMTP
- MongoDB Atlas

## How PriceWatch Works

1. User logs in and adds an Amazon product URL.
2. PriceWatch extracts the product ASIN and fetches product details using the Amazon Product Data API.
3. The user sets a target price, and the product is stored in MongoDB.
4. A scheduled background job automatically checks the latest price.
5. The system compares the new price with the previous and target prices.
6. If a price drop or target price is detected, the price history is updated and an email alert is sent.
7. Users can view their tracked products, prices, alerts, and price history from the dashboard.