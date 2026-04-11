import { supabaseClient } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  if (req.method === 'PUT') {
    return updateProduct(req, res, id);
  } else if (req.method === 'DELETE') {
    return deleteProduct(req, res, id);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function updateProduct(req, res, id) {
  const { title, artist, description, price, stock_quantity, image_url, release_date, genre, format } = req.body;

  try {
    const { data, error } = await supabaseClient
      .from('products')
      .update({
        title,
        artist,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        stock_quantity: stock_quantity !== undefined ? parseInt(stock_quantity) : undefined,
        image_url,
        release_date,
        genre,
        format,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(500).json({ error: error?.message || 'Product not found' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteProduct(req, res, id) {
  try {
    const { error } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}