import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f3f0",
        }}
      >
        <Navbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <p style={{ fontSize: "18px", color: "#666666" }}>
            Your cart is empty.
          </p>
          <Link
            href="/shop"
            style={{
              backgroundColor: "#1a1a2e",
              color: "#FCFAFA",
              padding: "10px 24px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f3f0",
      }}
    >
      <Navbar />
      <div style={{ flex: 1, padding: "48px 48px 64px 48px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#1a1a2e",
            marginBottom: "32px",
          }}
        >
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div style={{ gridColumn: "span 2" }} className="lg:col-span-2">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#FCFAFA",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Image */}
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{
                        width: "72px",
                        height: "72px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                      }}
                    >
                      ðŸ’¿
                    </div>
                  )}

                  {/* Title / artist */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: "700",
                        color: "#1a1a2e",
                        fontSize: "14px",
                        marginBottom: "2px",
                      }}
                    >
                      {item.title}
                    </p>
                    <p style={{ fontSize: "13px", color: "#666666" }}>
                      {item.artist}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#1a1a2e",
                        fontWeight: "600",
                        marginTop: "4px",
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity stepper */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#1a1a2e",
                      }}
                    >
                      {"−"}
                    </button>
                    <span
                      style={{
                        width: "32px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#1a1a2e",
                        borderLeft: "1px solid #e0e0e0",
                        borderRight: "1px solid #e0e0e0",
                        lineHeight: "32px",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        background: "none",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        color: "#1a1a2e",
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <p
                    style={{
                      fontWeight: "700",
                      color: "#1a1a2e",
                      fontSize: "14px",
                      minWidth: "60px",
                      textAlign: "right",
                    }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999999",
                      cursor: "pointer",
                      fontSize: "18px",
                      lineHeight: 1,
                      padding: "4px",
                    }}
                    title="Remove"
                  >
                    {"×"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div
              style={{
                backgroundColor: "#FCFAFA",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                position: "sticky",
                top: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1a1a2e",
                  marginBottom: "20px",
                }}
              >
                Order Summary
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#666666", fontSize: "14px" }}>
                  Subtotal
                </span>
                <span
                  style={{
                    color: "#1a1a2e",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <span style={{ color: "#666666", fontSize: "14px" }}>
                  Shipping
                </span>
                <span style={{ color: "#666666", fontSize: "14px" }}>
                  Calculated at checkout
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <span
                  style={{
                    color: "#1a1a2e",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    color: "#1a1a2e",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                style={{ display: "block", textDecoration: "none" }}
              >
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "#1a1a2e",
                    color: "#FCFAFA",
                    border: "none",
                    borderRadius: "6px",
                    padding: "13px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    marginBottom: "10px",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Proceed to Checkout
                </button>
              </Link>
              <Link
                href="/shop"
                style={{ display: "block", textDecoration: "none" }}
              >
                <button
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "#1a1a2e",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0eeec")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
