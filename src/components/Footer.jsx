import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            Kết Nối Giao Thương
          </h3>
          <p className="text-sm text-gray-400">
            Nền tảng giao thương hàng đầu Việt Nam, tạo cầu nối giữa các doanh
            nghiệp để phát triển bền vững.
          </p>
          <div className="flex space-x-3 mt-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        {/* Cột 2 */}
        <div>
          <h4 className="text-white font-semibold mb-3">Liên kết nhanh</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/services">Dịch vụ</Link></li>
            <li><Link to="/about">Giới thiệu</Link></li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h4 className="text-white font-semibold mb-3">Hỗ trợ</h4>
          <ul className="space-y-1 text-sm">
            <li>Trung tâm hỗ trợ</li>
            <li>Hướng dẫn sử dụng</li>
            <li>Email: support@kngt.vn</li>
            <li>Hotline: 0909 999 999</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Kết Nối Giao Thương. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
