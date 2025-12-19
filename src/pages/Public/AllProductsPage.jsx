"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  SlidersHorizontal,
  Eye,
  Heart,
  MessageCircle,
  MapPin,
  Star,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { listingApi, categoryApi, discoveryApi } from "../../services/apiClient";
=======
import { ChevronRight, ChevronLeft, Search, SlidersHorizontal } from "lucide-react";
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd

const productsPerPage = 12;

const AllProductsPage = () => {
<<<<<<< HEAD
  const navigate = useNavigate();
  
  /* ============================
     GIỮ NGUYÊN LOGIC CỦA BẠN
  ============================ */

  /* FILTER STATES */
=======
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: productsPerPage,
  });

  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  /* DEBOUNCE SEARCH - Chỉ gọi API sau 500ms user ngừng gõ */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* FETCH CATEGORIES */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  /* FETCH LISTINGS */
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      console.log("🔍 Bắt đầu fetch listings...");

      try {
        const params = {
          page: currentPage,
          per_page: productsPerPage,
        };

        // Search
        if (searchDebounced) {
          params.search = searchDebounced;
        }

        // Price filter - Backend cần price_cents (VND × 100)
        if (priceMin) {
          params.price_min = parseInt(priceMin) * 100;
        }
        if (priceMax) {
          params.price_max = parseInt(priceMax) * 100;
        }

        // Category filter
        if (category) {
          params.category = category;
        }

        // Sort - Thử cả 2 tên param để đảm bảo backend nhận được
        if (sortOption && sortOption !== "latest") {
          params.sort = sortOption;
          params.sort_by = sortOption; // Backup nếu backend dùng sort_by
        }

        console.log("📤 API Params:", params);
        console.log("📤 Sort option:", sortOption);
        
        // Sử dụng discoveryApi để có promotion support (sản phẩm quảng cáo lên top)
        const response = await discoveryApi.searchListings(params);
        console.log("📥 API Response:", response);
        
        // Debug: Check if data is sorted correctly
        if (response?.data && response.data.length > 0) {
          console.log("📊 First 3 products prices:", 
            response.data.slice(0, 3).map(p => ({
              title: p.title,
              price: p.price_cents / 100,
              price_cents: p.price_cents
            }))
          );
        }

        if (response?.data) {
          let filteredData = [...response.data];
          
          // Fallback: Nếu backend không filter đúng theo giá, FE sẽ filter lại
          if (priceMin || priceMax) {
            const minCents = priceMin ? parseInt(priceMin) * 100 : 0;
            const maxCents = priceMax ? parseInt(priceMax) * 100 : Infinity;
            
            filteredData = filteredData.filter(item => {
              const itemPrice = item.price_cents || 0;
              return itemPrice >= minCents && itemPrice <= maxCents;
            });
            
            console.log(`🔄 FE filtered by price: ${priceMin || 0} - ${priceMax || '∞'} VND`);
            console.log(`📊 Filtered from ${response.data.length} to ${filteredData.length} items`);
          }
          
          // Fallback: Nếu backend không sort đúng, FE sẽ sort lại
          if (sortOption === "price_asc") {
            filteredData.sort((a, b) => (a.price_cents || 0) - (b.price_cents || 0));
            console.log("🔄 FE sorted by price ascending");
          } else if (sortOption === "price_desc") {
            filteredData.sort((a, b) => (b.price_cents || 0) - (a.price_cents || 0));
            console.log("🔄 FE sorted by price descending");
          }
          
          setListings(filteredData);
          
          // Cập nhật pagination với số lượng đã filter
          const originalPagination = response.meta || response.pagination || {
            current_page: 1,
            per_page: productsPerPage,
            total: response.data.length,
            last_page: 1,
          };
          
          // Nếu FE đã filter, cập nhật lại total
          if (filteredData.length !== response.data.length) {
            setPagination({
              ...originalPagination,
              total: filteredData.length,
              last_page: Math.ceil(filteredData.length / productsPerPage),
            });
          } else {
            setPagination(originalPagination);
          }
        } else {
          console.warn("⚠️ Response không có data:", response);
          setListings([]);
        }
      } catch (error) {
        console.error("❌ Error fetching listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
        console.log("✅ Fetch hoàn tất");
      }
    };

    fetchListings();
  }, [currentPage, searchDebounced, priceMin, priceMax, category, sortOption]);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchDebounced, priceMin, priceMax, category, sortOption]);

  /* PAGINATION LOGIC */
  const totalPages = pagination?.last_page || 1;
  const totalItems = pagination?.total ?? listings.length;
