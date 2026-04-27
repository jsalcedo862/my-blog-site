import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabaseClient } from "../../../../lib/supabaseClient";

const PAGE_BG = "#f5f3f0";
const CARD_BG = "#FCFAFA";
const PRIMARY = "#1a1a2e";
const BORDER = "#e0e0e0";
const SECONDARY = "#666666";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      } else {
        router.push("/login");
      }
    };

    getSession();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(
            `Error ${res.status}: ${body.error || "Failed to load products"}`,
          );
          return;
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Network error â€” could not reach the server");
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(`Failed to delete product: ${body.error || res.status}`);
        return;
      }
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", backgroundColor: PAGE_BG }}>
          <p style={{ color: SECONDARY }}>Loading products...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", backgroundColor: PAGE_BG, padding: "48px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 700, color: PRIMARY }}>Manage Products</h1>
            <Link href="/admin/products/new" style={{ textDecoration: "none" }}>
              <span style={{
                backgroundColor: PRIMARY,
                color: "#fff",
                padding: "8px 18px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
              }}>
                + New Product
              </span>
            </Link>
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fde8e8",
              color: "#b91c1c",
              padding: "12px 16px",
              borderRadius: "6px",
              marginBottom: "24px",
              fontSize: "14px",
            }}>
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div style={{
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              padding: "48px",
              textAlign: "center",
              color: SECONDARY,
            }}>
              No products yet.
            </div>
          ) : (
            <div style={{
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${BORDER}`, backgroundColor: PAGE_BG }}>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Title</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Artist</th>
                      <th style={{ textAlign: "center", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</th>
                      <th style={{ textAlign: "center", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Stock</th>
                      <th style={{ textAlign: "center", padding: "12px 20px", fontSize: "12px", fontWeight: 600, color: SECONDARY, textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: "14px 20px", fontSize: "14px", color: PRIMARY, fontWeight: 500 }}>{product.title}</td>
                        <td style={{ padding: "14px 20px", fontSize: "14px", color: SECONDARY }}>{product.artist}</td>
                        <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "14px", fontWeight: 600, color: PRIMARY }}>${product.price.toFixed(2)}</td>
                        <td style={{ padding: "14px 20px", textAlign: "center", fontSize: "14px", color: SECONDARY }}>{product.stock_quantity}</td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <Link href={`/admin/products/edit/${product.id}`} style={{ textDecoration: "none" }}>
                              <span style={{
                                display: "inline-block",
                                backgroundColor: PAGE_BG,
                                border: `1px solid ${BORDER}`,
                                color: PRIMARY,
                                padding: "5px 12px",
                                borderRadius: "5px",
                                fontSize: "13px",
                                fontWeight: 500,
                                cursor: "pointer",
                              }}>
                                Edit
                              </span>
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid #fca5a5",
                                color: "#dc2626",
                                padding: "5px 12px",
                                borderRadius: "5px",
                                fontSize: "13px",
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
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
            </div>
          )}

          <div style={{ marginTop: "28px" }}>
            <Link href="/admin" style={{ color: PRIMARY, fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>
              â† Back to Admin
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

