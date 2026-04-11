import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabaseClient } from '../../../lib/supabaseClient';

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [filter, setFilter] = useState('');

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

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update');
      
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (err) {
      alert('Failed to update order status');
      console.error(err);
    }
  };

  const filteredOrders = filter
    ? orders.filter(o => o.status === filter)
    : orders;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading orders...</p>
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
          <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded font-bold ${!filter ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              All Orders
            </button>
            {ORDER_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded font-bold capitalize ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-bold">{order.id.substring(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-bold">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                    <p className="bg-gray-100 p-2 rounded text-sm">{order.shipping_address}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <label className="block text-sm font-bold mb-1">Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="border rounded px-3 py-1"
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
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