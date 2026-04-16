export function orderConfirmationEmail({ order, items }) {
  const orderLink = `${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${order.id}`;

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #A390E4; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 10px; }
          .button { display: inline-block; background-color: #A390E4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>

          <div class="section">
            <h2>Thank you for your order!</h2>
            <p>Your order has been confirmed and will be shipped soon.</p>
            <p><strong>Order #${order.id.slice(0, 8)}</strong></p>
          </div>

          <div class="section">
            <h3>Order Items</h3>
            ${items
              .map(
                (item) => `
              <div class="item">
                <div>
                  <strong>${item.title}</strong><br/>
                  ${item.artist}<br/>
                  Qty: ${item.quantity}
                </div>
                <div>$${(item.price_at_purchase * item.quantity).toFixed(2)}</div>
              </div>
            `,
              )
              .join("")}
            <div class="total">Total: $${order.total_amount.toFixed(2)}</div>
          </div>

          <div class="section">
            <h3>Shipping Address</h3>
            <p>${order.shipping_address.replace(/\n/g, "<br/>")}</p>
          </div>

          <div style="text-align: center;">
            <a href="${orderLink}" class="button">View Your Order</a>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>We'll send you a shipping confirmation once your order ships!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function shippingNotificationEmail({ order, trackingNumber, carrier }) {
  const orderLink = `${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${order.id}`;

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #A390E4; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
          .tracking { background-color: #f0f0f0; padding: 15px; border-radius: 5px; font-family: monospace; }
          .button { display: inline-block; background-color: #A390E4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order is on the Way!</h1>
          </div>

          <div class="section">
            <h2>Order #${order.id.slice(0, 8)}</h2>
            <p>Your order has been shipped and is on its way to you.</p>
          </div>

          <div class="section">
            <h3>Tracking Information</h3>
            <p><strong>Carrier:</strong> ${carrier}</p>
            <div class="tracking">
              <strong>Tracking #:</strong> ${trackingNumber}
            </div>
            <p style="margin-top: 10px; font-size: 12px; color: #666;">Click the tracking number above to track your shipment in real-time.</p>
          </div>

          <div style="text-align: center;">
            <a href="${orderLink}" class="button">View Your Order</a>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>We appreciate your business!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function deliveryConfirmationEmail({ order }) {
  const orderLink = `${process.env.NEXT_PUBLIC_BASE_URL}/account/orders/${order.id}`;

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #A390E4; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
          .button { display: inline-block; background-color: #A390E4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order Has Arrived!</h1>
          </div>

          <div class="section">
            <h2>Order #${order.id.slice(0, 8)}</h2>
            <p>Your order has been delivered successfully. We hope you enjoy your vinyl!</p>
          </div>

          <div class="section">
            <h3>What's Next?</h3>
            <p>If you have any questions or issues with your order, please don't hesitate to reach out.</p>
          </div>

          <div style="text-align: center;">
            <a href="${orderLink}" class="button">View Your Order</a>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>Thank you for shopping with 3k Records!</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
