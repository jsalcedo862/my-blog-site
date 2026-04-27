import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/../lib/supabaseClient";
import Link from "next/link";

const PAGE_BG = "#f5f3f0";
const CARD_BG = "#FCFAFA";
const PRIMARY = "#1a1a2e";
const BORDER = "#e0e0e0";
const SECONDARY = "#666666";

function AdminDashboardContent() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) {
        alert("Error deleting post: " + error.message);
      } else {
        setPosts(posts.filter((post) => post.id !== id));
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: PAGE_BG }}>
      {/* Admin Header */}
      <div
        style={{
          backgroundColor: PRIMARY,
          color: "#fff",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span style={{ fontWeight: 700, fontSize: "18px" }}>3K Records</span>
          <span style={{ color: "rgba(255,255,255,0.4)", margin: "0 10px" }}>
            |
          </span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
            Admin
          </span>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: PRIMARY,
            marginBottom: "32px",
          }}
        >
          Dashboard
        </h1>

        {/* Shop Management */}
        <div
          style={{
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "28px",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: PRIMARY,
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Shop Management
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <Link href="/admin/products" style={{ textDecoration: "none" }}>
              <div
                style={{
                  backgroundColor: PRIMARY,
                  color: "#fff",
                  padding: "14px 18px",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                📦 Manage Products
              </div>
            </Link>
            <Link href="/admin/orders" style={{ textDecoration: "none" }}>
              <div
                style={{
                  backgroundColor: CARD_BG,
                  color: PRIMARY,
                  border: `1px solid ${BORDER}`,
                  padding: "14px 18px",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                📋 Manage Orders
              </div>
            </Link>
          </div>
        </div>

        {/* Blog Posts */}
        <div
          style={{
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: PRIMARY,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Blog Posts
            </h2>
            <Link href="/admin/new" style={{ textDecoration: "none" }}>
              <span
                style={{
                  backgroundColor: PRIMARY,
                  color: "#fff",
                  padding: "7px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                + New Post
              </span>
            </Link>
          </div>

          {posts.length === 0 ? (
            <p
              style={{
                color: SECONDARY,
                textAlign: "center",
                padding: "24px 0",
                fontSize: "14px",
              }}
            >
              No posts yet.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: PAGE_BG,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "8px",
                    padding: "14px 18px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        color: PRIMARY,
                        marginBottom: "2px",
                        fontSize: "15px",
                      }}
                    >
                      {post.title}
                    </p>
                    <p style={{ fontSize: "13px", color: SECONDARY }}>
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href={`/admin/edit/${post.id}`}
                      style={{
                        color: "#2563eb",
                        fontSize: "14px",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        fontSize: "14px",
                        cursor: "pointer",
                        padding: 0,
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
