import { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";
import { useStripe } from "@/context/StripeContext";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect } from "react";
import { supabaseClient } from "@/../lib/supabaseClient";

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotalPrice } = useCart();
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState(""); // Add this

  // Add this useEffect to get auth token
  useEffect(() => {
    const getToken = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      }
    };
    getToken();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create checkout session WITH auth token
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }), // Add auth token if available
        },
        body: JSON.stringify({
          items: cart,
          email,
          shipping_address: shippingAddress,
        }),
      });

      const data = await res.json();
      console.log("Checkout response:", data);

      if (!res.ok) {
        throw new Error(
          data.details || data.error || "Failed to create checkout session",
        );
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL provided");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f3f0' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '48px 48px 64px 48px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e', marginBottom: '32px' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Checkout form */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' }}>
              Shipping & Payment
            </h2>
            <form onSubmit={handleCheckout}>
              {error && (
                <div
                  style={{
                    backgroundColor: '#fde8e8',
                    border: '1px solid #f5c6c6',
                    color: '#b91c1c',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    marginBottom: '16px',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: '#1a1a2e',
                    backgroundColor: '#FCFAFA',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '6px' }}>
                  Shipping Address
                </label>
                <textarea
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="123 Main St, City, State 12345"
                  rows={3}
                  style={{
                    width: '100%',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    color: '#1a1a2e',
                    backgroundColor: '#FCFAFA',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <p style={{ fontSize: '13px', color: '#666666', marginBottom: '16px' }}>
                You&apos;ll be redirected to Stripe to complete payment securely.
              </p>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#1a1a2e',
                  color: '#FCFAFA',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '13px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  marginBottom: '10px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = '1'; }}
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>

              <Link href="/cart" style={{ display: 'block', textDecoration: 'none' }}>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: '#1a1a2e',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0eeec')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  ← Back to Cart
                </button>
              </Link>
            </form>
          </div>

          {/* Order summary */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px' }}>
              Order Summary
            </h2>
            <div
              style={{
                backgroundColor: '#FCFAFA',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px', marginBottom: '2px' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '13px', color: '#666666' }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>Total</span>
                <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '16px' }}>
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
