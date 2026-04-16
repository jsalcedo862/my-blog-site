import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  // Check auth
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get user from token
  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Verify admin role using admin_users table
  const { data: adminCheck, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (adminError || !adminCheck) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (req.method === "GET") {
    return getOrders(req, res);
  } else if (req.method === "PUT") {
    return updateOrder(req, res);
  }
}

async function getOrders(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          product_id
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateOrder(req, res) {
  const { id, status, trackingNumber, carrier } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "id and status required" });
  }

  try {
    // Get current order to check previous status
    const { data: currentOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // Trigger email based on new status
    if (status === "shipped" && currentOrder.status !== "shipped") {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-shipping-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: id,
              trackingNumber: trackingNumber || "TBA",
              carrier: carrier || "Standard Shipping",
            }),
          },
        );
      } catch (err) {
        console.error("Failed to send shipping email:", err);
      }
    } else if (status === "delivered" && currentOrder.status !== "delivered") {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-delivery-email`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: id }),
          },
        );
      } catch (err) {
        console.error("Failed to send delivery email:", err);
      }
    }

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
