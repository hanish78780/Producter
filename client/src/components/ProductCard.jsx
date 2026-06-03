import { FiTrash2 } from "react-icons/fi";
import "./ProductCard.css";

function ProductCard({
  product,
  onDelete,
  onEdit,
  onPublish,
}) {
  const imageCount = product.image ? 1 : 0;
  const exchangeStatus = product.exchange ? product.exchange.toUpperCase() : "NO";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("data:") || imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL || "";
    return `${baseUrl}${imagePath}`;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <div className="product-image">
          {product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.productName}
            />
          ) : (
            <span className="no-img-placeholder">📦</span>
          )}
        </div>
        
        {/* Pagination dots from Figma */}
        <div className="image-pagination-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      <h3 className="product-title">{product.productName}</h3>

      <div className="product-details-list">
        <div className="detail-row">
          <span className="detail-label">Product type -</span>
          <span className="detail-value">{product.productType}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Quantity Stock -</span>
          <span className="detail-value">{product.quantity}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">MRP -</span>
          <span className="detail-value">₹ {product.mrp}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Selling Price -</span>
          <span className="detail-value">₹ {product.sellingPrice}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Brand Name -</span>
          <span className="detail-value">{product.brandName || "N/A"}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Total Number of images -</span>
          <span className="detail-value">{imageCount}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Exchange Eligibility -</span>
          <span className="detail-value">{exchangeStatus}</span>
        </div>
      </div>

      <div className="card-buttons">
        {onPublish && (
          <button
            className={`publish-btn ${product.isPublished ? "published" : ""}`}
            onClick={() => onPublish(product._id)}
          >
            {product.isPublished ? "Unpublish" : "Publish"}
          </button>
        )}

        {onEdit && (
          <button
            className="edit-btn"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            className="trash-btn"
            onClick={() => {
              const confirmDelete = window.confirm("Delete this Product?");
              if (confirmDelete) {
                onDelete(product._id);
              }
            }}
            title="Delete product"
          >
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;