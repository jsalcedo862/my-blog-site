import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/router";
import { FiSearch, FiShoppingCart, FiSliders } from "react-icons/fi";

const GENRES = [
  { label: "House", value: "House" },
  { label: "Techno", value: "Techno" },
  { label: "Tech House", value: "Tech House" },
  { label: "Drum & Bass", value: "Drum & Bass" },
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileSearchOpen(false);
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#FCFAFA",
        position: "sticky",
        top: 0,
        zIndex: 50,
        color: "black",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* ── DESKTOP NAV ── */}
      <div
        className="hidden sm:block"
        style={{ padding: "16px 40px 16px 16px" }}
      >
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
              src="/images/Crop3kLogoWhite.jpg"
              alt="3K Records Logo"
              width={60}
              height={60}
              style={{ height: "60px", width: "auto", borderRadius: "4px" }}
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
              style={{ color: "black", fontSize: "14px" }}
            >
              Account
            </Link>
            <Link href="/login" style={{ color: "black", fontSize: "14px" }}>
              Login
            </Link>
            <Link
              href="/cart"
              style={{ position: "relative", color: "black", fontSize: "14px" }}
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

        {/* Desktop Genre Links */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "14px",
            overflowX: "auto",
            justifyContent: "center",
          }}
        >
          <Link href="/shop" style={{ color: "black", whiteSpace: "nowrap" }}>
            All
          </Link>
          {GENRES.map((genre) => (
            <Link
              key={genre.label}
              href={`/shop?genre=${encodeURIComponent(genre.value)}`}
              style={{ color: "black", whiteSpace: "nowrap" }}
            >
              {genre.label}
            </Link>
          ))}
          {COLLECTIONS.length > 0 && <span style={{ color: "#ccc" }}>|</span>}
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.label}
              href={collection.href}
              style={{ color: "black", whiteSpace: "nowrap" }}
            >
              {collection.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── MOBILE NAV ── */}
      <div className="sm:hidden" style={{ padding: "12px 16px" }}>
        {/* Mobile Top Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/">
            <Image
              src="/images/Crop3kLogoWhite.jpg"
              alt="3K Records Logo"
              width={50}
              height={50}
              style={{ height: "50px", width: "auto", borderRadius: "4px" }}
            />
          </Link>

          {/* Mobile Icons */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setMobileFiltersOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "black",
                cursor: "pointer",
                fontSize: "22px",
                padding: 0,
              }}
            >
              <FiSearch />
            </button>

            <button
              onClick={() => {
                setMobileFiltersOpen(!mobileFiltersOpen);
                setMobileSearchOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "black",
                cursor: "pointer",
                fontSize: "22px",
                padding: 0,
              }}
            >
              <FiSliders />
            </button>

            <Link href="/login" style={{ color: "black", fontSize: "14px" }}>
              Login
            </Link>

            <Link
              href="/cart"
              style={{ position: "relative", color: "black", fontSize: "22px" }}
            >
              <FiShoppingCart />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-8px",
                    backgroundColor: "#1a1a2e",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "bold",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
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

        {/* Mobile Search Dropdown */}
        {mobileSearchOpen && (
          <form
            onSubmit={handleSearch}
            style={{ marginTop: "12px", display: "flex" }}
          >
            <input
              type="text"
              placeholder="Search vinyl..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "4px 0 0 4px",
                backgroundColor: "#f5f3f0",
                color: "#1a1a2e",
                fontSize: "14px",
                outline: "none",
                border: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
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
        )}

        {/* Mobile Filters Dropdown */}
        {mobileFiltersOpen && (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "14px",
            }}
          >
            <Link
              href="/shop"
              onClick={() => setMobileFiltersOpen(false)}
              style={{ color: "black" }}
            >
              All
            </Link>
            {GENRES.map((genre) => (
              <Link
                key={genre.label}
                href={`/shop?genre=${encodeURIComponent(genre.value)}`}
                onClick={() => setMobileFiltersOpen(false)}
                style={{ color: "black" }}
              >
                {genre.label}
              </Link>
            ))}
            {COLLECTIONS.length > 0 && <span style={{ color: "#999" }}>|</span>}
            {COLLECTIONS.map((collection) => (
              <Link
                key={collection.label}
                href={collection.href}
                onClick={() => setMobileFiltersOpen(false)}
                style={{ color: "black" }}
              >
                {collection.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
