const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

// Helper to parse numeric values safely and prevent NaN errors
const parseNumber = (val) => {
  if (val === undefined || val === null || val === "" || val === "undefined" || val === "null") return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

// Get all products for the logged-in user
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { productName, productType, quantity, mrp, sellingPrice, brandName, exchange } = req.body;

    if (!productName || !productType) {
      return res.status(400).json({ message: "Product Name and Type are required" });
    }

    let imagePath = null;
    if (req.file) {
      // Save relative path for browser access (proxied)
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newProduct = new Product({
      productName,
      productType,
      quantity: parseNumber(quantity),
      mrp: parseNumber(mrp),
      sellingPrice: parseNumber(sellingPrice),
      brandName,
      exchange: exchange || "No",
      image: imagePath,
      isPublished: false,
      user: req.user.id,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error creating product" });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const { productName, productType, quantity, mrp, sellingPrice, brandName, exchange } = req.body;
    const { id } = req.params;

    let product = await Product.findOne({ _id: id, user: req.user.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update basic fields
    if (productName) product.productName = productName;
    if (productType) product.productType = productType;
    if (quantity !== undefined) product.quantity = parseNumber(quantity);
    if (mrp !== undefined) product.mrp = parseNumber(mrp);
    if (sellingPrice !== undefined) product.sellingPrice = parseNumber(sellingPrice);
    if (brandName !== undefined) product.brandName = brandName;
    if (exchange !== undefined) product.exchange = exchange;

    // Handle new image upload if exists
    if (req.file) {
      // Delete old file if exists
      if (product.image && product.image.startsWith("/uploads/")) {
        const oldFilePath = path.join(__dirname, "..", product.image);
        fs.unlink(oldFilePath, (err) => {
          if (err) console.log("Failed to delete old image:", err.message);
        });
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error updating product" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, user: req.user.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image file from server if exists
    if (product.image && product.image.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", product.image);
      fs.unlink(filePath, (err) => {
        if (err) console.log("Failed to delete product image:", err.message);
      });
    }

    await Product.deleteOne({ _id: id, user: req.user.id });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error deleting product" });
  }
};

// Toggle publish status
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, user: req.user.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("Error toggling product publish status:", error);
    res.status(500).json({ message: "Server error updating product status" });
  }
};
