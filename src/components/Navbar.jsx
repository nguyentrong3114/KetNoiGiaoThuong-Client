import { Link, NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-blue-700 flex items-center gap-2"
        >
          <img src="/vite.svg" alt="Logo" className="w-7 h-7" />
          <span>Kết Nối Giao Thương</span>
        </Link>

        {/* MENU CHÍNH */}
        <div className="hidden md:flex space-x-6 font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}`
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}`
            }
          >
            Giới thiệu
          </NavLink>

          {/* SẢN PHẨM → USER = /products, DOANH NGHIỆP = /company/slug */}
          <NavLink
            to={user?.role === "company" ? `/company/${user.companySlug}` : "/products"}
            className={({ isActive }) =>
              `hover:text-blue-600 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
              }`
            }
          >
            Sản phẩm
          </NavLink>

          <NavLink
            to="/auctions"
            className={({ isActive }) =>
              `hover:text-blue-600 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
              }`
            }
          >
            Đấu giá
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-blue-600 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
              }`
            }
          >
            Liên hệ
          </NavLink>
        </div>

        {/* ⭐ BUTTON ĐĂNG BÀI VIẾT – Chỉ cho doanh nghiệp */}
        {user?.role === "company" && (
          <Link
            to={`/company/${user.companySlug}/post`}
            className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Đăng bài viết
          </Link>
        )}

        {/* PHẦN BÊN PHẢI */}
        <div className="flex items-center space-x-5">
          {/* Search */}
          <Link to="/search" className="flex items-center gap-1 text-blue-700 hover:text-blue-900">
            <FiSearch className="text-xl" />
            <span className="hidden md:inline font-medium">Search</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-1 text-blue-700 hover:text-blue-900">
            <FiShoppingCart className="text-xl" />
            <span className="hidden md:inline font-medium">Cart</span>
          </Link>

          {/* CHƯA ĐĂNG NHẬP */}
          {!user && (
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
          )}

          {/* ĐÃ ĐĂNG NHẬP */}
          {user && (
            <div className="relative" ref={menuRef}>
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full cursor-pointer border"
                onClick={() => setOpenMenu((prev) => !prev)}
              />

              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 animate-fadeIn">
                  {/* ⭐ DASHBOARD phân nhánh theo role */}
                  {user.role === "company" && (
                    <button
                      onClick={() => navigate("/dashboard/company")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </button>
                  )}

                  {/* ⭐ NÚT ĐĂNG BÀI – chỉ doanh nghiệp */}
                  {user.role === "company" && (
                    <button
                      onClick={() => navigate(`/company/${user.companySlug}/post`)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      Đăng bài viết
                    </button>
                  )}

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Hồ sơ cá nhân
                  </button>

                  <button
                    onClick={() => navigate("/track-order")}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Đơn hàng của bạn
                  </button>

                  {/* Đăng xuất */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
