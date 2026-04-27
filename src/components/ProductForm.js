import { useState } from "react";
import Link from "next/link";

const PAGE_BG = "#f5f3f0";
const PRIMARY = "#1a1a2e";
const BORDER = "#e0e0e0";
const SECONDARY = "#666666";

const inputStyle = {
  width: "100%",
  border: `1px solid ${BORDER}`,
  borderRadius: "6px",
  padding: "10px 12px",
  fontSize: "14px",
  backgroundColor: PAGE_BG,
  color: PRIMARY,
  boxSizing: "border-box",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: SECONDARY,
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export default function ProductForm({ product, onSubmit, loading }) {
  const [formData, setFormData] = useState(
    product || {
      title: "",
      artist: "",
      description: "",
      price: "",
      stock_quantity: "",
      image_url: "",
      release_date: "",
      genre: "",
      format: "12-inch vinyl",
      condition: "Mint",
    },
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Album Title"
          />
        </div>

        <div>
          <label style={labelStyle}>Artist *</label>
          <input
            type="text"
            name="artist"
            required
            value={formData.artist}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Artist Name"
          />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
            placeholder="Product description"
            rows={3}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label style={labelStyle}>Price *</label>
            <input
              type="number"
              name="price"
              required
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              style={inputStyle}
              placeholder="29.99"
            />
          </div>

          <div>
            <label style={labelStyle}>Stock Quantity *</label>
            <input
              type="number"
              name="stock_quantity"
              required
              value={formData.stock_quantity}
              onChange={handleChange}
              style={inputStyle}
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            style={inputStyle}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label style={labelStyle}>Release Date</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Electronic"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Format</label>
          <input
            type="text"
            name="format"
            value={formData.format}
            onChange={handleChange}
            style={inputStyle}
            placeholder="12-inch vinyl"
          />
        </div>

        <div>
          <label style={labelStyle}>Condition</label>
          <select
            name="condition"
            value={formData.condition || "Mint"}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Mint">Mint</option>
            <option value="Near Mint">Near Mint</option>
            <option value="Very Good Plus">Very Good Plus</option>
            <option value="Very Good">Very Good</option>
            <option value="Good Plus">Good Plus</option>
            <option value="Good">Good</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: PRIMARY,
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
          <Link
            href="/admin/products"
            style={{ textDecoration: "none", flex: 1 }}
          >
            <button
              type="button"
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: PRIMARY,
                border: `1px solid ${BORDER}`,
                borderRadius: "6px",
                padding: "12px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </Link>
        </div>
      </div>
    </form>
  );
}
