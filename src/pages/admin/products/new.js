import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabaseClient } from "../../../../lib/supabaseClient";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  // Get token on mount
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();
      if (session?.access_token) {
        setToken(session.access_token);
      }
    };

    getSession();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const currentToken = token; // ← Use the state variable
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create product");

      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const PAGE_BG = "#f5f3f0";
  const CARD_BG = "#FCFAFA";
  const PRIMARY = "#1a1a2e";
  const BORDER = "#e0e0e0";

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: PAGE_BG,
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: PRIMARY,
              marginBottom: "28px",
            }}
          >
            Create New Product
          </h1>

          {error && (
            <div
              style={{
                backgroundColor: "#fde8e8",
                color: "#b91c1c",
                padding: "12px 16px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <ProductForm onSubmit={handleSubmit} loading={loading} />
          </div>

          <div style={{ marginTop: "24px" }}>
            <Link
              href="/admin/products"
              style={{
                color: PRIMARY,
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
