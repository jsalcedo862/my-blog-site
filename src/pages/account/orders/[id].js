import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseClient } from "../../../../lib/supabaseClient";

const PAGE_BG = "#f5f3f0";
const CARD_BG = "#FCFAFA";
const PRIMARY = "#1a1a2e";
const SECONDARY = "#666666";
const BORDER = "#e0e0e0";

const STATUS_COLORS = {
  pending:   { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
  paid:      { bg: "#dcfce7", color: "#166534", label: "Paid" },
  shipped:   { bg: "#dbeafe", color: "#1e40af", label: "Shipped" },
  delivered: { bg: "#f0fdf4", color: "#15803d", label: "Delivered" },
  cancelled: { bg: "#fee2e2", color: "#b91c1c", label: "Cancelled" },
};

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          const { error: msg } = await res.json();
          setError(msg || "Failed to fetch order");
          return;
        }
        setOrder(await res.json());
      } catch (err) {
        console.error(err);
        setError("Failed to load order.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const status = order ? (STATUS_COLORS[order.status] || STATUS_COLORS.pending) : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: PAGE_BG, display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "48px 24px" }}>
        <Link
          href="/account/orders"
          style={{ fontSize: "13px", color: SECONDARY, textDecoration: "none", display: "inline-block", marginBottom: "24px" }}
        >
          â† Back to Orders
        </Link>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: SECONDARY }}>Loading...</div>
        ) : error ? (
          <div style={{ color: "#b91c1c", backgroundColor: "#fde8e8", border: "1px solid #f5c6c6", borderRadius: "8px", padding: "16px" }}>
            {error}
          </div>
        ) : !order ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: SECONDARY }}>Order not found.</div>
        ) : (
          <>
            {/* Header */}
            <div
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                marginBottom: "28px", flexWrap: "wrap", gap: "12px",
              }}
            >
              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "800", color: PRIMARY, marginBottom: "4px" }}>
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p style={{ fontSize: "13px", color: SECONDARY }}>
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
              <span
                style={{
                  backgroundColor: status.bg, color: status.color,
                  fontSize: "13px", fontWeight: "700", padding: "6px 14px",
                  borderRadius: "20px", alignSelf: "flex-start",
                }}
              >
                {status.label}
              </span>
            </div>

            {/* Items card */}
            <div
              style={{
                backgroundColor: CARD_BG, border: `1px solid ${BORDER}`,
                borderRadius: "10px", marginBottom: "16px", overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
                <h2 style={{ fontSize: "14px", fontWeight: "700", color: PRIMARY }}>Items</h2>
              </div>

              {order.order_items?.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 20px",
                    borderBottom: i < order.order_items.length - 1 ? `1px solid ${BORDER}` : "none",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {item.products?.image_url && (
                      <img
                        src={item.products.image_url}
                        alt={item.products?.title}
                        style={{
                          width: "56px", height: "56px", objectFit: "cover",
                          borderRadius: "6px", border: `1px solid ${BORDER}`,
                        }}
                      />
                    )}
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "700", color: PRIMARY, marginBottom: "2px" }}>
                        {item.products?.title || "Unknown Product"}
                      </p>
                      <p style={{ fontSize: "13px", color: SECONDARY }}>
                        {item.products?.artist} &mdash; Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: PRIMARY, whiteSpace: "nowrap" }}>
                    ${(item.price_at_purchase * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div
                style={{
                  display: "flex", justifyContent: "space-between", padding: "14px 20px",
                  borderTop: `1px solid ${BORDER}`, backgroundColor: "#f9f8f7",
                }}
              >
                <p style={{ fontSize: "15px", fontWeight: "800", color: PRIMARY }}>Total</p>
                <p style={{ fontSize: "15px", fontWeight: "800", color: PRIMARY }}>
                  ${Number(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Shipping card */}
            <div
              style={{
                backgroundColor: CARD_BG, border: `1px solid ${BORDER}`,
                borderRadius: "10px", overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
                <h2 style={{ fontSize: "14px", fontWeight: "700", color: PRIMARY }}>Shipping Address</h2>
              </div>
              <div style={{ padding: "16px 20px", fontSize: "14px", color: PRIMARY, lineHeight: "1.7" }}>
                {order.shipping_address ? (
                  typeof order.shipping_address === "object" ? (
                    <>
                      {order.shipping_address.name && <p>{order.shipping_address.name}</p>}
                      {order.shipping_address.line1 && <p>{order.shipping_address.line1}</p>}
                      {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                      <p>
                        {[order.shipping_address.city, order.shipping_address.state, order.shipping_address.postal_code]
                          .filter(Boolean).join(", ")}
                      </p>
                      {order.shipping_address.country && <p>{order.shipping_address.country}</p>}
                    </>
                  ) : (
                    <p style={{ whiteSpace: "pre-line" }}>{order.shipping_address}</p>
                  )
                ) : (
                  <p style={{ color: SECONDARY }}>No shipping address on file.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
