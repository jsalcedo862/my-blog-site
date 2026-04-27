import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { supabaseClient } from "../../../../../lib/supabaseClient";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
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
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update product");

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
  const SECONDARY = "#666666";

  if (fetchLoading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            backgroundColor: PAGE_BG,
          }}
        >
          <p style={{ color: SECONDARY }}>Loading product...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !product) {
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
            <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
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
        <Footer />
      </>
    );
  }

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
            Edit Product
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
            {product && (
              <ProductForm
                product={product}
                onSubmit={handleSubmit}
                loading={loading}
              />
            )}
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
