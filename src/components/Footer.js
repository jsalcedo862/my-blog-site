import { FaInstagram, FaSoundcloud, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="text-white py-8 mt-12"
      style={{ backgroundColor: "var(--primary)" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--accent)" }}
            >
              3K Records
            </h3>
            <p className="text-sm text-gray-400">
              Electronic music vinyl and digital releases.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>
                <a
                  href="/shop"
                  className="hover:opacity-80"
                  style={{ color: "var(--text-light)" }}
                >
                  All Vinyl
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="hover:opacity-80"
                  style={{ color: "var(--text-light)" }}
                >
                  Pre-Orders
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  className="hover:opacity-80"
                  style={{ color: "var(--text-light)" }}
                >
                  Sale
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4 text-lg">
              <a
                href="https://www.instagram.com/3k.recordshop/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://on.soundcloud.com/7yAUOmSgqY14QZQgHI"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <FaSoundcloud />
              </a>
              <a
                href="https://www.youtube.com/@3k.recordshop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.discogs.com/seller/3k.recordshop/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition"
              >
                💿
              </a>
            </div>
          </div>
        </div>

        <div
          className="border-t pt-6 text-center text-sm"
          style={{ borderColor: "var(--border)", color: "var(--text-light)" }}
        >
          <p>
            &copy; {new Date().getFullYear()} 3K Record Shop. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
