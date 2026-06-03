import { useLocation } from "react-router-dom";
import { FiPackage, FiHome, FiChevronDown } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/home";

  return (
    <div className="navbar">
      <div className="page-title">
        {isHome ? (
          <>
            <FiHome className="title-icon" />
            <span>Home</span>
          </>
        ) : (
          <>
            <FiPackage className="title-icon" />
            <span>Products</span>
          </>
        )}
      </div>

      <div className="navbar-right">
        <div className="profile-dropdown">
          <div className="avatar">
            H
          </div>
          <FiChevronDown className="dropdown-arrow" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;