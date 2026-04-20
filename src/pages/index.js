import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const [recentProducts, setRecentProducts] = useState([]);
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
      </main>
      <Footer />
    </div>
  );
}
