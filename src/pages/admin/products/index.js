import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabaseClient } from '../../../lib/supabaseClient';


export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      } else if (error) {
        console.error('Session error:', error);
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading products...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Manage Products</h1>
            <Link href="/admin/products/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold">
                + New Product
              </button>
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-600">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 bg-gray-100">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Artist</th>
                    <th className="text-center py-3 px-4">Price</th>
                    <th className="text-center py-3 px-4">Stock</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{product.title}</td>
                      <td className="py-3 px-4">{product.artist}</td>
                      <td className="text-center py-3 px-4">${product.price.toFixed(2)}</td>
                      <td className="text-center py-3 px-4">{product.stock_quantity}</td>
                      <td className="text-center py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8">
            <Link href="/admin">
              <button className="text-blue-600 hover:underline">← Back to Admin</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}