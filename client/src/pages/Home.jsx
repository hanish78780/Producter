import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Home() {
  const { products, fetchProducts, searchTerm } = useContext(ProductContext);
  const [activeTab, setActiveTab] = useState("published");
  const navigate = useNavigate();

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

  const publishedProducts = products.filter(
    (product) => product.isPublished
  );

  const unpublishedProducts = products.filter(
    (product) => !product.isPublished
  );

  const currentProducts =
    activeTab === "published"
      ? publishedProducts
      : unpublishedProducts;

  const filteredProducts = currentProducts.filter((product) => {
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

        <div >
          <div className="tabs">
            <button
              className={activeTab === "published" ? "active-tab" : ""}
              onClick={() => setActiveTab("published")}
            >
              Published
            </button>

            <button
              className={activeTab === "unpublished" ? "active-tab" : ""}
              onClick={() => setActiveTab("unpublished")}
            >
              Unpublished
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
              <h2>No Products Found</h2>
              <p>
                {activeTab === "published"
                  ? "No published products available matching your search."
                  : "No unpublished products available matching your search."}
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;