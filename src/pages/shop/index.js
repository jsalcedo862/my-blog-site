import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl">Loading products...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Vinyl Records Store</h1>
          
          {products.length === 0 ? (
            <p className="text-xl text-gray-600">No products available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-1">{product.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">{product.artist}</p>
                    <p className="text-lg font-bold text-blue-600 mb-2">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Stock: {product.stock_quantity}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/shop/${product.id}`}>
                        <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded transition">
                          View Details
                        </button>
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}