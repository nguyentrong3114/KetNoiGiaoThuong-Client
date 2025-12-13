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
    console.log("🔍 Navbar: Checking localStorage for user...");
    try {
      const saved = localStorage.getItem("user");
      console.log("📦 localStorage user:", saved);
      
      if (saved && saved !== "undefined") {
        const parsedUser = JSON.parse(saved);
        console.log("✅ Parsed user:", parsedUser);
        setUser(parsedUser);
      } else {
        console.log("❌ No user in localStorage");
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Error parsing user:", err);
      setUser(null);
    }
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
    console.log("🚪 Logging out...");
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    console.log("✅ localStorage cleared");
    
    // Cập nhật state ngay lập tức
    setUser(null);
    setOpenMenu(false);
    
    // Redirect về trang login
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
              `hover:text-blue-600 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
              }`
            }
          >
            {user ? "Dashboard" : "Trang chủ"}
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-blue-600 ${
                isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""
              }`
            }
          >
            Giới thiệu
          </NavLink>

          <NavLink
            to="/products"
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

          {/* NOTIFICATION BELL - Chỉ hiển thị khi đã đăng nhập */}
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
            <div className="relative" ref={menuRef}>
              {/* User Info Button */}
              <button
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src={user.avatar_url || user.avatar || "/default-avatar.jpg"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.jpg";
                  }}
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.full_name || user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.role === "admin" ? "Quản trị viên" : user.role === "seller" ? "Doanh nghiệp" : "Thành viên"}
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${openMenu ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-200 py-2 animate-fadeIn z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.full_name || user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </button>

                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin/dashboard");
                          setOpenMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Quản trị hệ thống
                      </button>
                    )}

                    {user.role === "seller" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/dashboard/company");
                            setOpenMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Dashboard Doanh nghiệp
                        </button>
                        <button
                          onClick={() => {
                            navigate("/my-sales");
                            setOpenMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-700 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          Đơn hàng cần xử lý
                        </button>
                      </>
                    )}
                    
                    {user.role === "buyer" && (
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setOpenMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                      </button>
                    )}

                    {/* Tin nhắn - Hiển thị cho tất cả user đã đăng nhập */}
                    <button
                      onClick={() => {
                        navigate("/chat");
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Tin nhắn
                    </button>

                    <button
                      onClick={() => {
                        navigate("/wallet");
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Ví của tôi
                    </button>

                    <button
                      onClick={() => {
                        navigate("/my-orders");
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Đơn hàng của bạn
                    </button>

                    {/* Gói đăng ký - Hiển thị cho tất cả user (seller đăng ký gói) */}
                    <button
                      onClick={() => {
                        navigate("/subscription");
                        setOpenMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 text-purple-700 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Gói đăng ký
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
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
