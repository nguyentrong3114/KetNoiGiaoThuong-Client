"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Search, SlidersHorizontal } from "lucide-react";

const productsPerPage = 12;

const AllProductsPage = () => {
  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);

  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: productsPerPage,
  });

  const [loading, setLoading] = useState(true);

  /* =====================================================
     FETCH LISTINGS FROM API
  ===================================================== */
  const fetchListings = async () => {
    try {
      setLoading(true);

      const params = {
        search: search || undefined,
        min_price: priceMin || undefined,
        max_price: priceMax || undefined,
        sort: sortOption !== "default" ? sortOption : undefined,
        page: currentPage,
        per_page: productsPerPage,
      };

      const res = await listingApi.getAll(params);

      setListings(res.data || []);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Failed to load listings:", err);
      setListings([]);
      setPagination({ current_page: 1, last_page: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [search, priceMin, priceMax, sortOption, currentPage]);

  const totalPages = pagination?.last_page ?? 1;

  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else pages.push(1, 2, 3, "...", totalPages);
    return pages;
  };

  const pageList = generatePages();

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="min-h-screen bg-gray-50 pt-6 px-4 md:px-10">
      <nav className="flex items-center text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-700 transition font-medium">
          Trang chủ
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-semibold text-gray-900">Tất cả sản phẩm</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* SIDEBAR */}
        <aside className="md:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-lg border space-y-7">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <SlidersHorizontal className="text-blue-600" /> Bộ lọc
              </h3>
              <button
                className="text-blue-600 text-sm"
                onClick={() => {
                  setSearch("");
                  setPriceMin("");
                  setPriceMax("");
                  setSortOption("default");
                }}
              >
                Xóa lọc
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="font-semibold">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  className="pl-10 pr-4 py-2.5 w-full border rounded-xl bg-gray-100"
                  placeholder="Nhập tên sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="font-semibold">Khoảng giá</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 border"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 border"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="font-semibold">Sắp xếp</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 border"
              >
                <option value="default">Mặc định</option>
                <option value="low">Giá thấp → cao</option>
                <option value="high">Giá cao → thấp</option>
              </select>
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="md:col-span-3">
          {loading && <p>Đang tải sản phẩm…</p>}

          {!loading && listings.length === 0 && (
            <p className="text-gray-500 italic">Không tìm thấy sản phẩm.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7">
            {listings.map((item) => (
              <Link
                key={item.id}
                to={`/company/${item.shop.slug}/product/${item.id}`}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <div className="h-48 bg-gray-200">
                  <img src={item.images?.[0]} className="w-full h-full object-cover" />
                </div>

                <div className="p-4">
                  <h4 className="font-semibold line-clamp-2">{item.title}</h4>
                  <p className="text-blue-600 font-bold">
                    {item.price_cents?.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft />
              </button>

              {pageList.map((p, i) => (
                <button
                  key={i}
                  disabled={p === "..."}
                  className={`px-3 py-1 rounded-xl ${
                    p === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => typeof p === "number" && setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
