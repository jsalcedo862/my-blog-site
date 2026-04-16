import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "../../context/CartContext";

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [emailStatus, setEmailStatus] = useState(null); // 'success', 'failed', or null
  const { clearCart } = useCart();

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (!session_id) return;

      try {
        // Query the order by stripe_session_id
        const ordersRes = await fetch(
          `/api/orders-by-session?session_id=${session_id}`,
        );
        const orderData = await ordersRes.json();

        if (orderData.order) {
          // Send confirmation email
          const emailRes = await fetch("/api/send-order-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: orderData.order.id }),
          });

          // Check if email send was successful
          if (emailRes.ok) {
            setEmailStatus("success");
            clearCart();
          } else {
            console.error("Email send failed:", await emailRes.json());
            setEmailStatus("failed");
          }
        }
      } catch (err) {
        console.error("Failed to send confirmation email:", err);
        setEmailStatus("failed");
      }
    };

    sendConfirmationEmail();
  }, [session_id]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            ✓ Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Thank you for your purchase. You'll receive an email confirmation
            shortly.
          </p>
          {emailStatus === "failed" && (
            <p className="text-sm text-red-600 mb-4 font-semibold">
              ⚠️ We had trouble sending your confirmation email. Please check
              your email or contact support.
            </p>
          )}
          <p className="text-sm text-gray-500 mb-8">
            Order details have been sent to your email address.
          </p>
          <Link href="/shop">
            <button className="bg-blue-600 text-white px-6 py-3 rounded font-bold">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
