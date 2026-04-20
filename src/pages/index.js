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
        <div
          style={{ padding: "48px 48px 64px 48px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2 className="text-3xl font-bold" style={{ color: "#1a1a2e" }}>
              Recently Added
            </h2>
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                backgroundColor: "#1a1a2e",
                color: "#FCFAFA",
                padding: "10px 24px",
                borderRadius: "4px",
                fontWeight: "600",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#666666]">Loading...</p>
            </div>
          ) : recentProducts.length === 0 ? (
            <p className="text-[#666666] text-center">No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
