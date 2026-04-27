import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

const inputStyle = {
  width: "100%",
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  padding: "10px 12px",
  fontSize: "14px",
  color: "#1a1a2e",
  backgroundColor: "#f5f3f0",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#1a1a2e",
  marginBottom: "6px",
};

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
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
            marginBottom: "28px",
          }}
        >
          Create Account
        </h2>

        {success ? (
          <div
            style={{
              backgroundColor: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              borderRadius: "6px",
              padding: "16px",
              fontSize: "14px",
              textAlign: "center",
              lineHeight: "1.6",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: "6px" }}>
              Almost there!
            </p>
            <p>
              Check your email and click the confirmation link to activate your
              account.
            </p>
          </div>
        ) : (
          <>
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

            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
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
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.opacity = "1";
                }}
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          </>
        )}

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#666666",
            marginTop: "24px",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#1a1a2e",
              fontWeight: 700,
              textDecoration: "underline",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
