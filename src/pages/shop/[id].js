import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-xl mb-4">Product not found</p>
          <Link href="/shop">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Back to Shop
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
          <Link href="/shop">
            <button className="text-blue-600 hover:underline mb-6">← Back to Shop</button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.image_url && (
              <div>
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{product.artist}</p>

              <div className="mb-6">
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stock_quantity}
                </p>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Description</h2>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {product.genre && (
                <p className="text-sm text-gray-600 mb-2">Genre: {product.genre}</p>
              )}
              {product.format && (
                <p className="text-sm text-gray-600 mb-4">Format: {product.format}</p>
              )}
              {product.release_date && (
                <p className="text-sm text-gray-600 mb-6">
                  Release Date: {new Date(product.release_date).toLocaleDateString()}
                </p>
              )}
              {product.condition && (
                <p className="text-sm text-gray-600 mb-6">Condition: <span className="font-bold">{product.condition}</span></p>
              )}

              <div className="flex gap-4 items-center mb-6">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center border-l border-r py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}