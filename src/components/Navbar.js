import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/router";

const GENRES = [
  { label: "House", href: "/shop" },
  { label: "Techno", href: "/shop" },
  { label: "Tech House", href: "/shop" },
  { label: "Drum & Bass", href: "/shop" },
];

const COLLECTIONS = [
  //{ label: "Sale", href: "/shop" },
  //{ label: "Pre-Orders", href: "/shop" },
  //{ label: "Vinyl Only", href: "/shop" },
];

export default function Navbar() {
  const { cart } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#737382",
        position: "sticky",
        top: 0,
        zIndex: 50,
        color: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ padding: "16px 40px 16px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            position: "relative",
          }}
        >
          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/3klogo.jpg"
              alt="3K Records Logo"
              width={40}
              height={40}
              style={{ height: "100px", width: "auto", borderRadius: "4px" }}
            />
          </Link>

          {/* Search Bar - Centered */}
          <form
            onSubmit={handleSearch}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
            }}
          >
            <input
              type="text"
              placeholder="Search vinyl..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "4px 0 0 4px",
                backgroundColor: "#f5f3f0",
                color: "#1a1a2e",
                fontSize: "14px",
                outline: "none",
                width: "256px",
                border: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#1a1a2e",
                color: "white",
                borderRadius: "0 4px 4px 0",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>

          {/* Right Side Links */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <Link
              href="/account/orders"
              style={{ color: "white", fontSize: "14px" }}
            >
              Account
            </Link>
            <Link href="/login" style={{ color: "white", fontSize: "14px" }}>
              Login
            </Link>
            <Link
              href="/cart"
              style={{ position: "relative", color: "white", fontSize: "14px" }}
            >
              Cart
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-12px",
                    backgroundColor: "#1a1a2e",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "bold",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Genre Links */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "14px",
            overflowX: "auto",
            justifyContent: "center",
          }}
        >
          <Link href="/shop" style={{ color: "white", whiteSpace: "nowrap" }}>
            All
          </Link>
          {GENRES.map((genre) => (
            <Link
              key={genre.label}
              href={genre.href}
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              {genre.label}
            </Link>
          ))}
          {COLLECTIONS.length > 0 && <span style={{ color: "#ccc" }}>|</span>}
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.label}
              href={collection.href}
              style={{ color: "white", whiteSpace: "nowrap" }}
            >
              {collection.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
