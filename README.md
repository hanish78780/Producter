# Productr - Product Catalog Management System

Productr is a full-stack, responsive product catalog management web application. It integrates a React (Vite) client with an Express (Node.js) server backed by a MongoDB database. The design is meticulously styled to align with Figma mockups, presenting a premium user experience.

---

## Key Features

1. **OTP & JWT Authentication**: 
   - Login requesting a random 6-digit OTP code printed directly in the server console and displayed via toaster notifications for easy testing.
   - OTP verification generating a secure JWT token (7-day duration) to authorize user sessions.
   - Secure Route Guards preventing unauthorized users from accessing catalog pages.
2. **Product Management (CRUD)**:
   - Create, edit, publish/unpublish, or delete products.
   - Set product details: Name, Type, Quantity Stock, MRP, Selling Price, Brand Name, and Return Eligibility.
3. **Multipart Image Uploads**:
   - Handles product images using Multer storage on the node server, coupled with image preview before creation.
4. **Dynamic Sidebar Search Filter**:
   - Live character-by-character search instantly filtering catalog grids by name, brand, or category.
5. **Modern Layout Adjustments**:
   - Slate dark background layouts, styled chevron profile dropdowns, and pagination dots matching Figma mockups.
   - CSS-implemented empty state graphic simulating the Figma layout (4-box outline with a plus sign).

---

## Technology Stack

- **Client**: React (Vite), React Router DOM, Axios, React Icons, React Hot Toast.
- **Server**: Node.js, Express, MongoDB, Mongoose, Multer (file upload), JWT, CORS, Dotenv.

---

## Project Structure

```
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── assets/       # Image resources (logos, backgrounds)
│   │   ├── components/   # Sidebar, Navbar, ProductCard, ProductModal
│   │   ├── context/      # ProductContext and ProductProvider API connectors
│   │   ├── pages/        # Login, OTP, Home, Products
│   │   └── main.jsx
│   └── vite.config.js    # Configure dev proxy for API calls
│
├── server/          # Express backend
│   ├── config/      # MongoDB connection config
│   ├── controllers/ # Auth & Product controller handlers
│   ├── middleware/  # JWT Auth guards
│   ├── models/      # Mongoose Schemas (User, Product)
│   ├── routes/      # Auth & Product route handlers
│   ├── uploads/     # Target folder for uploaded images
│   └── server.js
```

---

## Installation & Setup

### Prerequisites
- Install [Node.js](https://nodejs.org/) (v16+ recommended).
- Ensure [MongoDB](https://www.mongodb.com/) is running locally on `mongodb://127.0.0.1:27017` or configure it via a `.env` file.

### 1. Server Configuration
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file to configure customized ports or MongoDB URLs:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/orufy-assignment
   JWT_SECRET=supersecretkey
   ```
4. Start the backend server in development mode (using nodemon):
   ```bash
   npm run dev
   ```

### 2. Client Configuration
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (typically `http://localhost:5173/` or `http://localhost:5174/`) in your browser.

---

## Running Lint & Build
To ensure code quality and build compilation:
```bash
# In the client folder
npm run lint
npm run build
```
