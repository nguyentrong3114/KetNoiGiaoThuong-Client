"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

const AllProductsPage = () => {
  // FILTER
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [sortOption, setSortOption] = useState("default");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // DEMO PRODUCTS
  const products = [
    {
      id: 1,
      name: "Váy công sở",
      slug: "cong-ty-abc",
      priceLabel: "₫400.000",
      priceValue: 400000,
      gender: "Nữ",
      ageGroup: "Người lớn",
      size: "M",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Áo thun cao cấp",
      slug: "cong-ty-x",
      priceLabel: "₫250.000",
      priceValue: 250000,
      gender: "Nam",
      ageGroup: "Người lớn",
      size: "L",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Đầm dự tiệc",
      slug: "shop-vn",
      priceLabel: "₫600.000",
      priceValue: 600000,
      gender: "Nữ",
      ageGroup: "Người lớn",
      size: "S",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Áo khoác len",
      slug: "shop-vn",
      priceLabel: "₫320.000",
      priceValue: 320000,
      gender: "Nữ",
      ageGroup: "Người lớn",
      size: "M",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      name: "Áo sơ mi nam",
      slug: "cong-ty-hk",
      priceLabel: "₫280.000",
      priceValue: 280000,
      gender: "Nam",
      ageGroup: "Người lớn",
      size: "L",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      name: "Quần âu cao cấp",
      slug: "cong-ty-hk",
      priceLabel: "₫550.000",
      priceValue: 550000,
      gender: "Nam",
      ageGroup: "Người lớn",
      size: "M",
      image: "/placeholder.svg",
    },
  ];

  // FILTER + SORT
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedGender.length > 0) {
      list = list.filter((p) => selectedGender.includes(p.gender));
    }

    if (selectedAgeGroup.length > 0) {
      list = list.filter((p) => selectedAgeGroup.includes(p.ageGroup));
    }

    if (selectedSize.length > 0) {
      list = list.filter((p) => selectedSize.includes(p.size));
    }

    if (sortOption === "low") list.sort((a, b) => a.priceValue - b.priceValue);
    if (sortOption === "high") list.sort((a, b) => b.priceValue - a.priceValue);
    if (sortOption === "newest") list.sort((a, b) => b.id - a.id);

    return list;
  }, [search, selectedGender, selectedAgeGroup, selectedSize, sortOption]);

  // RESET PAGE WHEN FILTER CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedGender, selectedAgeGroup, selectedSize, sortOption]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const displayedProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "...", totalPages);
    }
    return pages;
  };

  const pageList = generatePages();

  return (
    <div className="min-h-screen bg-white pt-6 px-4 md:px-8">
      {/* BREADCRUMB */}
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:text-blue-600">
          Trang chủ
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-semibold text-gray-900">Tất cả sản phẩm</span>
      </nav>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">Tất cả sản phẩm ({filtered.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* FILTER SIDEBAR */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl border shadow p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Bộ lọc</h3>
              <button
                onClick={() => {
                  setSelectedGender([]);
                  setSelectedAgeGroup([]);
                  setSelectedSize([]);
                  setSearch("");
                  setSortOption("default");
                }}
                className="text-blue-600 text-sm hover:underline"
              >
                Xóa lọc
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="font-semibold block mb-2">Tìm kiếm</label>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="font-semibold block mb-2">Giới tính</label>
              {["Nam", "Nữ"].map((gender) => (
                <label key={gender} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGender.includes(gender)}
                    onChange={() =>
                      setSelectedGender((prev) =>
                        prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
                      )
                    }
                  />
                  {gender}
                </label>
              ))}
            </div>

            {/* Age group */}
            <div>
              <label className="font-semibold block mb-2">Nhóm tuổi</label>
              {["Người lớn", "Trẻ em"].map((age) => (
                <label key={age} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAgeGroup.includes(age)}
                    onChange={() =>
                      setSelectedAgeGroup((prev) =>
                        prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
                      )
                    }
                  />
                  {age}
                </label>
              ))}
            </div>

            {/* Size */}
            <div>
              <label className="font-semibold block mb-2">Kích cỡ</label>
              {["S", "M", "L"].map((size) => (
                <label key={size} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSize.includes(size)}
                    onChange={() =>
                      setSelectedSize((prev) =>
                        prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                      )
                    }
                  />
                  {size}
                </label>
              ))}
            </div>

            {/* Sort */}
            <div>
              <label className="font-semibold block mb-2">Sắp xếp</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-600"
              >
                <option value="default">Mặc định</option>
                <option value="low">Giá thấp → cao</option>
                <option value="high">Giá cao → thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/company/${product.slug}/product/${product.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h4>
                  <p className="text-blue-600 font-bold text-sm">{product.priceLabel}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-center mt-10 gap-3">
            <button
              onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : p))}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>

            {pageList.map((page, index) => (
              <button
                key={index}
                disabled={page === "..."}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-medium transition ${
                  page === currentPage ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
