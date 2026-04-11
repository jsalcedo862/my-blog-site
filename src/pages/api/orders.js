import { supabaseClient } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch user's orders (protected)
    return getOrders(req, res);
  } else if (req.method === 'POST') {
    // Create a new order
    return createOrder(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getOrders(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get user from token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Fetch user's orders
    const { data, error } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product_id,
          products: product_id (title, artist, image_url)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function createOrder(req, res) {
  const { items, email, shipping_address, user_id } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items required' });
  }

  if (!email || !shipping_address) {
    return res.status(400).json({ error: 'Email and shipping address required' });
  }

  try {
    // Fetch all products and calculate total
    let total = 0;
    const itemsWithPrices = [];

    for (const item of items) {
      const { data: product, error } = await supabaseClient
        .from('products')
        .select('price')
        .eq('id', item.product_id)
        .single();

      if (error || !product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      itemsWithPrices.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: product.price,
      });
    }

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert([
        {
          user_id: user_id || null,
          email,
          shipping_address,
          total_amount: total,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    // Create order items with correct prices
    const orderItemsData = itemsWithPrices.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      // Rollback: delete order
      await supabaseClient.from('orders').delete().eq('id', order.id);
      return res.status(500).json({ error: 'Failed to add items to order' });
    }

    // Return order ID for Stripe checkout
    return res.status(201).json({
      order_id: order.id,
      total_amount: total,
      message: 'Order created successfully',
    });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}