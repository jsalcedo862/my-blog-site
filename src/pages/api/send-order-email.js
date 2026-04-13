import { Resend } from 'resend';
import { supabaseClient } from '../../../lib/supabaseClient';
import { orderConfirmationEmail } from '../../../lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID required' });
  }

  try {
    // Fetch order with items
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product_id,
          products: product_id (title, artist)
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Format items for email
    const items = order.order_items.map(item => ({
      title: item.products.title,
      artist: item.products.artist,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }));

    // Send email
    const emailHtml = orderConfirmationEmail({ order, items });

    const sendResult = await resend.emails.send({
      from: 'noreply@shop.3krecordshop.com',
      to: order.email,
      subject: `Order Confirmation - 3k Records`,
      html: emailHtml,
    });

    if (sendResult.error) {
      console.error('Resend error:', sendResult.error);
      // Log error to database
      await supabaseClient
        .from('orders')
        .update({ 
          email_sent: false,
          email_error: sendResult.error.message 
        })
        .eq('id', orderId);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Log successful send to database
    await supabaseClient
      .from('orders')
      .update({ 
        email_sent: true,
        email_sent_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return res.status(200).json({ 
      message: 'Email sent successfully',
      emailId: sendResult.data.id 
    });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}