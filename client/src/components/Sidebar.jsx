import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiPackage, FiSearch } from "react-icons/fi";
import { ProductContext } from "../context/ProductContext";
import logo from "../assets/images/logo.png";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const { searchTerm, setSearchTerm } = useContext(ProductContext);

  return (
    <div className="sidebar">
      <div className="sidebar-logo-container">
        <img src={logo} alt="Productr Logo" className="sidebar-logo" />
      </div>

      <div className="sidebar-search-box">
        <FiSearch className="sidebar-search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <nav className="sidebar-menu">
        <Link
          to="/home"
          className={
            location.pathname === "/home"
              ? "menu-item active"
              : "menu-item"
          }
        >
          <FiHome className="menu-icon" />
          <span>Home</span>
        </Link>

        <Link
          to="/products"
          className={
            location.pathname === "/products"
              ? "menu-item active"
              : "menu-item"
          }
        >
          <FiPackage className="menu-icon" />
          <span>Products</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;