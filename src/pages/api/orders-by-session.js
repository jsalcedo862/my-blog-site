import { supabaseClient } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID required' });
  }

  try {
    const { data: order, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session_id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({ order });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}