=======
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
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd

  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
<<<<<<< HEAD
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
=======
    } else pages.push(1, 2, 3, "...", totalPages);
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
    return pages;
  };

  const pageList = generatePages();

<<<<<<< HEAD
  /* TRACK PROMOTION CLICK */
  const handleProductClick = async (e, product) => {
    // Track click nếu có promotion
    if (product.promotion_id) {
      try {
        await discoveryApi.trackPromotionClick(product.promotion_id);
        console.log(`📊 Tracked click for promotion ${product.promotion_id}`);
      } catch (error) {
        console.error("Error tracking promotion click:", error);
      }
    }
    // Navigate đến trang chi tiết
    navigate(`/product/${product.id}`);
    e.preventDefault();
  };

  /* ============================
        UI NÂNG CẤP (MODERN)
  ============================ */
  return (
    <div className="min-h-screen bg-slate-50 pt-6 px-4 md:px-8 pb-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* BREADCRUMB */}
        <nav className="flex items-center text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors font-medium">
            Trang chủ
          </Link>
          <ChevronRight size={14} className="mx-2 text-slate-400" />
          <span className="font-semibold text-slate-800">Tất cả sản phẩm</span>
        </nav>

        {/* PAGE TITLE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Khám phá sản phẩm
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Tìm thấy <span className="font-bold text-blue-600">{totalItems}</span> kết quả phù hợp
              với bạn
            </p>
=======
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
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
          </div>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ===================== FILTER SIDEBAR ===================== */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Filter className="text-blue-600" size={18} />
                  Bộ lọc
                </h3>
                <button
                  onClick={() => {
                    setSearch("");
                    setSearchDebounced("");
                    setPriceMin("");
                    setPriceMax("");
                    setCategory("");
                    setSortOption("latest");
                    setCurrentPage(1);
                  }}
                  className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wide"
                >
                  Đặt lại
=======
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
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
                </button>
              </div>

<<<<<<< HEAD
              <div className="space-y-6">
                {/* SEARCH */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tìm kiếm</label>
                  <div className="relative group">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  {search && search !== searchDebounced && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                      Đang tìm kiếm...
                    </p>
                  )}
                </div>

                {/* CATEGORY FILTER */}
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Danh mục</label>
                    <div className="relative">
                      <Filter
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer transition-all"
                      >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat.id || cat.name} value={cat.name || cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight
                        className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                        size={14}
                      />
                    </div>
                  </div>
                )}

                {/* PRICE FILTER */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Khoảng giá (VNĐ)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Tối thiểu"
                      value={priceMin}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || parseInt(value) >= 0) setPriceMin(value);
                      }}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Tối đa"
                      value={priceMax}
                      onChange={(e) => {
                        const value = e.target.value;
                        const min = parseInt(priceMin) || 0;
                        if (value === "" || (parseInt(value) >= min && parseInt(value) >= 0))
                          setPriceMax(value);
                      }}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  {priceMin && priceMax && parseInt(priceMax) < parseInt(priceMin) && (
                    <p className="text-xs text-red-500 mt-1">Giá tối đa phải lớn hơn tối thiểu</p>
                  )}
                  {/* Quick price filters */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setPriceMin("0");
                        setPriceMax("1000000");
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      Dưới 1 triệu
                    </button>
                    <button
                      onClick={() => {
                        setPriceMin("1000000");
                        setPriceMax("5000000");
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      1-5 triệu
                    </button>
                    <button
                      onClick={() => {
                        setPriceMin("5000000");
                        setPriceMax("10000000");
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      5-10 triệu
                    </button>
                    <button
                      onClick={() => {
                        setPriceMin("10000000");
                        setPriceMax("");
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      Trên 10 triệu
                    </button>
                  </div>
                </div>

                {/* SORT */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Sắp xếp theo</label>
                  <div className="relative">
                    <SlidersHorizontal
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="latest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="price_asc">Giá: Thấp đến cao</option>
                      <option value="price_desc">Giá: Cao đến thấp</option>
                    </select>
                    <ChevronRight
                      className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                      size={14}
                    />
                  </div>
                </div>
              </div>
=======
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight />
              </button>
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
            </div>
          </aside>

          {/* ===================== PRODUCT LIST AREA ===================== */}
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-140px)]">
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-4">
              {loading ? (
                /* SKELETON LOADING STATE */
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse border border-slate-100"
                    >
                      <div className="w-48 h-36 bg-slate-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3 py-2">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                /* EMPTY STATE */
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-3xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Không tìm thấy sản phẩm</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.
                  </p>
                </div>
              ) : (
                /* PRODUCTS LIST */
                <div className="space-y-5">
                  {listings.map((product) => (
                    <div
                      key={product.id}
                      onClick={(e) => handleProductClick(e, product)}
                      className={`group flex flex-col md:flex-row bg-white rounded-2xl border shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                        product.has_promotion || product.has_top_search_promo === 1 || product.promotion_type
                          ? 'border-amber-300 ring-1 ring-amber-200'
                          : 'border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      {/* Image Section */}
                      <div className="w-full md:w-72 h-48 md:h-auto bg-slate-100 relative overflow-hidden flex-shrink-0">
                        <img
                          src={
                            product.images?.[0] || "https://via.placeholder.com/300?text=No+Image"
                          }
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {/* Badge Tài trợ - Hiển thị cho TẤT CẢ loại quảng cáo */}
                          {(product.has_promotion || product.has_top_search_promo === 1 || product.promotion_type) && (
                            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                              <Sparkles size={10} />
                              Tài trợ
                            </span>
                          )}
                          {product.status === "published" && !product.has_promotion && !product.has_top_search_promo && !product.promotion_type && (
                            <span className="px-2.5 py-1 bg-green-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                              Đang bán
                            </span>
                          )}
                          {product.status === "draft" && (
                            <span className="px-2.5 py-1 bg-slate-500/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                              Nháp
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-5 md:p-6 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex flex-wrap gap-2">
                            {product.category && (
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                {product.category}
                              </span>
                            )}
                            {product.type && (
                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                                  product.type === "sell"
                                    ? "bg-blue-50 text-blue-600"
                                    : product.type === "buy"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-purple-50 text-purple-600"
                                }`}
                              >
                                {product.type === "sell"
                                  ? "Cần Bán"
                                  : product.type === "buy"
                                    ? "Cần Mua"
                                    : "Dịch vụ"}
                              </span>
                            )}
                          </div>
                          {/* Rating */}
                          {product.rating > 0 && (
                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full">
                              <Star size={12} fill="currentColor" />
                              {product.rating}
                            </div>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-800 text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h4>

                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-bold text-blue-600 leading-none">
                              {product.price_cents
                                ? `₫${Number(product.price_cents / 100).toLocaleString("vi-VN")}`
                                : "Liên hệ"}
                            </p>
                            {product.location_text && (
                              <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
                                <MapPin size={12} />
                                <span className="truncate max-w-[150px]">
                                  {product.location_text}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
                            {(product.views_count > 0 || product.views_count === 0) && (
                              <span className="flex items-center gap-1.5" title="Lượt xem">
                                <Eye size={14} /> {product.views_count || 0}
                              </span>
                            )}
                            {(product.likes_count > 0 || product.likes_count === 0) && (
                              <span
                                className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                                title="Lượt thích"
                              >
                                <Heart
                                  size={14}
                                  className={
                                    product.likes_count > 0 ? "fill-red-50 text-red-500" : ""
                                  }
                                />
                                {product.likes_count || 0}
                              </span>
                            )}
                            {(product.comments_count > 0 || product.comments_count === 0) && (
                              <span
                                className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                                title="Bình luận"
                              >
                                <MessageCircle size={14} /> {product.comments_count || 0}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ===================== PAGINATION UI (New Addition using your Logic) ===================== */}
            {!loading && listings.length > 0 && totalPages > 1 && (
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                {pageList.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                    disabled={typeof page !== "number"}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                      page === currentPage
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : typeof page === "number"
                          ? "bg-transparent text-slate-600 hover:bg-white hover:text-blue-600 hover:border hover:border-blue-200"
                          : "text-slate-400 cursor-default"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AllProductsPage;
