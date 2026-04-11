import { supabaseClient } from '../../../../lib/supabaseClient';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  // Check auth (basic check - in production, verify admin role)
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    return createProduct(req, res, token);
  } else if (req.method === 'GET') {
    return getProducts(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function createProduct(req, res, token) {
  const { title, artist, description, price, stock_quantity, image_url, release_date, genre, format } = req.body;

  if (!title || !artist || price === undefined) {
    return res.status(400).json({ error: 'Title, artist, and price required' });
  }

  try {
    const { data, error } = await supabaseClient
      .from('products')
      .insert([
        {
          title,
          artist,
          description,
          price: parseFloat(price),
          stock_quantity: parseInt(stock_quantity) || 0,
          image_url,
          release_date,
          genre,
          format: format || '12-inch vinyl',
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProducts(req, res) {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
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