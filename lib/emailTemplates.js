export function orderConfirmationEmail({ order, items }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px 0; }
          .order-item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
          .button { background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          .footer { color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>3k Records - Order Confirmation</h1>
          </div>
          
          <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Order ID: <strong>${order.id.substring(0, 8)}</strong></p>
            <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
            
            <h3>Items Ordered:</h3>
            ${items.map(item => `
              <div class="order-item">
                <strong>${item.title}</strong> - ${item.artist}<br>
                Quantity: ${item.quantity} × $${item.price_at_purchase.toFixed(2)}<br>
                Subtotal: $${(item.quantity * item.price_at_purchase).toFixed(2)}
              </div>
            `).join('')}
            
            <div class="total">
              Total: $${order.total_amount.toFixed(2)}
            </div>
            
            <h3>Shipping Address:</h3>
            <p>${order.shipping_address}</p>
            
            <p>We'll send you a shipping confirmation once your order ships!</p>
            
            <a href="https://shop.3krecordshop.com/account/orders/${order.id}" class="button">
              View Your Order
            </a>
          </div>
          
          <div class="footer">
            <p>© 2026 3k Records. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}