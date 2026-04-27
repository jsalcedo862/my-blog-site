import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRef } from 'react';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(null);
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
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f3f0' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '18px', color: '#666666' }}>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f3f0' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <p style={{ fontSize: '18px', color: '#666666' }}>Product not found.</p>
          <Link href="/shop" style={{ color: '#1a1a2e', fontWeight: '600', textDecoration: 'underline' }}>
            ← Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f3f0' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '48px 48px 64px 48px' }}>
        {/* Back link */}
        <Link
          href="/shop"
          style={{ fontSize: '14px', color: '#666666', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}
        >
          ← Back to Shop
        </Link>

        {/* Added to cart banner */}
        {added && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              backgroundColor: '#1a1a2e',
              color: '#FCFAFA',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          >
            Added to cart ✓
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                }}
              >
                💿
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px', lineHeight: '1.2' }}>
              {product.title}
            </h1>
            <p style={{ fontSize: '16px', color: '#666666', marginBottom: '24px' }}>{product.artist}</p>

            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '24px' }}>
              ${product.price.toFixed(2)}
            </p>

            {/* Meta tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {product.genre && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#666666',
                    backgroundColor: '#f0eeec',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '3px 10px',
                  }}
                >
                  {product.genre}
                </span>
              )}
              {product.format && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#666666',
                    backgroundColor: '#f0eeec',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '3px 10px',
                  }}
                >
                  {product.format}
                </span>
              )}
              {product.condition && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#1a1a2e',
                    backgroundColor: '#e8f4e8',
                    border: '1px solid #c0d8c0',
                    borderRadius: '12px',
                    padding: '3px 10px',
                    fontWeight: '600',
                  }}
                >
                  {product.condition}
                </span>
              )}
            </div>

            {product.release_date && (
              <p style={{ fontSize: '13px', color: '#666666', marginBottom: '16px' }}>
                Released: {new Date(product.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}

            {product.description && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6' }}>{product.description}</p>
              </div>
            )}

            {/* Quantity stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: '#666666', fontWeight: '500' }}>Qty</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#FCFAFA',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#1a1a2e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    width: '40px',
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1a1a2e',
                    borderLeft: '1px solid #e0e0e0',
                    borderRight: '1px solid #e0e0e0',
                    lineHeight: '36px',
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#1a1a2e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>
              <span style={{ fontSize: '13px', color: '#999999' }}>
                {product.stock_quantity} in stock
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                backgroundColor: '#1a1a2e',
                color: '#FCFAFA',
                border: 'none',
                borderRadius: '6px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}