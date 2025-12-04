"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Search, Filter, SlidersHorizontal } from "lucide-react";

const productsPerPage = 12;

const AllProductsPage = () => {
  /* FILTER STATES */
  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortOption, setSortOption] = useState("default");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  /* API DATA */
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FETCH LISTINGS */
  useEffect(() => {
    setLoading(false);
    setListings([]);
    setPagination({
      current_page: 1,
      per_page: productsPerPage,
      total: 0,
      last_page: 1,
    });
  }, [search, priceMin, priceMax, sortOption]);

  useEffect(() => setCurrentPage(1), [search, priceMin, priceMax, sortOption]);

  /* PAGINATION UI */
  const totalPages = pagination?.last_page || 1;
  const totalItems = pagination?.total ?? listings.length;

  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pages.push(i);
    else pages.push(1, 2, 3, "...", totalPages);
    return pages;
  };

  const pageList = generatePages();

  /* ============================
       UI NÂNG CẤP BẮT ĐẦU
  ============================ */
  return (
    <div className="min-h-screen bg-gray-50 pt-6 px-4 md:px-10">
      {/* BREADCRUMB */}
      <nav className="flex items-center text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-700 transition font-medium">
          Trang chủ
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-semibold text-gray-900">Tất cả sản phẩm</span>
      </nav>

      {/* PAGE TITLE */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Tất cả sản phẩm <span className="text-blue-600 ml-1">({totalItems})</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* ===================== FILTER SIDEBAR ===================== */}
        <aside className="md:col-span-1">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border shadow-lg p-6 space-y-7">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="text-blue-600" size={20} />
                Bộ lọc
              </h3>
              <button
                onClick={() => {
                  setSearch("");
                  setPriceMin("");
                  setPriceMax("");
                  setSortOption("default");
                }}
                className="text-blue-600 text-sm hover:underline"
              >
                Xóa lọc
              </button>
            </div>

            {/* SEARCH */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* PRICE FILTER */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Khoảng giá (VNĐ)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Tối thiểu"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-600"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Tối đa"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* SORT */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-700">Sắp xếp</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="default">Mặc định (mới nhất)</option>
                <option value="low">Giá thấp → cao</option>
                <option value="high">Giá cao → thấp</option>
                <option value="newest">Sản phẩm mới nhất</option>
              </select>
            </div>
          </div>
        </aside>

        {/* ===================== PRODUCT GRID ===================== */}
        <div className="md:col-span-3">
          {!loading && listings.length === 0 && (
            <p className="text-gray-500 italic mb-4">Không tìm thấy sản phẩm phù hợp.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7">
            {listings.map((product) => (
              <Link
                key={product.id}
                to={`/company/${product.companySlug}/product/${product.id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-blue-600 font-bold text-sm">{product.priceLabel}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 gap-3">
              <button
                onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : p))}
                className="p-2 rounded-xl hover:bg-gray-200 disabled:opacity-40 transition"
                disabled={currentPage <= 1}
              >
                <ChevronLeft size={22} />
              </button>

              {pageList.map((page, index) => (
                <button
                  key={index}
                  disabled={page === "..."}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl font-medium transition ${
                    page === currentPage
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
                className="p-2 rounded-xl hover:bg-gray-200 disabled:opacity-40 transition"
                disabled={currentPage >= totalPages}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
