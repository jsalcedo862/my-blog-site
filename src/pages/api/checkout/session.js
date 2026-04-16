import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Server-side only admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { items, email, shipping_address } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!items || items.length === 0 || !email || !shipping_address) {
    return res
      .status(400)
      .json({ error: "Items, email, and shipping address required" });
  }

  try {
    // Get user ID if authenticated (optional for guest checkout)
    let userId = null;
    if (token) {
      const {
        data: { user },
        error: userError,
      } = await supabaseAdmin.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    // Step 1: Create order in Supabase first
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: userId, // Add user_id if authenticated
          email,
          shipping_address,
          total_amount: items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return res.status(500).json({ error: "Failed to create order" });
    }

    // Step 2: Create order items
    const orderItemsData = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      // Rollback: delete order
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return res.status(500).json({ error: "Failed to add items to order" });
    }

    // Step 3: Create Stripe checkout session
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: item.artist,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/cart`,
      customer_email: email,
    });

    // Step 4: Update order with Stripe session ID
    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to update order with session ID:", updateError);
    }

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({
      error: "Failed to create checkout session",
      details: err.message,
    });
  }
}
