import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-[#000000] px-4 py-3 shadow-md sticky top-0 z-10">
      <ul className="flex gap-6 text-lg font-medium items-center">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/spotlight">Spotlight</Link></li>
        <li><Link href="/shop">Shop</Link></li>
        <li>
          <Link href="/cart" className="relative">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
