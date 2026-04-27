import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

function EditPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [recordLabel, setRecordLabel] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [musicLink, setMusicLink] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data);
        setTitle(data.title);
        setDate(data.date);
        setImage(data.image);
        setRecordLabel(data.record_label);
        setReleaseDate(data.release_date);
        setMusicLink(data.music_link);
        setContent(data.content);
      }

      setLoading(false);
    }

    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        date,
        image,
        record_label: recordLabel,
        release_date: releaseDate,
        music_link: musicLink,
        content,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setError("Error updating post: " + error.message);
    } else {
      router.push("/admin");
    }
  };

  const header = (
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
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: PAGE_BG }}>
        {header}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <p style={{ color: SECONDARY }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: PAGE_BG }}>
        {header}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <p style={{ color: "#dc2626" }}>Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: PAGE_BG }}>
      {header}

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
          Edit Post
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
            onSubmit={handleUpdate}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label style={labelStyle}>Title *</label>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Publish Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Image Path</label>
              <input
                type="text"
                placeholder="/images/yourfile.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Record Label</label>
              <input
                type="text"
                placeholder="Record Label"
                value={recordLabel}
                onChange={(e) => setRecordLabel(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Release Date</label>
              <input
                type="date"
                value={releaseDate || ""}
                onChange={(e) => setReleaseDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Music Link</label>
              <input
                type="text"
                placeholder="https://soundcloud.com/..."
                value={musicLink}
                onChange={(e) => setMusicLink(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Content *</label>
              <textarea
                placeholder="Content (HTML or Markdown)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: "200px",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  backgroundColor: PRIMARY,
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
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

export default function EditPostPage() {
  return (
    <ProtectedRoute>
      <EditPost />
    </ProtectedRoute>
  );
}
