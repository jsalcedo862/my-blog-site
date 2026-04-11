import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductForm from '@/components/ProductForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('supabase_token');
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update product');
      
      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-red-600">{error}</p>
            <Link href="/admin/products">
              <button className="text-blue-600 hover:underline mt-4">← Back to Products</button>
            </Link>
          </div>
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
          <h1 className="text-4xl font-bold mb-8">Edit Product</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {product && <ProductForm product={product} onSubmit={handleSubmit} loading={loading} />}

          <div className="mt-8">
            <Link href="/admin/products">
              <button className="text-blue-600 hover:underline">← Back to Products</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}