# PriceWatch
An Amazon price monitoring and alert system that tracks product prices, detects price drops, and sends email notifications when the target price is reached.

## Tech Stack

**Frontend:** React, Vite, Bootstrap, Axios, React Router
**Backend:** Node.js, Express.js, Mongoose, JWT, bcrypt, node-cron, Nodemailer
**Database:** MongoDB Atlas
**External API:** Amazon Product Data API through RapidAPI

How It Works

1. User logs in and adds an Amazon product URL.
2. PriceWatch extracts the ASIN and fetches the current product price.
3. The user sets a target price and the product is stored in MongoDB.
4. A scheduled background job periodically checks the latest price.
5. The system compares the latest price with the previous and target prices.
6. When a price drop or target price is detected, the price history and notification are updated and an email alert is sent.
