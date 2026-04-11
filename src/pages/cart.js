import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-3">Product</th>
                  <th className="text-center py-3">Price</th>
                  <th className="text-center py-3">Quantity</th>
                  <th className="text-right py-3">Total</th>
                  <th className="text-center py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">
                      <div>
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.artist}</p>
                      </div>
                    </td>
                    <td className="text-center py-4">${item.price.toFixed(2)}</td>
                    <td className="text-center py-4">
                      <div className="flex justify-center items-center gap-2 border rounded w-fit mx-auto">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-right py-4 font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-center py-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 pb-4 border-b">
                  <span>Shipping:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-col-reverse md:flex-row justify-between">
            <Link href="/shop">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-3 rounded font-bold transition">
                Continue Shopping
              </button>
            </Link>
            <Link href="/checkout">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}