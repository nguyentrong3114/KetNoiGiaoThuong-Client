import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-10">
      {/* Nội dung chính */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Cột 1: Giới thiệu */}
        <section>
          <h3 className="text-white text-lg font-semibold mb-3">Kết Nối Giao Thương</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Nền tảng giao thương hàng đầu Việt Nam, tạo cầu nối giữa các doanh nghiệp để phát triển
            bền vững.
          </p>

          <div className="flex items-center space-x-4 mt-5">
            {[
              { icon: "facebook", link: "#" },
              { icon: "twitter", link: "#" },
              { icon: "linkedin", link: "#" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.link}
                aria-label={item.icon}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <i className={`fab fa-${item.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </section>

        {/* Cột 2: Liên kết nhanh */}
        <nav>
          <h4 className="text-white font-semibold mb-3">Liên kết nhanh</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-150">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors duration-150">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors duration-150">
                Giới thiệu
              </Link>
            </li>
          </ul>
        </nav>

        {/* Cột 3: Hỗ trợ */}
        <address className="not-italic">
          <h4 className="text-white font-semibold mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Trung tâm hỗ trợ</li>
            <li>Hướng dẫn sử dụng</li>
            <li>
              <span className="font-medium text-gray-300">Email:</span> support@kngt.vn
            </li>
            <li>
              <span className="font-medium text-gray-300">Hotline:</span> 0909 999 999
            </li>
          </ul>
        </address>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {year} <span className="text-gray-300 font-medium">Kết Nối Giao Thương</span>. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
