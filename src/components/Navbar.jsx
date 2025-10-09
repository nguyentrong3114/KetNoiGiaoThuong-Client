import { Link, NavLink } from 'react-router-dom';
import React from 'react';
import { FiSearch, FiShoppingCart } from 'react-icons/fi'; 

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-blue-700 flex items-center gap-2">
          <img
            src="/vite.svg"
            alt="Logo"
            className="w-7 h-7"
          />
          <span>Kết Nối Giao Thương</span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex space-x-6 font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-blue-600 transition ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-blue-600 transition ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`
            }
          >
            Giới thiệu
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-blue-600 transition ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`
            }
          >
            Sản phẩm
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `hover:text-blue-600 transition ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`
            }
          >
            Dịch vụ
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-blue-600 transition ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`
            }
          >
            Liên hệ
          </NavLink>
        </div>

        {/* Search + Cart + Login */}
        <div className="flex items-center space-x-5">
          {/* Search */}
          <Link
            to="/search"
            className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 transition"
          >
            <FiSearch className="text-xl" />
            <span className="hidden md:inline font-medium">Search</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center space-x-1 text-blue-700 hover:text-blue-900 transition"
          >
            <FiShoppingCart className="text-xl" />
            <span className="hidden md:inline font-medium">Cart</span>
          </Link>

          {/* Login / Register */}
          <div className="hidden md:flex space-x-3">
            <Link to="/login">
              <button className="px-4 py-2 text-sm font-semibold border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
                Đăng nhập
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Đăng ký
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
