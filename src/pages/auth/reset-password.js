import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase sets the session from the URL hash automatically.
    // We poll briefly to confirm the session is active before allowing the form.
    let attempts = 0;
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSessionReady(true);
      } else if (attempts < 5) {
        attempts++;
        setTimeout(check, 600);
      } else {
        setError(
          "This reset link is invalid or has expired. Please request a new one.",
        );
      }
    };
    check();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      // Sign out so user logs in fresh with new password
      await supabase.auth.signOut();
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
          Set New Password
        </h2>

        {done ? (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#166534",
                backgroundColor: "#dcfce7",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Password updated! You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                backgroundColor: "#1a1a2e",
                color: "#FCFAFA",
                borderRadius: "6px",
                padding: "11px 28px",
                fontWeight: "700",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </div>
        ) : error && !sessionReady ? (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#b91c1c",
                backgroundColor: "#fde8e8",
                border: "1px solid #f5c6c6",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              {error}
            </p>
            <Link
              href="/forgot-password"
              style={{
                color: "#1a1a2e",
                fontWeight: 700,
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              Request a new link
            </Link>
          </div>
        ) : !sessionReady ? (
          <p
            style={{ textAlign: "center", color: "#666666", fontSize: "14px" }}
          >
            Verifying link...
          </p>
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

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1a1a2e",
                    marginBottom: "6px",
                  }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#1a1a2e",
                    marginBottom: "6px",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
