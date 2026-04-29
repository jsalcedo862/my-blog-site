import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      artist: product.artist,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#FCFAFA",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.16)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")
      }
    >
      {/* Album Image */}
      <Link href={`/shop/${product.id}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            style={{
              width: "100%",
              aspectRatio: "1/1",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              backgroundColor: "#e0e0e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            💿
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div style={{ padding: "16px" }}>
        <Link href={`/shop/${product.id}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#1a1a2e",
              marginBottom: "4px",
              lineHeight: "1.3",
            }}
          >
            {product.title}
          </h3>
        </Link>

        <p
          style={{
            fontSize: "13px",
            color: "#666666",
            marginBottom: "12px",
          }}
        >
          {product.artist}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#1a1a2e",
            }}
          >
            ${product.price?.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            style={{
              backgroundColor: "#1a1a2e",
              color: "#FCFAFA",
              border: "none",
              borderRadius: "4px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
