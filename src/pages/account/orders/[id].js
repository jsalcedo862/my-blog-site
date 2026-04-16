import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseClient } from "../../../../lib/supabaseClient";

const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered"];
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      } else {
        router.push("/login");
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    if (!token || !id) return;

    const fetchOrder = async () => {
      console.log("Fetching order with ID:", id); // Add this line
      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("API error response:", errorData);
          setError(errorData.error || "Failed to fetch order");
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token, id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/account/orders"
            className="text-blue-600 hover:underline mb-6 block"
          >
            ← Back to Orders
          </Link>

          <div className="border rounded-lg p-6">
            {/* Order Header */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <h1 className="text-2xl font-bold">
                    ${order.total_amount.toFixed(2)}
                  </h1>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${STATUS_COLORS[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Order Items */}
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Items</h2>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{item.products?.title}</p>
                      <p className="text-sm text-gray-600">
                        {item.products?.artist}
                      </p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price_at_purchase * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <p className="whitespace-pre-line text-gray-700">
                {order.shipping_address}
              </p>
            </div>

            {/* Order Status Timeline */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Status Timeline</h2>
              <div className="space-y-2">
                {ORDER_STATUSES.map((status, idx) => (
                  <div key={status} className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${ORDER_STATUSES.indexOf(order.status) >= idx ? "bg-blue-600" : "bg-gray-300"}`}
                    ></div>
                    <span className="capitalize">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
