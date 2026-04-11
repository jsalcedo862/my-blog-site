import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductForm from '@/components/ProductForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabaseClient } from '../../lib/supabaseClient';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  // Get token on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      }
    };

    getSession();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const currentToken = token;  // ← Use the state variable
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create product');
      
      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Create New Product</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <ProductForm onSubmit={handleSubmit} loading={loading} />

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