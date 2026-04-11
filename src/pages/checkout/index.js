import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { useStripe } from '@/context/StripeContext';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotalPrice } = useCart();
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-2xl mb-4">Your cart is empty</p>
          <Link href="/shop">
            <button className="bg-blue-600 text-white px-6 py-2 rounded">
              Continue Shopping
            </button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create checkout session
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email,
        }),
      });

      const data = await res.json();
      console.log('Checkout response:', data);

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL provided');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between mb-3 pb-3 border-b">
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between text-xl font-bold pt-4">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="order-1 md:order-2">
              <h2 className="text-2xl font-bold mb-4">Shipping & Payment</h2>
              <form onSubmit={handleCheckout}>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2">Shipping Address</label>
                  <textarea
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="123 Main St, City, State 12345"
                    rows={3}
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  You'll be redirected to Stripe to complete payment using your credit card.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>

                <Link href="/cart">
                  <button
                    type="button"
                    className="w-full bg-gray-200 hover:bg-gray-300 text-black py-3 rounded-lg font-bold transition mt-2"
                  >
                    Back to Cart
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}