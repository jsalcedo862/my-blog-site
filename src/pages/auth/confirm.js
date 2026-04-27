import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";

export default function AuthConfirm() {
  const router = useRouter();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    // Supabase automatically processes the hash tokens on page load.
    // We just need to check if a session was established.
    const check = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        setStatus("success");
      } else if (error) {
        setStatus("error");
      } else {
        // Give the client a moment to process the hash
        setTimeout(async () => {
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();
          setStatus(retrySession ? "success" : "error");
        }, 1000);
      }
    };

    check();
  }, []);

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
          textAlign: "center",
        }}
      >
        {status === "verifying" && (
          <>
            <p style={{ fontSize: "16px", color: "#666666" }}>
              Verifying your email…
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "#1a1a2e",
                marginBottom: "12px",
              }}
            >
              Email Confirmed!
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#666666",
                marginBottom: "28px",
              }}
            >
              Your account is active. Welcome to 3K Records.
            </p>
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                backgroundColor: "#1a1a2e",
                color: "#FCFAFA",
                borderRadius: "6px",
                padding: "13px 32px",
                fontSize: "15px",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Browse the Shop
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "#1a1a2e",
                marginBottom: "12px",
              }}
            >
              Link Expired
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#666666",
                marginBottom: "28px",
              }}
            >
              This confirmation link has expired or already been used. Please
              sign up again or contact support.
            </p>
            <Link
              href="/signup"
              style={{
                display: "inline-block",
                backgroundColor: "#1a1a2e",
                color: "#FCFAFA",
                borderRadius: "6px",
                padding: "13px 32px",
                fontSize: "15px",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Back to Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
