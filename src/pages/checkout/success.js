import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Success() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">✓ Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-4">
            Thank you for your purchase. You'll receive an email confirmation shortly.
          </p>
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