import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Check auth state on mount
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
    });
  }, []);

  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp
