import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { shippingNotificationEmail } from "../../../lib/emailTemplates";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, trackingNumber, carrier } = req.body;

  if (!orderId || !trackingNumber || !carrier) {
    return res
      .status(400)
      .json({ error: "Order ID, tracking number, and carrier required" });
  }

  try {
    // Fetch order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Send email
    const emailHtml = shippingNotificationEmail({
      order,
      trackingNumber,
      carrier,
    });

    const sendResult = await resend.emails.send({
      from: "noreply@shop.3krecordshop.com",
      to: order.email,
      subject: `Your Order is on the Way - 3k Records`,
      html: emailHtml,
    });

    if (sendResult.error) {
      console.error("Resend error:", sendResult.error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Shipping email sent" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
