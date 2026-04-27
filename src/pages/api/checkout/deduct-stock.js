import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id } = req.body;
  if (!session_id) {
    return res.status(400).json({ error: "session_id required" });
  }

  // Find the order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, stock_deducted, order_items(product_id, quantity)")
    .eq("stripe_session_id", session_id)
    .single();

  if (orderError || !order) {
    console.error("Order lookup error:", orderError);
    return res.status(404).json({ error: "Order not found" });
  }

  // Idempotency guard — don't deduct twice on page refresh
  if (order.stock_deducted) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  // Decrement stock_quantity for each item
  for (const item of order.order_items) {
    const { error: deductError } = await supabaseAdmin.rpc("decrement_stock", {
      product_id: item.product_id,
      amount: item.quantity,
    });
    if (deductError) {
      console.error("Stock deduction error:", deductError);
      // Don't block the success page — log and continue
    }
  }

  // Mark order as stock deducted
  await supabaseAdmin
    .from("orders")
    .update({ stock_deducted: true })
    .eq("id", order.id);

  return res.status(200).json({ ok: true });
}
