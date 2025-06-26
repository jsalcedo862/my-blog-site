import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white px-4 py-3 shadow-md sticky top-0 z-10">
      <ul className="flex gap-6 text-lg font-medium">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/spotlight">Spotlight</Link></li>
      </ul>
    </nav>
  );
}
