import { useState } from 'react';
import Link from 'next/link';

export default function ProductForm({ product, onSubmit, loading }) {
  const [formData, setFormData] = useState(product || {
    title: '',
    artist: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    release_date: '',
    genre: '',
    format: '12-inch vinyl',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Title *</label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Album Title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Artist *</label>
        <input
          type="text"
          name="artist"
          required
          value={formData.artist}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Artist Name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Price *</label>
          <input
            type="number"
            name="price"
            required
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="29.99"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Stock Quantity *</label>
          <input
            type="number"
            name="stock_quantity"
            required
            value={formData.stock_quantity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="10"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Release Date</label>
          <input
            type="date"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Genre</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Electronic"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold mb-2">Format</label>
        <input
          type="text"
          name="format"
          value={formData.format}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="12-inch vinyl"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>
        <Link href="/admin/products">
          <button
            type="button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded font-bold transition"
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
}