import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header>
      <nav className="navbar navbar-expand-xl navbar-shopez sticky-top" aria-label="Main navigation">
        <div className="container navbar-shopez__inner">
          <Link className="navbar-brand" to="/" aria-label="ShopEZ home">
            <span className="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
            <span>ShopEZ</span>
          </Link>
          <button
            className="navbar-toggler tap-target"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto navbar-shopez__links">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">Products</NavLink>
              </li>
              {user && user.usertype === "admin" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin">Admin Dashboard</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/orders">All Orders</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/products">All Products</NavLink>
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav align-items-lg-center navbar-shopez__account">
              {user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/cart">
                      Cart{count > 0 ? " (" + count + ")" : ""}
                      {count > 0 && <span className="visually-hidden"> items</span>}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">{user.username}</NavLink>
                  </li>
                  <li className="nav-item">
                    <button type="button" className="btn btn-outline-secondary ms-lg-2 tap-target" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">Register</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
