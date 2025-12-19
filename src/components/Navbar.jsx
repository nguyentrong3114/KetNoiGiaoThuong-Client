import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import NotificationBell from "./Common/NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Lấy user từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved && saved !== "undefined") {
        setUser(JSON.parse(saved));
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

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
    localStorage.clear();
    setUser(null);
    setOpenMenu(false);
    window.location.href = "/login";
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
            to={user ? "/dashboard" : "/"}
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}`
            }
          >
            {user ? "Dashboard" : "Trang chủ"}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}`
            }
          >
            Giới thiệu
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}`
            }
          >
            Sản phẩm
          </NavLink>
          <NavLink
            to="/auctions"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}`
            }
          >
            Đấu giá
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}`
            }
          >
            Liên hệ
          </NavLink>
        </div>

        {/* PHẦN BÊN PHẢI */}
        <div className="flex items-center space-x-5">
          <Link to="/search" className="flex items-center gap-1 text-blue-700 hover:text-blue-900">
            <FiSearch className="text-xl" />
            <span className="hidden md:inline font-medium">Search</span>
          </Link>

          <Link to="/cart" className="flex items-center gap-1 text-blue-700 hover:text-blue-900">
            <FiShoppingCart className="text-xl" />
            <span className="hidden md:inline font-medium">Cart</span>
          </Link>

          {/* NOTIFICATION BELL */}
          {user && <NotificationBell />}

          {/* NẾU CHƯA ĐĂNG NHẬP */}
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
            <div className="relative flex items-center gap-3" ref={menuRef}>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition hidden md:block"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src={user.avatar_url || user.avatar || "/default-avatar.jpg"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
                  onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.full_name || user.name || "User"}</p>
                  <p className="text-xs text-gray-500">
                    {user.role === "admin" ? "Quản trị viên" : user.role === "seller" ? "Doanh nghiệp" : "Thành viên"}
                  </p>
                </div>
                <svg className={`w-4 h-4 text-gray-600 transition-transform ${openMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white shadow-xl rounded-xl border border-gray-200 py-2 animate-fadeIn z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">{user.full_name || user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button onClick={() => { navigate("/profile"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">Hồ sơ cá nhân</button>

                    {user.role === "admin" && (
                      <button onClick={() => { navigate("/admin/dashboard"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 flex items-center gap-2 font-medium">Quản trị hệ thống</button>
                    )}

                    {user.role === "seller" && (
                      <>
                        <button onClick={() => { navigate("/dashboard/company"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">Dashboard Doanh nghiệp</button>
                        <button onClick={() => { navigate("/my-sales"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700 flex items-center gap-2">Đơn hàng cần xử lý</button>
                      </>
                    )}

                    {user.role === "buyer" && (
                      <button onClick={() => { navigate("/dashboard"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">Dashboard</button>
                    )}

                    <button onClick={() => { navigate("/chat"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">Tin nhắn</button>
                    <button onClick={() => { navigate("/wallet"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">Ví của tôi</button>
                    <button onClick={() => { navigate("/my-orders"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2">Đơn hàng của bạn</button>
                    <button onClick={() => { navigate("/subscription"); setOpenMenu(false); }} className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700 flex items-center gap-2">Gói đăng ký</button>
                  </div>

                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium">Đăng xuất</button>
                  </div>
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
