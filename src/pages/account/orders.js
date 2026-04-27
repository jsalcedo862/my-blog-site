import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseClient } from "../../../lib/supabaseClient";

const PAGE_BG = "#f5f3f0";
const CARD_BG = "#FCFAFA";
const PRIMARY = "#1a1a2e";
const SECONDARY = "#666666";
const BORDER = "#e0e0e0";

const STATUS_COLORS = {
  pending: { bg: "#fef9c3", color: "#854d0e", label: "Pending" },
  paid: { bg: "#dcfce7", color: "#166534", label: "Paid" },
  shipped: { bg: "#dbeafe", color: "#1e40af", label: "Shipped" },
  delivered: { bg: "#f0fdf4", color: "#15803d", label: "Delivered" },
  cancelled: { bg: "#fee2e2", color: "#b91c1c", label: "Cancelled" },
};

export default function CustomerOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      try {
        const res = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        setOrders(await res.json());
      } catch (err) {
        console.error(err);
        setError("Failed to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: PAGE_BG,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "800",
            color: PRIMARY,
            marginBottom: "8px",
          }}
        >
          My Orders
        </h1>
        <p style={{ color: SECONDARY, fontSize: "14px", marginBottom: "32px" }}>
          View your order history and track shipments.
        </p>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: SECONDARY }}
          >
            Loading...
          </div>
        ) : error ? (
          <div
            style={{
              color: "#b91c1c",
              backgroundColor: "#fde8e8",
              border: "1px solid #f5c6c6",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <p style={{ color: SECONDARY, marginBottom: "20px" }}>
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/"
              style={{
                backgroundColor: PRIMARY,
                color: "#FCFAFA",
                padding: "12px 28px",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Browse the Shop
            </Link>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {orders.map((order) => {
              const status =
                STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const date = new Date(order.created_at).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              );
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      backgroundColor: CARD_BG,
                      border: `1px solid ${BORDER}`,
                      borderRadius: "10px",
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 16px rgba(0,0,0,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: SECONDARY,
                          marginBottom: "4px",
                        }}
                      >
                        {date}
                      </p>
                      <p
                        style={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: PRIMARY,
                          marginBottom: "4px",
                        }}
                      >
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p style={{ fontSize: "13px", color: SECONDARY }}>
                        {order.order_items?.length ?? 0} item
                        {order.order_items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "17px",
                          fontWeight: "800",
                          color: PRIMARY,
                          marginBottom: "8px",
                        }}
                      >
                        ${Number(order.total_amount).toFixed(2)}
                      </p>
                      <span
                        style={{
                          backgroundColor: status.bg,
                          color: status.color,
                          fontSize: "12px",
                          fontWeight: "700",
                          padding: "4px 10px",
                          borderRadius: "20px",
                        }}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
