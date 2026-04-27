import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();
  const { search, genre } = router.query;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (genre) {
      result = result.filter(
        (p) => p.genre?.toLowerCase() === genre.toLowerCase(),
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.artist?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [products, genre, search]);

  const clearFilter = (key) => {
    const query = { ...router.query };
    delete query[key];
    router.push({ pathname: "/shop", query });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl">Loading products...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen"
        style={{ backgroundColor: "#f5f3f0", padding: "48px 48px 64px 48px" }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h1 className="text-3xl font-bold" style={{ color: "#1a1a2e" }}>
            Shop
          </h1>
          <span style={{ fontSize: "14px", color: "#666666" }}>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "record" : "records"}
          </span>
        </div>

        {/* Active filter badges */}
        {(genre || search) && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            {genre && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#1a1a2e",
                  color: "#FCFAFA",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {genre}
                <button
                  onClick={() => clearFilter("genre")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FCFAFA",
                    cursor: "pointer",
                    fontSize: "16px",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </span>
            )}
            {search && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#1a1a2e",
                  color: "#FCFAFA",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                &ldquo;{search}&rdquo;
                <button
                  onClick={() => clearFilter("search")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FCFAFA",
                    cursor: "pointer",
                    fontSize: "16px",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: "64px" }}>
            <p
              style={{
                fontSize: "18px",
                color: "#666666",
                marginBottom: "16px",
              }}
            >
              No records found
              {genre ? ` in "${genre}"` : ""}
              {search ? ` for "${search}"` : ""}.
            </p>
            <Link
              href="/shop"
              style={{
                color: "#1a1a2e",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              View all records
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: "#FCFAFA",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.16)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.08)")
                }
              >
                <Link href={`/shop/${product.id}`}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1/1",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "40px",
                      }}
                    >
                      💿
                    </div>
                  )}
                </Link>
                <div style={{ padding: "16px" }}>
                  <Link
                    href={`/shop/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h2
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                        marginBottom: "4px",
                        lineHeight: "1.3",
                      }}
                    >
                      {product.title}
                    </h2>
                  </Link>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666666",
                      marginBottom: "8px",
                    }}
                  >
                    {product.artist}
                  </p>
                  {product.genre && (
                    <button
                      onClick={() =>
                        router.push(
                          `/shop?genre=${encodeURIComponent(product.genre)}`,
                        )
                      }
                      style={{
                        fontSize: "11px",
                        color: "#666666",
                        backgroundColor: "#f0eeec",
                        border: "none",
                        borderRadius: "12px",
                        padding: "2px 8px",
                        marginBottom: "12px",
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                    >
                      {product.genre}
                    </button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a1a2e",
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        backgroundColor: "#1a1a2e",
                        color: "#FCFAFA",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.8")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
