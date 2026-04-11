import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function Home() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 6 most recent products
        const { data: products, error: productError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (productError) throw productError;
        setRecentProducts(products || []);

        // Fetch latest spotlight post
        const { data: posts, error: postError } = await supabase
          .from('posts')
          .select('*')
          .order('date', { ascending: false })
          .limit(1);

        if (postError) throw postError;
        setLatestPost(posts?.[0] || null);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-16">
          <Image
            src="/images/3klogo.jpg"
            alt="3k Records Logo"
            width={800}
            height={400}
            className="w-32 sm:w-48 md:w-60 h-auto rounded"
          />

          <h1 className="text-3xl md:text-4xl font-bold text-center mt-6">
            Electronic Music Hub
          </h1>

          <p className="text-center text-gray-600 mt-4 max-w-2xl">
            Welcome, our shopping capability is in test mode. For now only our Spotlight feature is functional, click below to explore!
          </p>
        </div>

        {/* Recently Added Section - Full Width */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
          
          {loading ? (
            <p>Loading products...</p>
          ) : recentProducts.length === 0 ? (
            <p className="text-gray-600">No products yet</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {recentProducts.map((product) => (
                  <Link key={product.id} href={`/shop/${product.id}`}>
                    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.artist}</p>
                        <p className="text-xs text-gray-500 mb-2">{product.condition}</p>
                        <p className="text-blue-600 font-bold text-lg">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link href="/shop">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold">
                  View Full Shop
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Latest Spotlight Section - Full Width */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Latest From Spotlight</h2>
          
          {loading ? (
            <p>Loading post...</p>
          ) : latestPost ? (
            <Link href={`/posts/${latestPost.id}`}>
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {latestPost.image && (
                    <img
                      src={latestPost.image}
                      alt={latestPost.title}
                      className="w-full h-64 md:h-auto object-cover"
                    />
                  )}
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="font-bold text-2xl mb-2">{latestPost.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(latestPost.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-4">
                      {latestPost.content?.substring(0, 150)}...
                    </p>
                    <span className="text-blue-600 hover:text-blue-700 font-bold inline-block">
                      Read More →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-gray-600">No posts yet</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
