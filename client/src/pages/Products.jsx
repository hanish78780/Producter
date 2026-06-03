import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProductModal from "../components/ProductModal";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../context/ProductContext";
import "./Products.css";

function Products() {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const {
    products,
    fetchProducts,
    removeProduct,
    togglePublishProduct,
    searchTerm,
  } = useContext(ProductContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      setTimeout(() => {
        fetchProducts();
      }, 0);
    }
  }, [navigate, fetchProducts]);

  const handleDelete = (id) => {
    removeProduct(id);
  };

  const handlePublish = (id) => {
    togglePublishProduct(id);
  };

  const filteredProducts = products.filter((product) => {
    const matchesName = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = product.brandName ? product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesType = product.productType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesName || matchesBrand || matchesType;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", background: "#F8FAFC" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          background: "#F8FAFC",
        }}
      >
        <Navbar />

        <div style={{ padding: "0px 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0b1354" }}>Products</h2>

            <button
              className="add-product-btn"
              onClick={() => {
                setEditingProduct(null);
                setOpen(true);
              }}
            >
              + Add Product
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-figma">
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="plus">+</div>
              </div>
              <h2>
                {searchTerm
                  ? "No matching products found..."
                  : "Feels a little empty over here..."}
              </h2>
              <p>
                {searchTerm
                  ? "Try checking your spelling or search terms."
                  : "You can create products without connecting store\nyou can add products to store anytime"}
              </p>
              {!searchTerm && (
                <button className="empty-state-btn" onClick={() => setOpen(true)}>
                  Add your Products
                </button>
              )}
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          {open && (
            <ProductModal
              key={editingProduct ? editingProduct._id : "new"}
              setOpen={setOpen}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;