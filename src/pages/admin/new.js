import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/../lib/supabaseClient";
import Link from "next/link";

const PAGE_BG = "#f5f3f0";
const CARD_BG = "#FCFAFA";
const PRIMARY = "#1a1a2e";
const BORDER = "#e0e0e0";
const SECONDARY = "#666666";

const inputStyle = {
  width: "100%",
  border: `1px solid ${BORDER}`,
  borderRadius: "6px",
  padding: "10px 12px",
  fontSize: "14px",
  backgroundColor: PAGE_BG,
  color: PRIMARY,
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: SECONDARY,
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

function NewPost() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    date: "",
    record_label: "",
    release_date: "",
    content: "",
    music_link: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("posts").insert([
      {
        ...formData,
        date: new Date(formData.date).toISOString(),
        release_date: formData.release_date
          ? new Date(formData.release_date).toISOString()
          : null,
      },
    ]);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
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
        <Link
          href="/admin"
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          ← Dashboard
        </Link>
      </div>

      <div
        style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 24px" }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: PRIMARY,
            marginBottom: "28px",
          }}
        >
          New Post
        </h1>

        <div
          style={{
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: "12px",
            padding: "32px",
          }}
        >
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

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Post title"
                style={inputStyle}
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Image Path</label>
              <input
                type="text"
                name="image"
                placeholder="/images/yourfile.jpg"
                style={inputStyle}
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Publish Date *</label>
              <input
                type="date"
                name="date"
                style={inputStyle}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Record Label</label>
              <input
                type="text"
                name="record_label"
                placeholder="Record Label"
                style={inputStyle}
                value={formData.record_label}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Release Date</label>
              <input
                type="date"
                name="release_date"
                style={inputStyle}
                value={formData.release_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Content *</label>
              <textarea
                name="content"
                placeholder="Content (HTML or Markdown)"
                style={{
                  ...inputStyle,
                  minHeight: "140px",
                  resize: "vertical",
                }}
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Music Link</label>
              <input
                type="text"
                name="music_link"
                placeholder="https://soundcloud.com/..."
                style={inputStyle}
                value={formData.music_link}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: PRIMARY,
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
              <Link href="/admin" style={{ textDecoration: "none", flex: 1 }}>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: PRIMARY,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminNewPage() {
  return (
    <ProtectedRoute>
      <NewPost />
    </ProtectedRoute>
  );
}
