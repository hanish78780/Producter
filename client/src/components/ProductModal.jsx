import { useState, useContext, useRef } from "react";
import toast from "react-hot-toast";
import { ProductContext } from "../context/ProductContext";
import "./ProductModal.css";

function ProductModal({
  setOpen,
  editingProduct,
  setEditingProduct,
}) {
  const { addProduct, editProduct } = useContext(ProductContext);
  const fileInputRef = useRef(null);

  // Initialize state directly from props (reset is handled by key prop on parent mount)
  const [productName, setProductName] = useState(editingProduct ? editingProduct.productName : "");
  const [productType, setProductType] = useState(editingProduct ? editingProduct.productType : "");
  const [quantity, setQuantity] = useState(editingProduct ? editingProduct.quantity : "");
  const [mrp, setMrp] = useState(editingProduct ? editingProduct.mrp : "");
  const [sellingPrice, setSellingPrice] = useState(editingProduct ? editingProduct.sellingPrice : "");
  const [brandName, setBrandName] = useState(editingProduct ? editingProduct.brandName : "");
  const [exchange, setExchange] = useState(editingProduct ? editingProduct.exchange : "No");
  const [image, setImage] = useState(editingProduct ? editingProduct.image : null);
  const [imageFile, setImageFile] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreate = async () => {
    if (!productName || !productType) {
      toast.error("Please fill productName and productType");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productType", productType);
    formData.append("quantity", quantity);
    formData.append("mrp", mrp);
    formData.append("sellingPrice", sellingPrice);
    formData.append("brandName", brandName);
    formData.append("exchange", exchange);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const success = editingProduct
      ? await editProduct(editingProduct._id, formData)
      : await addProduct(formData);

    if (success) {
      setOpen(false);
      setEditingProduct(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
          <button
            className="close-btn"
            onClick={() => {
              setEditingProduct(null);
              setOpen(false);
            }}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Product Name</label>
            <input
              placeholder="CakeZone Walnut Brownie"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Product Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="">Select product type</option>
              <option value="Foods">Foods</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothes">Clothes</option>
              <option value="Beauty Products">Beauty Products</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity Stock</label>
            <input
              placeholder="Total numbers of Stock available"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>MRP</label>
              <input
                placeholder="Total numbers of Stock available"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              />
            </div>

            <div className="form-group flex-1">
              <label>Selling Price</label>
              <input
                placeholder="Total numbers of Stock available"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Brand Name</label>
            <input
              placeholder="Total numbers of Stock available"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Upload Product Images</label>
            <div className="image-upload-box" onClick={handleBoxClick}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImage}
              />
              {image ? (
                <img src={((imagePath) => {
                  if (!imagePath) return "";
                  if (imagePath.startsWith("data:") || imagePath.startsWith("http")) return imagePath;
                  const baseUrl = import.meta.env.VITE_API_URL || "";
                  return `${baseUrl}${imagePath}`;
                })(image)} alt="Preview" className="upload-preview" />
              ) : (
                <>
                  <span className="upload-desc">Enter Description</span>
                  <span className="browse-text">Browse</span>
                </>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Exchange or return eligibility</label>
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-action-btn" onClick={handleCreate}>
            {editingProduct ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;