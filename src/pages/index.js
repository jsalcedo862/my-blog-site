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
        <div style={{ padding: "48px 48px 64px 48px" }}>
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
            <>
              <style>{`
                @keyframes shimmer {
                  0% { background-position: -400px 0; }
                  100% { background-position: 400px 0; }
                }
                .skeleton-shimmer {
                  background: linear-gradient(90deg, #ece9e4 25%, #f5f3f0 50%, #ece9e4 75%);
                  background-size: 800px 100%;
                  animation: shimmer 1.4s infinite linear;
                }
              `}</style>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#FCFAFA",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      overflow: "hidden",
                    }}
                  >
                    {/* Image placeholder */}
                    <div
                      className="skeleton-shimmer"
                      style={{ height: "200px", width: "100%" }}
                    />
                    <div style={{ padding: "16px" }}>
                      {/* Title */}
                      <div
                        className="skeleton-shimmer"
                        style={{
                          height: "16px",
                          borderRadius: "4px",
                          marginBottom: "8px",
                          width: "70%",
                        }}
                      />
                      {/* Artist */}
                      <div
                        className="skeleton-shimmer"
                        style={{
                          height: "13px",
                          borderRadius: "4px",
                          marginBottom: "12px",
                          width: "50%",
                        }}
                      />
                      {/* Price */}
                      <div
                        className="skeleton-shimmer"
                        style={{
                          height: "18px",
                          borderRadius: "4px",
                          width: "30%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
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
