import Link from "next/link";
import Image from "next/image";
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
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition border border-[#e0e0e0]">
      {/* Album Image */}
      <Link href={`/shop/${product.id}`}>
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden cursor-pointer group">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-[#1a1a2e] mb-1 hover:text-[#A390E4] line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-[#666666] mb-3 line-clamp-1">
          {product.artist}
        </p>

        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-[#1a1a2e]">
            ${product.price?.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            className="bg-[#737382] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[#1a1a2e] transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
