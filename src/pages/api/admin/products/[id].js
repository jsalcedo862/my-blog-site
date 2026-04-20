import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!id) {
    return res.status(400).json({ error: "Product ID required" });
  }

  // Verify token and admin role
  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { data: adminCheck, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (adminError || !adminCheck) {
    return res.status(403).json({ error: "Admin access required" });
  }

  if (req.method === "PUT") {
    return updateProduct(req, res, id);
  } else if (req.method === "DELETE") {
    return deleteProduct(req, res, id);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

async function updateProduct(req, res, id) {
  const {
    title,
    artist,
    description,
    price,
    stock_quantity,
    image_url,
    release_date,
    genre,
    format,
  } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .update({
        title,
        artist,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        stock_quantity:
          stock_quantity !== undefined ? parseInt(stock_quantity) : undefined,
        image_url,
        release_date,
        genre,
        format,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res
        .status(500)
        .json({ error: error?.message || "Product not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteProduct(req, res, id) {
  try {
    // Remove order_items rows referencing this product (product_id is NOT NULL)
    const { error: unlinkError } = await supabaseAdmin
      .from("order_items")
      .delete()
      .eq("product_id", id);

    if (unlinkError) {
      return res.status(500).json({ error: unlinkError.message });
    }

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
