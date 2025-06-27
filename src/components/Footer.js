import { FaInstagram, FaSoundcloud, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} 3K Record Shop</p>

        <div className="flex gap-6 text-lg">
          <a
            href="https://www.instagram.com/3k.recordshop/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-pink-400"
          >
            <FaInstagram />
          </a>

          <a
            href="https://on.soundcloud.com/7yAUOmSgqY14QZQgHI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-orange-400"
          >
            <FaSoundcloud />
          </a>

          <a
            href="https://www.youtube.com/@3k.recordshop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-red-500"
          >
            <FaYoutube />
          </a>

          <a
            href="https://www.discogs.com/seller/3k.recordshop/profile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-yellow-300"
          >
            💿
          </a>
        </div>
      </div>
    </footer>
  );
}
