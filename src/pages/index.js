import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

const GENRES = [
  { label: "House", value: "house" },
  { label: "Techno", value: "techno" },
  { label: "Ambient", value: "ambient" },
  { label: "Drum & Bass", value: "dnb" },
];

const COLLECTIONS = [
  { label: "Sale", value: "sale" },
  { label: "Pre-Orders", value: "preorder" },
  { label: "Vinyl Only", value: "vinyl" },
];

export default function Home() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 6 most recent products
        const { data: products, error: productError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (productError) throw productError;
        setRecentProducts(products || []);

        // Fetch latest spotlight post
        const { data: posts, error: postError } = await supabase
          .from("posts")
          .select("*")
          .order("date", { ascending: false })
          .limit(1);

        if (postError) throw postError;
        setLatestPost(posts?.[0] || null);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f3f0]">
      <Navbar />

      <main className="flex-grow">
        {/* Filters Section */}
        <div className="bg-white py-12 px-4 border-b border-[#e0e0e0]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-6 text-[#1a1a2e]">
                Browse by Genre
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="px-6 py-2 bg-[#1a1a2e] text-white rounded hover:bg-[#737382] transition font-medium"
                >
                  All
                </Link>
                {GENRES.map((genre) => (
                  <Link
                    key={genre.value}
                    href={`/shop?genre=${genre.value}`}
                    className="px-6 py-2 border-2 border-[#737382] text-[#1a1a2e] rounded hover:bg-[#737382] hover:text-white transition font-medium"
                  >
                    {genre.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6 text-[#1a1a2e]">
                Collections
              </h2>
              <div className="flex flex-wrap gap-3">
                {COLLECTIONS.map((collection) => (
                  <Link
                    key={collection.value}
                    href={`/shop?collection=${collection.value}`}
                    className="px-6 py-2 border-2 border-[#1a1a2e] text-[#1a1a2e] rounded hover:bg-[#1a1a2e] hover:text-white transition font-medium"
                  >
                    {collection.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recently Added Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-[#1a1a2e]">
            Recently Added
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#666666]">Loading...</p>
            </div>
          ) : recentProducts.length === 0 ? (
            <p className="text-[#666666] text-center">No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Link
            href="/shop"
            className="inline-block text-[#737382] hover:text-[#1a1a2e] font-semibold mb-16"
          >
            View All Products →
          </Link>
        </div>

        {/* Spotlight Section */}
        {latestPost && (
          <div className="bg-white py-16 px-4 border-t border-[#e0e0e0]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-[#1a1a2e]">
                Latest From Spotlight
              </h2>
              <div className="bg-[#f5f3f0] rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-[#1a1a2e]">
                  {latestPost.title}
                </h3>
                <p className="text-[#666666] mb-6 line-clamp-3">
                  {latestPost.content}
                </p>
                <Link
                  href="/spotlight"
                  className="inline-block bg-[#737382] text-white px-6 py-2 rounded font-semibold hover:bg-[#1a1a2e] transition"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
