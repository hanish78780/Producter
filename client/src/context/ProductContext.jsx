import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ProductContext } from "./ProductContext";
import toast from "react-hot-toast";

function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await axios.get("/api/products", getHeaders());
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchProducts();
    }, 0);
  }, [fetchProducts]);

  const addProduct = async (formData) => {
    try {
      const response = await axios.post("/api/products", formData, {
        headers: {
          ...getHeaders().headers,
          "Content-Type": "multipart/form-data"
        }
      });
      setProducts((prev) => [response.data, ...prev]);
      toast.success("Product created successfully");
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to create product");
      return false;
    }
  };

  const editProduct = async (id, formData) => {
    try {
      const response = await axios.put(`/api/products/${id}`, formData, {
        headers: {
          ...getHeaders().headers,
          "Content-Type": "multipart/form-data"
        }
      });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      );
      toast.success("Product updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
      return false;
    }
  };

  const removeProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, getHeaders());
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      return false;
    }
  };

  const togglePublishProduct = async (id) => {
    try {
      const response = await axios.patch(`/api/products/${id}/publish`, {}, getHeaders());
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? response.data : p))
      );
      toast.success(response.data.isPublished ? "Product published" : "Product unpublished");
      return true;
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Failed to update status");
      return false;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        searchTerm,
        setSearchTerm,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
        togglePublishProduct,
        loading
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;