import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${BASE_URL}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f3f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FCFAFA",
          borderRadius: "12px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#1a1a2e",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          Reset Password
        </h2>

        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#666666",
                fontSize: "14px",
                lineHeight: "1.6",
                marginBottom: "24px",
              }}
            >
              Check your email for a password reset link. It may take a minute
              to arrive.
            </p>
            <Link
              href="/login"
              style={{
                color: "#1a1a2e",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p
              style={{
                color: "#666666",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div
                style={{
                  backgroundColor: "#fde8e8",
                  border: "1px solid #f5c6c6",
                  color: "#b91c1c",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1a1a2e",
                    marginBottom: "6px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    fontSize: "14px",
                    color: "#1a1a2e",
                    backgroundColor: "#f5f3f0",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "#1a1a2e",
                  color: "#FCFAFA",
                  border: "none",
                  borderRadius: "6px",
                  padding: "13px",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.opacity = "1";
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "#666666",
                marginTop: "24px",
              }}
            >
              <Link
                href="/login"
                style={{
                  color: "#1a1a2e",
                  fontWeight: 700,
                  textDecoration: "underline",
                }}
              >
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
