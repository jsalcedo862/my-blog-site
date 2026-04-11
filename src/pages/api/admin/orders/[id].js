import { supabaseClient } from '../../../../../lib/supabaseClient';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Order ID required' });
  }

  const { status } = req.body;

  if (!status || !['pending', 'paid', 'shipped', 'delivered'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(500).json({ error: error?.message || 'Order not found' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}