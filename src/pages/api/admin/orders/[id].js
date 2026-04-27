import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!id) {
    return res.status(400).json({ error: "Order ID required" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user)
    return res.status(401).json({ error: "Invalid token" });

  const { data: adminCheck, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();
  if (adminError || !adminCheck)
    return res.status(403).json({ error: "Admin access required" });

  const { status } = req.body;

  if (
    !status ||
    !["pending", "paid", "shipped", "delivered"].includes(status)
  ) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res
        .status(500)
        .json({ error: error?.message || "Order not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
