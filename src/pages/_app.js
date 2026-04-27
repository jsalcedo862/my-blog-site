import "@/styles/globals.css";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // If Supabase redirects back with auth tokens in the hash, forward to /auth/confirm
    if (
      typeof window !== "undefined" &&
      window.location.hash.includes("access_token")
    ) {
      router.replace("/auth/confirm");
      return;
    }

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("Auth state changed:", event, session?.user?.email);
      }
    });
  }, []);

  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp;
