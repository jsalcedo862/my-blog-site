import { createClient } from "@supabase/supabase-js";

// Server-side only admin client
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
    return getOrders(req, res, token);
  } else if (req.method === "PUT") {
    return updateOrder(req, res, token);
  }
}

async function getOrders(req, res, token) {
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

async function updateOrder(req, res, token) {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "id and status required" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
