const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const sendPriceAlert = async ({
    to,
    productName,
    productUrl,
    oldPrice,
    newPrice,
    targetPrice,
}) => {
    const priceDrop = oldPrice - newPrice;
    const targetReached = newPrice <= targetPrice;

    const mailOptions = {
        from: `"PriceWatch" <${process.env.EMAIL_USER}>`,
        to,

        subject: targetReached
            ? `PriceWatch: Target price reached for ${productName}`
            : `PriceWatch: Price dropped for ${productName}`,

        html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
      ">

        <div style="
          background: #0d6efd;
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
        ">
          <h2 style="margin: 0;">
            PriceWatch Alert
          </h2>
        </div>

        <div style="
          border: 1px solid #ddd;
          border-top: none;
          padding: 25px;
        ">

          <h3>
            ${productName}
          </h3>

          <p>
            The Amazon price has changed.
          </p>

          <table style="
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          ">

            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                Previous Price
              </td>

              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">
                ₹${oldPrice.toLocaleString("en-IN")}
              </td>
            </tr>

            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                Current Price
              </td>

              <td style="
                padding: 8px;
                border-bottom: 1px solid #eee;
                font-weight: bold;
                color: #198754;
              ">
                ₹${newPrice.toLocaleString("en-IN")}
              </td>
            </tr>

            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                Target Price
              </td>

              <td style="
                padding: 8px;
                border-bottom: 1px solid #eee;
                font-weight: bold;
              ">
                ₹${targetPrice.toLocaleString("en-IN")}
              </td>
            </tr>

            <tr>
              <td style="padding: 8px;">
                Price Drop
              </td>

              <td style="
                padding: 8px;
                font-weight: bold;
                color: #198754;
              ">
                ₹${Math.max(priceDrop, 0).toLocaleString("en-IN")}
              </td>
            </tr>

          </table>

          <div style="
            background: ${targetReached ? "#d1e7dd" : "#fff3cd"
            };
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
          ">

            <strong>
              ${targetReached
                ? "Your target price has been reached."
                : "The product price has dropped."
            }
            </strong>

          </div>

          <div style="text-align: center;">

            <a
              href="${productUrl}"
              target="_blank"
              style="
                display: inline-block;
                padding: 12px 25px;
                background: #0d6efd;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              View Product on Amazon
            </a>

          </div>

          <p style="
            color: #777;
            font-size: 12px;
            margin-top: 25px;
          ">
            This is an automated alert from PriceWatch.
          </p>

        </div>

      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendPriceAlert,
};