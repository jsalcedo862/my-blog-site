import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseClient } from "../../../lib/supabaseClient";

const PAGE_BG = "#f5f3f0";
const CARD_BG = "#FCFAFA";
const PRIMARY = "#1a1a2e";
const BORDER = "#e0e0e0";
const SECONDARY = "#666666";

const inputStyle = {
  width: "100%",
  border: `1px solid ${BORDER}`,
  borderRadius: "6px",
  padding: "10px 12px",
  fontSize: "14px",
  backgroundColor: PAGE_BG,
  color: PRIMARY,
  boxSizing: "border-box",
  outline: "none",
};

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered"];

const STATUS_COLORS = {
  pending:   { bg: "#fef9c3", color: "#854d0e" },
  paid:      { bg: "#dcfce7", color: "#166534" },
  shipped:   { bg: "#dbeafe", color: "#1d4ed8" },
  delivered: { bg: "#f3f4f6", color: "#374151" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [filter, setFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [shippingModal, setShippingModal] = useState({
    show: false,
    orderId: null,
    trackingNumber: "",
    carrier: "",
  });

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      } else if (error) {
        console.error("Session error:", error);
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "shipped") {
      setShippingModal({
        show: true,
        orderId,
        trackingNumber: "",
        carrier: "",
      });
      return;
    }

    await updateOrderStatus(orderId, newStatus, null, null);
  };

  const handleShippingSubmit = async () => {
    await updateOrderStatus(
      shippingModal.orderId,
      "shipped",
      shippingModal.trackingNumber,
      shippingModal.carrier,
    );
    setShippingModal({
      show: false,
      orderId: null,
      trackingNumber: "",
      carrier: "",
    });
  };

  const updateOrderStatus = async (
    orderId,
    newStatus,
    trackingNumber,
    carrier,
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          trackingNumber,
          carrier,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedOrder = await res.json();
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", backgroundColor: PAGE_BG }}>
          <p style={{ color: SECONDARY }}>Loading orders...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: PAGE_BG }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: PRIMARY, marginBottom: "32px" }}>
            Order Management
          </h1>

          {/* Filter Buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("")}
              style={{
                padding: "7px 16px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: !filter ? PRIMARY : PAGE_BG,
                color: !filter ? "#fff" : SECONDARY,
                border: !filter ? "none" : `1px solid ${BORDER}`,
              }}
            >
              All ({orders.length})
            </button>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  backgroundColor: filter === status ? PRIMARY : PAGE_BG,
                  color: filter === status ? "#fff" : SECONDARY,
                  border: filter === status ? "none" : `1px solid ${BORDER}`,
                }}
              >
                {status} ({orders.filter((o) => o.status === status).length})
              </button>
            ))}
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div style={{
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              padding: "48px",
              textAlign: "center",
              color: SECONDARY,
              fontSize: "14px",
            }}>
              No orders found.
            </div>
          ) : (
            <div style={{
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${BORDER}`, backgroundColor: PAGE_BG }}>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Order ID</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                      <th style={{ textAlign: "right", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</th>
                      <th style={{ textAlign: "center", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const statusColor = STATUS_COLORS[order.status] || { bg: "#f3f4f6", color: "#374151" };
                      return (
                        <tr key={order.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                          <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: "13px", color: SECONDARY }}>
                            {order.id.slice(0, 8)}
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: "14px", color: PRIMARY }}>{order.email}</td>
                          <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 600, fontSize: "14px", color: PRIMARY }}>
                            ${order.total_amount.toFixed(2)}
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              disabled={updatingId === order.id}
                              style={{
                                padding: "5px 10px",
                                borderRadius: "5px",
                                border: `1px solid ${BORDER}`,
                                backgroundColor: statusColor.bg,
                                color: statusColor.color,
                                fontSize: "13px",
                                fontWeight: 600,
                                textTransform: "capitalize",
                                cursor: "pointer",
                                outline: "none",
                              }}
                            >
                              {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: "13px", color: SECONDARY }}>
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "14px 20px", textAlign: "center" }}>
                            <Link
                              href={`/account/orders/${order.id}`}
                              target="_blank"
                              style={{ color: "#2563eb", fontSize: "13px", fontWeight: 500 }}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Shipping Modal */}
      {shippingModal.show && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "24px",
        }}>
          <div style={{
            backgroundColor: CARD_BG,
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "440px",
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: PRIMARY, marginBottom: "24px" }}>
              Add Tracking Info
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: SECONDARY, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Tracking Number
              </label>
              <input
                type="text"
                value={shippingModal.trackingNumber}
                onChange={(e) => setShippingModal({ ...shippingModal, trackingNumber: e.target.value })}
                placeholder="e.g., 1Z999AA10123456784"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: SECONDARY, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Carrier
              </label>
              <select
                value={shippingModal.carrier}
                onChange={(e) => setShippingModal({ ...shippingModal, carrier: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select Carrier</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
                <option value="Standard Shipping">Standard Shipping</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShippingModal({ show: false, orderId: null, trackingNumber: "", carrier: "" })}
                style={{
                  flex: 1,
                  padding: "11px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "6px",
                  backgroundColor: "transparent",
                  color: PRIMARY,
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleShippingSubmit}
                style={{
                  flex: 1,
                  padding: "11px",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: PRIMARY,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Send &amp; Update
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [filter, setFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [shippingModal, setShippingModal] = useState({
    show: false,
    orderId: null,
    trackingNumber: "",
    carrier: "",
  });

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      } else if (error) {
        console.error("Session error:", error);
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "shipped") {
      setShippingModal({
        show: true,
        orderId,
        trackingNumber: "",
        carrier: "",
      });
      return;
    }

    await updateOrderStatus(orderId, newStatus, null, null);
  };

  const handleShippingSubmit = async () => {
    await updateOrderStatus(
      shippingModal.orderId,
      "shipped",
      shippingModal.trackingNumber,
      shippingModal.carrier,
    );
    setShippingModal({
      show: false,
      orderId: null,
      trackingNumber: "",
      carrier: "",
    });
  };

  const updateOrderStatus = async (
    orderId,
    newStatus,
    trackingNumber,
    carrier,
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          trackingNumber,
          carrier,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updatedOrder = await res.json();
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Order Management</h1>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter("")}
              className={`px-4 py-2 rounded ${!filter ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              All Orders
            </button>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded capitalize ${filter === status ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                {status} ({orders.filter((o) => o.status === status).length})
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Order ID</th>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-right">Total</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Created</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="border p-3 font-mono text-sm">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="border p-3">{order.email}</td>
                    <td className="border p-3 text-right font-semibold">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="border p-3 capitalize">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        disabled={updatingId === order.id}
                        className="p-1 border rounded capitalize"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-3 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="border p-3">
                      <Link
                        href={`/account/orders/${order.id}`}
                        target="_blank"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-600 py-8">No orders found</p>
          )}
        </div>
      </main>

      {/* Shipping Modal */}
      {shippingModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add Tracking Info</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={shippingModal.trackingNumber}
                onChange={(e) =>
                  setShippingModal({
                    ...shippingModal,
                    trackingNumber: e.target.value,
                  })
                }
                placeholder="e.g., 1Z999AA10123456784"
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">
                Carrier
              </label>
              <select
                value={shippingModal.carrier}
                onChange={(e) =>
                  setShippingModal({
                    ...shippingModal,
                    carrier: e.target.value,
                  })
                }
                className="w-full border rounded p-2"
              >
                <option value="">Select Carrier</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
                <option value="Standard Shipping">Standard Shipping</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setShippingModal({
                    show: false,
                    orderId: null,
                    trackingNumber: "",
                    carrier: "",
                  })
                }
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleShippingSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send & Update
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
